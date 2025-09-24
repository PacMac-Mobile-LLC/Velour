# Didit.me Age Verification Setup Guide

This guide will help you set up age verification for your Velour platform using Didit.me.

## 🔑 API Credentials

You've provided the following credentials:
- **API Key**: `21VsbJJtfkPlLDOEGeTue1v2j_do6n4uZC3bcTZG75c`
- **Secret Key**: `wW856WlimdwlD5XUmASGq4qqfhvsrjLj9yDwn_Ouzn4`

## 🌐 Webhook URL Configuration

For the **Webhook URL** field in your Didit.me dashboard, use:

```
https://velour-wxv9.onrender.com/api/verification/didit/webhook
```

This webhook endpoint will receive verification results from Didit and automatically update user verification status in your database.

## 🔧 Environment Variables

Add these environment variables to your server configuration:

### Server Environment Variables (.env)
```bash
# Didit.me Configuration
DIDIT_API_KEY=21VsbJJtfkPlLDOEGeTue1v2j_do6n4uZC3bcTZG75c
DIDIT_SECRET_KEY=wW856WlimdwlD5XUmASGq4qqfhvsrjLj9yDwn_Ouzn4
DIDIT_WEBHOOK_URL=https://velour-wxv9.onrender.com/api/verification/didit/webhook
```

### Render.com Environment Variables
Add these to your `velour-backend` service in Render:

1. Go to your Render dashboard
2. Select your `velour-backend` service
3. Go to Environment tab
4. Add these variables:
   - `DIDIT_API_KEY` = `21VsbJJtfkPlLDOEGeTue1v2j_do6n4uZC3bcTZG75c`
   - `DIDIT_SECRET_KEY` = `wW856WlimdwlD5XUmASGq4qqfhvsrjLj9yDwn_Ouzn4`
   - `DIDIT_WEBHOOK_URL` = `https://velour-wxv9.onrender.com/api/verification/didit/webhook`

## 📋 Didit.me Dashboard Configuration

1. **Login to your Didit.me account**: https://business.didit.me
2. **Navigate to Settings/Webhooks**
3. **Add Webhook URL**: `https://velour-wxv9.onrender.com/api/verification/didit/webhook`
4. **Select Events**: Choose "Verification Complete" and "Verification Failed"
5. **Save Configuration**

## 🚀 How It Works

### 1. User Onboarding
- When a user signs up as a creator, they'll see the age verification modal
- The system automatically creates a verification session with Didit
- User is redirected to Didit's verification page

### 2. Verification Process
- User uploads government-issued ID
- User takes a selfie for identity matching
- Didit processes the verification using AI

### 3. Webhook Processing
- Didit sends results to your webhook endpoint
- System automatically updates user verification status
- User receives notification of verification result

### 4. Access Control
- Only verified users can access creator features
- Unverified creators see verification prompts
- Verification status is tracked in user profiles

## 🔒 Security Features

- **Encrypted Data**: All verification data is encrypted
- **No ID Storage**: We only store verification status, not ID photos
- **Secure Webhooks**: Webhook endpoints are protected
- **Audit Trail**: Complete verification history is maintained

## 📊 Verification Statuses

- **`not_started`**: User hasn't initiated verification
- **`pending`**: Verification is being processed
- **`verified`**: User is age-verified and can create content
- **`failed`**: Verification failed (user can retry)
- **`expired`**: Verification session expired (user must restart)

## 🛠️ API Endpoints

The system provides these endpoints:

- `POST /api/verification/didit/initialize` - Start verification
- `GET /api/verification/status/:userId` - Check status
- `POST /api/verification/resend/:userId` - Resend verification
- `GET /api/verification/history/:userId` - Get verification history
- `POST /api/verification/didit/webhook` - Didit webhook endpoint

## 🎯 User Experience

### For New Creators:
1. Sign up and select "Creator" role
2. Age verification modal appears automatically
3. Click "Start Verification" button
4. Redirected to Didit verification page
5. Upload ID and take selfie
6. Return to platform after verification
7. Access all creator features

### For Existing Users:
- Verification status is checked on login
- Unverified creators see verification prompts
- Verified users have full platform access

## 🔧 Troubleshooting

### Common Issues:

1. **Webhook not receiving data**
   - Check webhook URL is correct
   - Verify Render service is running
   - Check server logs for errors

2. **Verification stuck in pending**
   - Check Didit API connectivity
   - Verify API credentials are correct
   - Check user's email for Didit notifications

3. **Users can't access creator features**
   - Verify user has `isAgeVerified: true` in database
   - Check verification status in admin panel
   - Ensure user role is set to 'creator'

## 📈 Monitoring

- Check verification stats: `GET /api/verification/stats`
- Monitor webhook logs in server console
- Track verification success rates
- Review failed verifications for patterns

## 🎉 Success!

Once configured, your platform will:
- ✅ Automatically verify all new creators
- ✅ Maintain compliance with age restrictions
- ✅ Provide seamless user experience
- ✅ Track verification status in real-time
- ✅ Handle webhook updates automatically

Your Velour platform is now fully compliant with age verification requirements!
