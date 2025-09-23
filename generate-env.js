#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 SubSpace Environment Variables Generator\n');

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);
console.log('');

console.log('📋 Copy these environment variables to your Render services:\n');

console.log('🔧 BACKEND ENVIRONMENT VARIABLES:');
console.log('NODE_ENV=production');
console.log('PORT=10000');
console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/subspace?retryWrites=true&w=majority');
console.log('JWT_SECRET=' + jwtSecret);
console.log('STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here');
console.log('STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here');
console.log('STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here');
console.log('CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name');
console.log('CLOUDINARY_API_KEY=your_cloudinary_api_key');
console.log('CLOUDINARY_API_SECRET=your_cloudinary_api_secret');
console.log('FRONTEND_URL=https://subspace-frontend.onrender.com');
console.log('');

console.log('🎨 FRONTEND ENVIRONMENT VARIABLES:');
console.log('REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here');
console.log('REACT_APP_API_URL=https://subspace-backend.onrender.com');
console.log('');

console.log('⚠️  IMPORTANT NOTES:');
console.log('1. Replace "your_stripe_*" values with your actual Stripe keys');
console.log('2. Replace "your_cloudinary_*" values with your actual Cloudinary credentials');
console.log('3. Update MONGODB_URI with your actual MongoDB Atlas connection string');
console.log('4. Update URLs with your actual Render service URLs after deployment');
console.log('5. Keep your JWT_SECRET secure and never share it publicly');
console.log('');

console.log('🚀 Next Steps:');
console.log('1. Set up MongoDB Atlas database');
console.log('2. Get Stripe API keys from dashboard.stripe.com');
console.log('3. Create Cloudinary account for file uploads');
console.log('4. Deploy backend service on Render');
console.log('5. Deploy frontend service on Render');
console.log('6. Configure Stripe webhooks');
console.log('7. Test your deployment!');
