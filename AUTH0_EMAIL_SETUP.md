# Auth0 Email Setup with SendGrid

This guide will help you set up custom email templates for Vibecodes using SendGrid and Auth0.

## 📧 Email Templates Created

- **Verification Email** - Sent when users sign up
- **Password Reset Email** - Sent when users request password reset
- **Welcome Email** - Sent after successful email verification

## 🚀 Step 1: Set Up SendGrid

### 1.1 Create SendGrid Account
1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for a free account (100 emails/day free)
3. Verify your email address

### 1.2 Get API Key
1. In SendGrid Dashboard → **Settings** → **API Keys**
2. Click **Create API Key**
3. Choose **Restricted Access**
4. Give it a name: "Auth0 Vibecodes"
5. Grant **Mail Send** permissions
6. Copy the API key (starts with `SG.`)

## 🔧 Step 2: Configure Auth0 Email Provider

### 2.1 Set Up SendGrid Provider
1. Go to your **Auth0 Dashboard**
2. Navigate to **Branding** → **Universal Login** → **Email Templates**
3. Click on **Verification Email** template
4. Click **Configure** button
5. Select **SendGrid** as provider
6. Enter your SendGrid API Key
7. Click **Save**

### 2.2 Configure Email Templates

#### Verification Email Template
1. In **Email Templates** → **Verification Email**
2. Click **Edit Template**
3. Replace the HTML content with the content from `auth0-email-templates/verification-email.html`
4. Update the `{{url}}` and `{{email}}` variables as needed
5. Click **Save**

#### Password Reset Template
1. In **Email Templates** → **Password Reset**
2. Click **Edit Template**
3. Replace the HTML content with the content from `auth0-email-templates/password-reset-email.html`
4. Update variables as needed
5. Click **Save**

#### Welcome Email (Optional)
1. In **Email Templates** → **Welcome Email**
2. Click **Edit Template**
3. Replace the HTML content with the content from `auth0-email-templates/welcome-email.html`
4. Update variables as needed
5. Click **Save**

## 🎨 Step 3: Customize Templates

### Template Variables Available
- `{{url}}` - Verification/reset link
- `{{email}}` - User's email address
- `{{name}}` - User's name (if available)
- `{{tenant}}` - Your Auth0 tenant name

### Branding Customization
The templates use your Vibecodes branding:
- **Primary Color**: `#ff69b4` (Pink)
- **Secondary Color**: `#7a288a` (Purple)
- **Logo**: "Vibecodes"
- **Tagline**: "Where Desire Meets Luxury"

## 🧪 Step 4: Test Email Templates

### 4.1 Test Verification Email
1. Go to your app and try to sign up with a new email
2. Check if the verification email arrives
3. Check spam folder if it doesn't arrive immediately

### 4.2 Test Password Reset
1. Go to login page and click "Forgot Password"
2. Enter your email address
3. Check if the reset email arrives

### 4.3 Test Email Rendering
1. Use email testing tools like [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com)
2. Test across different email clients (Gmail, Outlook, Apple Mail, etc.)

## 🔍 Step 5: Monitor and Debug

### 5.1 SendGrid Dashboard
- Monitor email delivery in SendGrid Dashboard
- Check bounce rates and delivery statistics
- Set up alerts for high bounce rates

### 5.2 Auth0 Logs
- Check Auth0 Dashboard → **Monitoring** → **Logs**
- Look for email-related errors
- Monitor authentication flows

### 5.3 Common Issues
- **Emails going to spam**: Add SPF, DKIM, and DMARC records
- **Template not loading**: Check HTML syntax and variable names
- **SendGrid errors**: Verify API key permissions

## 📊 Step 6: Production Optimization

### 6.1 Domain Authentication
1. In SendGrid → **Settings** → **Sender Authentication**
2. Authenticate your domain (`vibecodes.space`)
3. Add required DNS records
4. This improves deliverability and prevents spam

### 6.2 Email Analytics
1. Set up SendGrid Event Webhook
2. Track email opens, clicks, and bounces
3. Monitor user engagement with emails

### 6.3 A/B Testing
1. Create multiple versions of email templates
2. Test different subject lines and content
3. Optimize based on open and click rates

## 🚨 Troubleshooting

### Emails Not Sending
1. Check SendGrid API key permissions
2. Verify Auth0 email provider configuration
3. Check Auth0 logs for errors
4. Ensure SendGrid account is not suspended

### Emails Going to Spam
1. Authenticate your domain in SendGrid
2. Add proper SPF, DKIM, and DMARC records
3. Use a professional "From" address
4. Avoid spam trigger words in subject lines

### Template Not Rendering
1. Check HTML syntax
2. Verify template variables are correct
3. Test with simple HTML first
4. Check Auth0 template editor for errors

## 📞 Support

If you need help:
- **SendGrid Support**: [SendGrid Help Center](https://support.sendgrid.com)
- **Auth0 Support**: [Auth0 Support Center](https://support.auth0.com)
- **Vibecodes Support**: support@vibecodes.space

## 🎯 Next Steps

After setting up emails:
1. Test the complete user flow
2. Set up email analytics
3. Create additional email templates (notifications, etc.)
4. Implement email preferences for users
5. Set up automated email campaigns

---

**Note**: Remember to test thoroughly in a staging environment before deploying to production!
