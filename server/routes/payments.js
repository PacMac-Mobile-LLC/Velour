const express = require('express');
const router = express.Router();
const { authenticateToken, requireSubscriber } = require('../middleware/auth');
const { 
  createOrGetCustomer, 
  createSubscription, 
  cancelSubscription,
  createPaymentIntent,
  createSetupIntent,
  getPaymentMethods,
  createPrice,
  createProduct
} = require('../config/stripe');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Create customer and setup payment method
router.post('/setup-customer', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Create or get Stripe customer
    const customer = await createOrGetCustomer(user);
    
    // Update user with customer ID
    user.subscription.stripeCustomerId = customer.id;
    await user.save();
    
    // Create setup intent for payment method
    const setupIntent = await createSetupIntent(customer.id);
    
    res.json({
      success: true,
      customerId: customer.id,
      setupIntent: {
        clientSecret: setupIntent.client_secret,
        id: setupIntent.id
      }
    });
  } catch (error) {
    console.error('Setup customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup customer'
    });
  }
});

// Get customer's payment methods
router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.subscription.stripeCustomerId) {
      return res.json({
        success: true,
        paymentMethods: []
      });
    }
    
    const paymentMethods = await getPaymentMethods(user.subscription.stripeCustomerId);
    
    res.json({
      success: true,
      paymentMethods: paymentMethods.data.map(pm => ({
        id: pm.id,
        type: pm.type,
        card: pm.card ? {
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year
        } : null
      }))
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment methods'
    });
  }
});

// Subscribe to a creator
router.post('/subscribe', authenticateToken, requireSubscriber, async (req, res) => {
  try {
    const { creatorId, plan, interval } = req.body;
    const subscriber = req.user;
    
    // Validate input
    if (!creatorId || !plan || !interval) {
      return res.status(400).json({
        success: false,
        message: 'Creator ID, plan, and interval are required'
      });
    }
    
    // Get creator
    const creator = await User.findById(creatorId);
    if (!creator || creator.role !== 'creator') {
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }
    
    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({
      subscriber: subscriber._id,
      creator: creatorId,
      status: { $in: ['active', 'past_due'] }
    });
    
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'Already subscribed to this creator'
      });
    }
    
    // Get or create customer
    const customer = await createOrGetCustomer(subscriber);
    subscriber.subscription.stripeCustomerId = customer.id;
    await subscriber.save();
    
    // Create or get product for creator
    let productId = creator.stripeProductId;
    if (!productId) {
      const product = await createProduct(creator.profile.displayName);
      productId = product.id;
      creator.stripeProductId = productId;
      await creator.save();
    }
    
    // Create price
    const price = await createPrice(
      creator.creatorSettings.subscriptionPrice[interval === 'year' ? 'yearly' : 'monthly'],
      interval,
      productId
    );
    
    // Create subscription
    const stripeSubscription = await createSubscription(customer.id, price.id);
    
    // Save subscription to database
    const subscription = new Subscription({
      subscriber: subscriber._id,
      creator: creatorId,
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: customer.id,
      status: stripeSubscription.status,
      plan,
      billing: {
        interval,
        amount: creator.creatorSettings.subscriptionPrice[interval === 'year' ? 'yearly' : 'monthly'],
        currency: 'usd'
      },
      periods: {
        current: {
          start: new Date(stripeSubscription.current_period_start * 1000),
          end: new Date(stripeSubscription.current_period_end * 1000)
        }
      }
    });
    
    await subscription.save();
    
    // Update creator's subscriber count
    creator.creatorSettings.subscriberCount += 1;
    await creator.save();
    
    res.json({
      success: true,
      subscription: subscription.getSummary(),
      clientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription'
    });
  }
});

// Cancel subscription
router.post('/cancel-subscription/:subscriptionId', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const user = req.user;
    
    // Find subscription
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      subscriber: user._id
    });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    // Cancel in Stripe
    const cancelledSubscription = await cancelSubscription(
      subscription.stripeSubscriptionId,
      req.body.immediately || false
    );
    
    // Update in database
    subscription.status = cancelledSubscription.status;
    subscription.cancellation = {
      cancelledAt: new Date(),
      cancelAtPeriodEnd: cancelledSubscription.cancel_at_period_end,
      cancellationReason: req.body.reason || 'User requested'
    };
    
    await subscription.save();
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: subscription.getSummary()
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
});

// Get user's subscriptions
router.get('/subscriptions', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    const subscriptions = await Subscription.find({
      subscriber: user._id
    }).populate('creator', 'username profile creatorSettings');
    
    res.json({
      success: true,
      subscriptions: subscriptions.map(sub => ({
        ...sub.getSummary(),
        creator: {
          _id: sub.creator._id,
          username: sub.creator.username,
          profile: sub.creator.profile,
          creatorSettings: sub.creator.creatorSettings
        }
      }))
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscriptions'
    });
  }
});

// Create payment intent for pay-per-view content
router.post('/pay-per-view', authenticateToken, async (req, res) => {
  try {
    const { contentId, amount } = req.body;
    const user = req.user;
    
    if (!contentId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Content ID and amount are required'
      });
    }
    
    // Get or create customer
    const customer = await createOrGetCustomer(user);
    user.subscription.stripeCustomerId = customer.id;
    await user.save();
    
    // Create payment intent
    const paymentIntent = await createPaymentIntent(amount, customer.id, {
      contentId,
      userId: user._id.toString()
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Pay per view error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
});

// Get subscription analytics for creators
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== 'creator') {
      return res.status(403).json({
        success: false,
        message: 'Creator access required'
      });
    }
    
    const subscriptions = await Subscription.find({
      creator: user._id,
      status: 'active'
    }).populate('subscriber', 'username profile');
    
    const analytics = {
      totalSubscribers: subscriptions.length,
      monthlyRevenue: subscriptions.reduce((sum, sub) => {
        return sum + (sub.billing.interval === 'month' ? sub.billing.amount : sub.billing.amount / 12);
      }, 0),
      yearlyRevenue: subscriptions.reduce((sum, sub) => {
        return sum + (sub.billing.interval === 'year' ? sub.billing.amount : sub.billing.amount * 12);
      }, 0),
      subscribersByPlan: subscriptions.reduce((acc, sub) => {
        acc[sub.plan] = (acc[sub.plan] || 0) + 1;
        return acc;
      }, {})
    };
    
    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics'
    });
  }
});

module.exports = router;
