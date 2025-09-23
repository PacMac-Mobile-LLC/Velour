# Cloudinary Setup Guide

This guide will help you find your Cloudinary credentials and set up the `CLOUDINARY_URL` environment variable.

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up For Free"
3. Fill out the registration form
4. Verify your email address

## Step 2: Find Your Cloudinary Credentials

### 2.1 Access Your Dashboard
1. Log in to [Cloudinary Console](https://cloudinary.com/console)
2. You'll see your dashboard with account information

### 2.2 Get Your API Credentials
1. In the left sidebar, click on the **Settings** icon (⚙️ gear symbol)
2. Click on **API Keys** tab
3. You'll see three important values:

```
Cloud Name: dhlm4xdd8 (this is your cloud name)
API Key: 123456789012345 (this is your API key)
API Secret: abcdefg1234567 (this is your API secret)
```

### 2.3 Reveal Your API Secret
- Your API Secret might be hidden for security
- Click the "reveal" button to show it
- You may need to enter your password to confirm

## Step 3: Format Your CLOUDINARY_URL

### 3.1 URL Format
The `CLOUDINARY_URL` follows this exact format:
```
cloudinary://<api_key>:<api_secret>@<cloud_name>
```

### 3.2 Example
If your credentials are:
- **Cloud Name**: `dhlm4xdd8`
- **API Key**: `123456789012345`
- **API Secret**: `abcdefg1234567`

Then your `CLOUDINARY_URL` would be:
```
cloudinary://123456789012345:abcdefg1234567@dhlm4xdd8
```

## Step 4: Add to Your Environment Variables

### 4.1 For Local Development
Add to your `server/.env` file:
```env
CLOUDINARY_URL=cloudinary://123456789012345:abcdefg1234567@dhlm4xdd8
```

### 4.2 For Render Deployment
Add to your backend service environment variables:
```env
CLOUDINARY_URL=cloudinary://123456789012345:abcdefg1234567@dhlm4xdd8
```

## Step 5: Alternative Method (Individual Variables)

If you prefer to use individual variables instead of the URL:

### 5.1 Individual Environment Variables
```env
CLOUDINARY_CLOUD_NAME=dhlm4xdd8
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefg1234567
```

### 5.2 Update Your Code
If using individual variables, update your server code to use them:

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

## Step 6: Test Your Configuration

### 6.1 Test Upload (Optional)
You can test your Cloudinary setup with this simple script:

```javascript
const cloudinary = require('cloudinary').v2;

// Test configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test upload
cloudinary.uploader.upload('https://via.placeholder.com/150', 
  function(error, result) {
    if (error) {
      console.error('Cloudinary test failed:', error);
    } else {
      console.log('Cloudinary test successful:', result.url);
    }
  }
);
```

## Security Notes

### ⚠️ Important Security Considerations:
1. **Never commit** your API secret to git
2. **Never expose** your API secret in client-side code
3. **Use environment variables** for all credentials
4. **Rotate your API secret** periodically
5. **Use different credentials** for development and production

### 🔒 Best Practices:
- Store credentials in environment variables
- Use `.env` files for local development (and add to `.gitignore`)
- Use your hosting platform's environment variable system for production
- Consider using a secrets management service for production

## Troubleshooting

### Common Issues:

1. **"Invalid credentials" error**
   - Double-check your API key and secret
   - Make sure there are no extra spaces or characters
   - Verify your cloud name is correct

2. **"Cloud not found" error**
   - Check your cloud name spelling
   - Make sure you're using the correct account

3. **Upload failures**
   - Check your internet connection
   - Verify your account hasn't exceeded limits
   - Check Cloudinary service status

### Getting Help:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com)
- [Cloudinary Community](https://cloudinary.com/community)

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB bandwidth per month
- 25,000 transformations per month
- 1,000 API requests per hour

This should be sufficient for development and small production applications.
