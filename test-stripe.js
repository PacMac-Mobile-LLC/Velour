#!/usr/bin/env node

/**
 * Stripe Integration Test Script
 * 
 * This script tests the Stripe integration to ensure everything is working correctly.
 * 
 * Run this script with: node test-stripe.js
 * 
 * Make sure to set your STRIPE_SECRET_KEY environment variable first:
 * source stripe.env
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripeIntegration() {
  try {
    console.log('🧪 Testing Stripe Integration...\n');

    // Test 1: Verify API key is working
    console.log('1. Testing API key...');
    const account = await stripe.accounts.retrieve();
    console.log(`✅ API key valid - Account: ${account.display_name || account.id}`);
    console.log(`   Country: ${account.country}`);
    console.log(`   Currency: ${account.default_currency}`);
    console.log(`   Charges enabled: ${account.charges_enabled}`);
    console.log(`   Payouts enabled: ${account.payouts_enabled}\n`);

    // Test 2: List existing products
    console.log('2. Checking existing products...');
    const products = await stripe.products.list({ limit: 10 });
    console.log(`✅ Found ${products.data.length} products:`);
    products.data.forEach(product => {
      console.log(`   - ${product.name} (${product.id})`);
    });
    console.log('');

    // Test 3: List existing prices
    console.log('3. Checking existing prices...');
    const prices = await stripe.prices.list({ limit: 10 });
    console.log(`✅ Found ${prices.data.length} prices:`);
    prices.data.forEach(price => {
      const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A';
      const interval = price.recurring ? price.recurring.interval : 'one-time';
      console.log(`   - $${amount} ${price.currency} (${interval}) - ${price.id}`);
    });
    console.log('');

    // Test 4: Create a test customer
    console.log('4. Creating test customer...');
    const testCustomer = await stripe.customers.create({
      email: 'test@example.com',
      name: 'Test Customer',
      metadata: {
        test: 'true',
        created_by: 'stripe_test_script'
      }
    });
    console.log(`✅ Test customer created: ${testCustomer.id}`);
    console.log(`   Email: ${testCustomer.email}`);
    console.log(`   Name: ${testCustomer.name}\n`);

    // Test 5: Create a test payment intent
    console.log('5. Creating test payment intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000, // $20.00
      currency: 'usd',
      customer: testCustomer.id,
      metadata: {
        test: 'true',
        description: 'Test payment intent'
      }
    });
    console.log(`✅ Test payment intent created: ${paymentIntent.id}`);
    console.log(`   Amount: $${(paymentIntent.amount / 100).toFixed(2)}`);
    console.log(`   Status: ${paymentIntent.status}`);
    console.log(`   Client Secret: ${paymentIntent.client_secret.substring(0, 20)}...\n`);

    // Test 6: Clean up test data
    console.log('6. Cleaning up test data...');
    await stripe.customers.del(testCustomer.id);
    console.log(`✅ Test customer deleted: ${testCustomer.id}\n`);

    console.log('🎉 All Stripe tests passed!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your environment variables with the correct keys');
    console.log('2. Run "node stripe-setup.js" to create products and prices');
    console.log('3. Test the payment flow in your application');
    console.log('4. Set up webhooks for production use');

  } catch (error) {
    console.error('❌ Stripe test failed:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n💡 This usually means your API key is incorrect or missing.');
      console.log('   Make sure to set your STRIPE_SECRET_KEY environment variable:');
      console.log('   source stripe.env');
    } else if (error.type === 'StripePermissionError') {
      console.log('\n💡 This usually means your API key doesn\'t have the required permissions.');
      console.log('   Make sure you\'re using a secret key (sk_...) not a publishable key (pk_...).');
    }
    
    process.exit(1);
  }
}

// Check if Stripe secret key is provided
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Please set your STRIPE_SECRET_KEY environment variable');
  console.log('Example: source stripe.env');
  process.exit(1);
}

// Run the tests
testStripeIntegration();
