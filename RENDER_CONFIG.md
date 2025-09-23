# Render Configuration Fix

## The Problem
Render is trying to run commands from the root directory, but the server dependencies are in the `server/` directory.

## Solution: Manual Configuration in Render Dashboard

### Step 1: Go to Your Render Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Go to **"Settings"** tab

### Step 2: Update Service Settings

**Root Directory:**
```
server
```

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

### Step 3: Alternative Configuration (if above doesn't work)

**Root Directory:**
```
(leave empty)
```

**Build Command:**
```
cd server && npm install
```

**Start Command:**
```
cd server && npm start
```

## Step 4: Redeploy
1. Go to your service dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment to complete

## Step 5: Test
Visit: `https://your-service-name.onrender.com/api/test`

You should see: `{"success": true, "message": "API is working!"}`

## Environment Variables
Make sure you have all these set:

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

## Troubleshooting

If you're still getting the "Cannot find module 'mongoose'" error:

1. **Check the build logs** - make sure `npm install` is running in the server directory
2. **Verify Root Directory** - it should be set to `server`
3. **Check Environment Variables** - make sure all are set correctly
4. **Try the alternative configuration** above

The key is making sure Render knows to look in the `server/` directory for the package.json and node_modules.
