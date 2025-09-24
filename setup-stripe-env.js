#!/usr/bin/env node

/**
 * Stripe Environment Setup Script
 * 
 * This script helps you set up your Stripe environment variables.
 * It will create the necessary .env files for both client and server.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupStripeEnvironment() {
  console.log('🚀 Stripe Environment Setup\n');
  console.log('This script will help you set up your Stripe environment variables.\n');
  console.log('You can find your API keys at: https://dashboard.stripe.com/apikeys\n');

  try {
    // Get Stripe keys from user
    const secretKey = await question('Enter your Stripe Secret Key (sk_test_... or sk_live_...): ');
    const publishableKey = await question('Enter your Stripe Publishable Key (pk_test_... or pk_live_...): ');
    const webhookSecret = await question('Enter your Stripe Webhook Secret (whsec_...) [optional]: ');

    if (!secretKey || !publishableKey) {
      console.log('❌ Secret key and publishable key are required!');
      process.exit(1);
    }

    // Validate keys
    if (!secretKey.startsWith('sk_')) {
      console.log('❌ Secret key should start with "sk_"');
      process.exit(1);
    }

    if (!publishableKey.startsWith('pk_')) {
      console.log('❌ Publishable key should start with "pk_"');
      process.exit(1);
    }

    // Create server .env file
    const serverEnvPath = path.join(__dirname, 'server', '.env');
    const serverEnvContent = `# Server Configuration
NODE_ENV=development
PORT=5001

# Database
MONGODB_URI=mongodb://localhost:27017/velour

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=${secretKey}
STRIPE_PUBLISHABLE_KEY=${publishableKey}
${webhookSecret ? `STRIPE_WEBHOOK_SECRET=${webhookSecret}` : '# STRIPE_WEBHOOK_SECRET=your_webhook_secret_here'}

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
`;

    // Create client .env file
    const clientEnvPath = path.join(__dirname, 'client', '.env');
    const clientEnvContent = `# Client Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=${publishableKey}

# Auth0 Configuration
REACT_APP_AUTH0_DOMAIN=vibecodes.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=OejuDvHhYdI5z7a2x6K3R5zWQxhy0gY2
REACT_APP_AUTH0_REDIRECT_URI=https://www.vibecodes.space

# Stripe Price IDs (update after running stripe-setup.js)
REACT_APP_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_premium_monthly_here
REACT_APP_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_premium_yearly_here
`;

    // Write files
    fs.writeFileSync(serverEnvPath, serverEnvContent);
    fs.writeFileSync(clientEnvPath, clientEnvContent);

    console.log('\n✅ Environment files created successfully!');
    console.log(`   Server: ${serverEnvPath}`);
    console.log(`   Client: ${clientEnvPath}\n`);

    console.log('📋 Next steps:');
    console.log('1. Run "node stripe-setup.js" to create products and prices');
    console.log('2. Update the price IDs in your client .env file');
    console.log('3. Run "node test-stripe.js" to test the integration');
    console.log('4. Start your server and client to test payments\n');

    console.log('🧪 Test with these cards:');
    console.log('   Success: 4242 4242 4242 4242');
    console.log('   Declined: 4000 0000 0000 0002\n');

  } catch (error) {
    console.error('❌ Error setting up environment:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupStripeEnvironment();
