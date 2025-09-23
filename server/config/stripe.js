const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe configuration
const stripeConfig = {
  apiVersion: '2023-10-16',
  maxNetworkRetries: 3,
  timeout: 10000,
};

// Initialize Stripe with configuration
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY, stripeConfig);

// Webhook endpoint secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Create or retrieve customer
const createOrGetCustomer = async (user) => {
  try {
    if (user.subscription.stripeCustomerId) {
      const customer = await stripeInstance.customers.retrieve(user.subscription.stripeCustomerId);
      return customer;
    }

    const customer = await stripeInstance.customers.create({
      email: user.email,
      name: user.profile.displayName,
      metadata: {
        userId: user._id.toString(),
        username: user.username
      }
    });

    return customer;
  } catch (error) {
    console.error('Error creating/retrieving customer:', error);
    throw error;
  }
};

// Create subscription
const createSubscription = async (customerId, priceId, trialDays = 0) => {
  try {
    const subscriptionData = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    };

    if (trialDays > 0) {
      subscriptionData.trial_period_days = trialDays;
    }

    const subscription = await stripeInstance.subscriptions.create(subscriptionData);
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

// Cancel subscription
const cancelSubscription = async (subscriptionId, immediately = false) => {
  try {
    if (immediately) {
      return await stripeInstance.subscriptions.cancel(subscriptionId);
    } else {
      return await stripeInstance.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

// Create payment intent for pay-per-view content
const createPaymentIntent = async (amount, customerId, metadata = {}) => {
  try {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Create setup intent for saving payment methods
const createSetupIntent = async (customerId) => {
  try {
    const setupIntent = await stripeInstance.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    return setupIntent;
  } catch (error) {
    console.error('Error creating setup intent:', error);
    throw error;
  }
};

// Get customer's payment methods
const getPaymentMethods = async (customerId) => {
  try {
    const paymentMethods = await stripeInstance.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods;
  } catch (error) {
    console.error('Error getting payment methods:', error);
    throw error;
  }
};

// Create price for subscription
const createPrice = async (amount, interval, productId) => {
  try {
    const price = await stripeInstance.prices.create({
      unit_amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      recurring: { interval },
      product: productId,
    });

    return price;
  } catch (error) {
    console.error('Error creating price:', error);
    throw error;
  }
};

// Create product for creator
const createProduct = async (creatorName) => {
  try {
    const product = await stripeInstance.products.create({
      name: `${creatorName} Subscription`,
      type: 'service',
    });

    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Verify webhook signature
const verifyWebhookSignature = (payload, signature) => {
  try {
    const event = stripeInstance.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
};

module.exports = {
  stripe: stripeInstance,
  createOrGetCustomer,
  createSubscription,
  cancelSubscription,
  createPaymentIntent,
  createSetupIntent,
  getPaymentMethods,
  createPrice,
  createProduct,
  verifyWebhookSignature,
  webhookSecret
};
