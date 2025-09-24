#!/usr/bin/env node

/**
 * Stripe Setup Script for Velour Creator Pricing
 * 
 * This script helps you create the necessary Stripe products and prices
 * for the Creator Pricing plans in your Stripe dashboard.
 * 
 * Run this script with: node stripe-setup.js
 * 
 * Make sure to set your STRIPE_SECRET_KEY environment variable first:
 * export STRIPE_SECRET_KEY=sk_live_your_live_secret_key_here
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  try {
    console.log('🚀 Setting up Stripe products for Velour Creator Pricing...\n');

    // Create Premium Creator Product
    const premiumProduct = await stripe.products.create({
      name: 'Velour Premium Creator',
      description: 'Premium creator plan with advanced features and priority support',
      metadata: {
        plan_type: 'premium_creator',
        features: 'priority_support,advanced_analytics,custom_branding,early_access,revenue_optimization'
      }
    });

    console.log('✅ Created Premium Creator Product:', premiumProduct.id);

    // Create Premium Creator Monthly Price
    const premiumMonthlyPrice = await stripe.prices.create({
      unit_amount: 2900, // $29.00 in cents
      currency: 'usd',
      recurring: { interval: 'month' },
      product: premiumProduct.id,
      metadata: {
        plan: 'premium',
        interval: 'month',
        amount: '29.00'
      }
    });

    console.log('✅ Created Premium Creator Monthly Price:', premiumMonthlyPrice.id);

    // Create Premium Creator Yearly Price (with discount)
    const premiumYearlyPrice = await stripe.prices.create({
      unit_amount: 29000, // $290.00 in cents (2 months free)
      currency: 'usd',
      recurring: { interval: 'year' },
      product: premiumProduct.id,
      metadata: {
        plan: 'premium',
        interval: 'year',
        amount: '290.00',
        discount: '2_months_free'
      }
    });

    console.log('✅ Created Premium Creator Yearly Price:', premiumYearlyPrice.id);

    // Create Enterprise Product
    const enterpriseProduct = await stripe.products.create({
      name: 'Velour Enterprise',
      description: 'Enterprise plan with dedicated support and custom integrations',
      metadata: {
        plan_type: 'enterprise',
        features: 'dedicated_manager,custom_integrations,white_label,24_7_support,custom_pricing'
      }
    });

    console.log('✅ Created Enterprise Product:', enterpriseProduct.id);

    console.log('\n🎉 Stripe setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your server environment variables:');
    console.log(`   STRIPE_SECRET_KEY=sk_live_your_live_secret_key_here`);
    console.log(`   STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key_here`);
    console.log('\n2. Update your client environment variables:');
    console.log(`   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key_here`);
    console.log('\n3. Update the PricingPlans component with the correct price IDs:');
    console.log(`   Premium Monthly: ${premiumMonthlyPrice.id}`);
    console.log(`   Premium Yearly: ${premiumYearlyPrice.id}`);
    console.log('\n4. Set up webhooks in your Stripe dashboard:');
    console.log('   - Go to Stripe Dashboard > Webhooks');
    console.log('   - Add endpoint: https://your-domain.com/api/payments/webhook');
    console.log('   - Select events: invoice.payment_succeeded, customer.subscription.updated, etc.');
    console.log('\n5. Test the integration with Stripe test cards:');
    console.log('   - 4242 4242 4242 4242 (Visa)');
    console.log('   - 4000 0000 0000 0002 (Declined card)');

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message);
    process.exit(1);
  }
}

// Check if Stripe secret key is provided
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Please set your STRIPE_SECRET_KEY environment variable');
  console.log('Example: export STRIPE_SECRET_KEY=sk_live_your_live_secret_key_here');
  process.exit(1);
}

// Run the setup
setupStripeProducts();
