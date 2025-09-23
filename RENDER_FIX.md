# Render Deployment Fix

## Issue
The deployment is failing because Render is trying to install dependencies from the root directory, but the server dependencies are in the `server/` directory.

## Solution

### Option 1: Update Render Service Settings (Recommended)

1. Go to your Render dashboard
2. Click on your backend service
3. Go to "Settings" tab
4. Update these settings:

**Build Command:**
```bash
cd server && npm install
```

**Start Command:**
```bash
cd server && npm start
```

**Root Directory:**
```
server
```

### Option 2: Use the Updated Configuration

I've updated the `render.yaml` and `package.json` files. You can either:

1. **Redeploy** with the updated configuration, or
2. **Manually update** your Render service settings as shown in Option 1

### Option 3: Manual Fix in Render Dashboard

1. Go to your Render service
2. Click "Manual Deploy" → "Deploy latest commit"
3. In the build settings, make sure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## Environment Variables

Make sure you have all these environment variables set in your Render service:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/subspace?retryWrites=true&w=majority
JWT_SECRET=91fef80b9f23af841e184e96320b0d177e06ce48979b90d31be055da5b1719fc4a761c8212a94e42e057db97f1dab7b81a8ac4783ae0491d267efe6206cad1c8
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_xqEx4BE2Yt7s5wx6d6Q0vLeXmZNmE2JA
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
FRONTEND_URL=https://your-frontend-service.onrender.com
```

## Test After Fix

1. Wait for deployment to complete
2. Visit: `https://your-service.onrender.com/api/test`
3. You should see: `{"success": true, "message": "API is working!"}`

## If Still Having Issues

1. Check the Render logs for any error messages
2. Make sure all environment variables are set correctly
3. Verify your MongoDB connection string is correct
4. Check that your Stripe keys are valid
