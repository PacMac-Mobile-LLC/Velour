# Render Deployment Guide for Velour

This guide will help you deploy your Velour subscription platform to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **Stripe Account**: Get your API keys from [stripe.com](https://stripe.com)
3. **MongoDB Atlas**: Set up a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
4. **Cloudinary Account**: For file uploads at [cloudinary.com](https://cloudinary.com)

## Step 1: Prepare Your Services

### 1.1 MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Render
5. Get your connection string

### 1.2 Stripe Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from the Developers section
3. Set up webhooks pointing to your Render backend URL

### 1.3 Cloudinary Setup (Optional)
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your cloud name, API key, and API secret

## Step 2: Deploy Backend Service

### 2.1 Create Web Service
1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `velour-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.2 Environment Variables
Add these environment variables in the Render dashboard:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/velour?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://velour-frontend.onrender.com
```

### 2.3 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://velour-backend.onrender.com`)

## Step 3: Deploy Frontend Service

### 3.1 Create Static Site
1. Go to your Render dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `velour-frontend`
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

### 3.2 Environment Variables
Add these environment variables:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
REACT_APP_API_URL=https://velour-backend.onrender.com
```

### 3.3 Deploy Frontend
1. Click "Create Static Site"
2. Wait for deployment to complete
3. Note your frontend URL (e.g., `https://velour-frontend.onrender.com`)

## Step 4: Configure Stripe Webhooks

### 4.1 Add Webhook Endpoint
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. **Endpoint URL**: `https://velour-backend.onrender.com/api/webhooks/stripe`
4. **Events to send**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the webhook secret and add it to your backend environment variables

## Step 5: Update Environment Variables

### 5.1 Update Backend Environment Variables
Go back to your backend service and update:
- `FRONTEND_URL` with your actual frontend URL
- `STRIPE_WEBHOOK_SECRET` with the webhook secret from Stripe

### 5.2 Update Frontend Environment Variables
Go to your frontend service and update:
- `REACT_APP_API_URL` with your actual backend URL

## Step 6: Test Your Deployment

### 6.1 Test Backend
1. Visit `https://subspace-backend.onrender.com/api/test`
2. You should see: `{"success": true, "message": "API is working!"}`

### 6.2 Test Frontend
1. Visit your frontend URL
2. Try registering a new user
3. Test the authentication flow

### 6.3 Test Stripe Integration
1. Create a test subscription
2. Check Stripe dashboard for webhook events
3. Verify payments are processed correctly

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

### 7.2 Update Environment Variables
Update your environment variables with the new domain:
- Backend: `FRONTEND_URL=https://yourdomain.com`
- Frontend: `REACT_APP_API_URL=https://api.yourdomain.com`

## Environment Variables Reference

### Backend Environment Variables
```env
# Required
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend Environment Variables
```env
# Required
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_API_URL=https://your-backend-url.com
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in package.json
   - Verify build commands are correct
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Stripe Webhook Issues**
   - Verify webhook URL is correct
   - Check webhook secret matches
   - Test webhook events in Stripe dashboard

4. **CORS Issues**
   - Update CORS settings in server/index.js
   - Verify FRONTEND_URL environment variable

### Getting Help

1. Check Render logs in the dashboard
2. Check MongoDB Atlas logs
3. Check Stripe webhook logs
4. Use browser developer tools for frontend issues

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to git
   - Use Render's environment variable system
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Limit IP access when possible
   - Enable MongoDB Atlas security features

3. **API Security**
   - Use HTTPS in production
   - Implement rate limiting
   - Validate all inputs

## Monitoring and Maintenance

1. **Monitor Performance**
   - Use Render's metrics dashboard
   - Set up alerts for downtime
   - Monitor database performance

2. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Test updates in staging first

3. **Backup Strategy**
   - MongoDB Atlas provides automatic backups
   - Consider additional backup solutions
   - Test restore procedures regularly
