# Deployment Fixes

## Issues Found and Solutions

### 1. MongoDB Atlas IP Whitelist Issue

**Error:** `Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.`

**Solution:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on your cluster
3. Go to **"Network Access"** in the left sidebar
4. Click **"Add IP Address"**
5. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Click **"Confirm"**

**Alternative (More Secure):**
- Add Render's IP ranges (but this is more complex)
- For development, allowing all IPs is fine

### 2. Stripe Configuration Error

**Error:** `TypeError: stripe is not a function`

**Solution:**
I've updated the code to handle missing Stripe keys gracefully. Make sure you have these environment variables set in Render:

```env
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_xqEx4BE2Yt7s5wx6d6Q0vLeXmZNmE2JA
```

### 3. MongoDB Deprecation Warnings

**Fixed:** Removed deprecated `useNewUrlParser` and `useUnifiedTopology` options.

## Complete Environment Variables Checklist

Make sure you have ALL these environment variables set in your Render backend service:

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

## Steps to Fix

### 1. Fix MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Network Access → Add IP Address → Allow Access from Anywhere
3. Wait 2-3 minutes for changes to propagate

### 2. Update Environment Variables
1. Go to your Render service
2. Environment tab
3. Add/update all the variables above
4. Make sure to replace placeholder values with real ones

### 3. Redeploy
1. Go to your Render service
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete

### 4. Test
Visit: `https://your-service-name.onrender.com/api/test`

You should see: `{"success": true, "message": "API is working!"}`

## Troubleshooting

### If MongoDB still fails:
1. Check your connection string format
2. Verify username/password are correct
3. Make sure database name is correct
4. Check if your cluster is running

### If Stripe still fails:
1. Verify your Stripe keys are correct
2. Make sure you're using live keys (sk_live_...) for production
3. Check that webhook secret matches

### If port binding fails:
1. Make sure PORT=10000 is set
2. Check that your app is listening on process.env.PORT

## Next Steps After Fix

1. **Test the API endpoint**
2. **Set up your frontend service**
3. **Configure Stripe webhooks**
4. **Test the complete flow**

The server should now start successfully! 🎉
