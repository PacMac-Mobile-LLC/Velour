# Auth0 Setup Guide for Velour Platform

## 🚀 **Quick Setup Steps**

### 1. **Create Auth0 Account**
1. Go to [auth0.com](https://auth0.com) and sign up for a free account
2. Choose "Personal" plan (free tier includes 7,000 active users)

### 2. **Create Application**
1. In Auth0 Dashboard, go to **Applications** → **Applications**
2. Click **"Create Application"**
3. Name: `Velour Platform`
4. Type: **Single Page Application**
5. Click **"Create"**

### 3. **Configure Application Settings**
In your application settings, update:

**Allowed Callback URLs:**
```
http://localhost:3000, https://videochat-wv3g.onrender.com
```

**Allowed Logout URLs:**
```
http://localhost:3000, https://videochat-wv3g.onrender.com
```

**Allowed Web Origins:**
```
http://localhost:3000, https://videochat-wv3g.onrender.com
```

### 4. **Enable Twitter (X) Social Connection**
1. Go to **Authentication** → **Social**
2. Click **"Create Connection"**
3. Select **"Twitter"**
4. You'll need to create a Twitter App:
   - Go to [developer.twitter.com](https://developer.twitter.com)
   - Create a new app
   - Get API Key and API Secret
   - Set Callback URL: `https://your-domain.auth0.com/login/callback`
5. Enter Twitter API credentials in Auth0
6. **Enable** the Twitter connection

### 5. **Environment Variables**
Create a `.env` file in the `client` directory:

```bash
# Auth0 Configuration
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_AUTH0_REDIRECT_URI=https://videochat-wv3g.onrender.com
REACT_APP_AUTH0_AUDIENCE=your-api-identifier

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# API Configuration
REACT_APP_API_URL=https://videochat-wv3g.onrender.com
```

### 6. **Deploy to Render**
1. Add environment variables to Render dashboard
2. Deploy the updated code

## 🎯 **What This Gives You**

✅ **Twitter (X) Login** - Users can sign in with their Twitter account
✅ **Secure Authentication** - Auth0 handles all security
✅ **User Profiles** - Automatic profile creation from Twitter data
✅ **No Backend Auth Issues** - Bypasses the 500 error completely
✅ **Production Ready** - Enterprise-grade authentication

## 🔧 **Testing**

1. **Local Testing:**
   ```bash
   cd client
   npm start
   ```

2. **Production Testing:**
   - Deploy to Render
   - Test Twitter login on live site

## 🚨 **Important Notes**

- **Free Tier Limits:** 7,000 active users per month
- **Twitter App:** You need to create a Twitter Developer App
- **Domain:** Use your actual Auth0 domain (not the example)
- **Security:** Auth0 handles all security best practices

## 🆘 **Troubleshooting**

**Common Issues:**
1. **"Invalid callback URL"** - Check allowed callback URLs in Auth0
2. **"Twitter connection failed"** - Verify Twitter app credentials
3. **"Domain not found"** - Check REACT_APP_AUTH0_DOMAIN value

**Need Help?**
- Auth0 Documentation: [auth0.com/docs](https://auth0.com/docs)
- Twitter Developer Docs: [developer.twitter.com](https://developer.twitter.com)
