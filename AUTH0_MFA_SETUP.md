# Auth0 Custom MFA Page Setup

This guide will help you implement the custom Velour-themed MFA (Multi-Factor Authentication) page in your Auth0 dashboard.

## 🔐 Custom MFA Page Features

The custom MFA page includes:
- ✅ **Velour Branding** - Logo and theme matching your app
- ✅ **Security Focus** - Clear messaging about account protection
- ✅ **Modern Design** - Clean, professional appearance with security icon
- ✅ **Responsive Layout** - Works perfectly on all devices
- ✅ **Auto-formatting** - Automatically formats 6-digit codes
- ✅ **Auto-submit** - Submits when 6 digits are entered
- ✅ **Resend Functionality** - Countdown timer for resending codes
- ✅ **Error Handling** - Clear error messages and loading states
- ✅ **Security Reassurance** - Explains why MFA is important

## 🚀 Setup Instructions

### Step 1: Enable MFA in Auth0

1. **Go to Auth0 Dashboard**
   - Navigate to [Auth0 Dashboard](https://manage.auth0.com)
   - Go to **Security** → **Multi-factor Authentication**

2. **Enable MFA Methods**
   - Enable **SMS** or **Email** (or both)
   - Configure your SMS provider (Twilio, etc.)
   - Set up email templates if using email MFA

3. **Configure MFA Rules**
   - Go to **Auth Pipeline** → **Rules**
   - Create a rule to require MFA for certain conditions
   - Example: Require MFA for all logins, or only for admin users

### Step 2: Upload Custom MFA Page

1. **Go to Auth0 Dashboard**
   - Navigate to **Branding** → **Universal Login**

2. **Enable Custom MFA Page**
   - Toggle **"Customize Login Page"** to **ON**
   - Click **"Edit"** to open the code editor

3. **Replace Default Code**
   - Copy the entire contents of `auth0-custom-mfa.html`
   - Paste it into the Auth0 code editor
   - Click **"Save"**

### Step 3: Configure MFA Settings

The custom MFA page is pre-configured with these settings:

```javascript
{
  theme: {
    primaryColor: '#ff69b4',
    logo: 'data:image/svg+xml;base64,...' // Velour logo
  },
  allowSignUp: false,
  allowForgotPassword: false,
  allowShowPassword: false,
  autoclose: true,
  autofocus: true,
  allowLogin: false
}
```

## 🎯 MFA Methods Supported

### SMS Authentication
- **6-digit codes** sent via SMS
- **Auto-formatting** of input
- **Auto-submit** when complete
- **Resend functionality** with countdown

### Email Authentication
- **6-digit codes** sent via email
- **Same interface** as SMS
- **Consistent experience** across methods

### Authenticator Apps
- **TOTP codes** from apps like Google Authenticator
- **6-digit format** for consistency
- **Same styling** and behavior

## 🔧 Advanced Features

### Auto-formatting
The MFA input automatically:
- Accepts only numbers
- Limits to 6 digits
- Formats as user types
- Auto-submits when complete

```javascript
input.addEventListener('input', function(e) {
  var value = e.target.value.replace(/\D/g, '');
  if (value.length > 6) {
    value = value.substring(0, 6);
  }
  e.target.value = value;
  
  // Auto-submit when 6 digits are entered
  if (value.length === 6) {
    setTimeout(function() {
      submitButton.click();
    }, 500);
  }
});
```

### Resend Functionality
- **60-second countdown** before allowing resend
- **Visual feedback** with countdown timer
- **Prevents spam** and rate limiting

### Error Handling
- **Clear error messages** for invalid codes
- **Loading states** during verification
- **Success feedback** before redirect

## 🎨 Design Elements

### Security Icon
- **Animated lock icon** with pulse effect
- **Gradient background** matching your theme
- **Visual security indicator**

### Input Styling
- **Centered text** for better readability
- **Letter spacing** for code clarity
- **Large font size** for mobile users
- **Pink accent** on focus

### Button Design
- **Full-width button** for easy tapping
- **Gradient background** matching your theme
- **Hover effects** and transitions
- **Loading spinner** during verification

## 📱 Mobile Optimization

### Touch-friendly Design
- **Large input fields** for easy typing
- **Full-width buttons** for easy tapping
- **Proper spacing** between elements
- **Responsive layout** for all screen sizes

### Auto-submit Feature
- **Reduces friction** on mobile devices
- **No need to tap submit** button
- **Faster authentication** experience

## 🔒 Security Features

### Input Validation
- **Numeric only** input
- **6-digit limit** enforcement
- **Pattern validation** for codes
- **Real-time formatting**

### Rate Limiting
- **Resend countdown** prevents spam
- **Visual feedback** for rate limits
- **User-friendly** error messages

### Error Handling
- **Clear error messages** for invalid codes
- **No sensitive information** in errors
- **Graceful degradation** on failures

## 🚀 Implementation Examples

### Basic MFA Rule
```javascript
function requireMFA(user, context, callback) {
  if (context.protocol === 'oauth2-refresh-token') {
    return callback(null, user, context);
  }
  
  context.multifactor = {
    provider: 'any',
    allowRememberBrowser: false
  };
  
  callback(null, user, context);
}
```

### Conditional MFA
```javascript
function conditionalMFA(user, context, callback) {
  // Require MFA for admin users
  if (user.app_metadata && user.app_metadata.roles && 
      user.app_metadata.roles.includes('admin')) {
    context.multifactor = {
      provider: 'any',
      allowRememberBrowser: true
    };
  }
  
  callback(null, user, context);
}
```

## 🧪 Testing

### Test MFA Flow
1. **Enable MFA** in Auth0 dashboard
2. **Create test user** with MFA enabled
3. **Login with test user** to trigger MFA
4. **Verify custom page** appears
5. **Test code entry** and auto-submit
6. **Test resend functionality**
7. **Test error handling**

### Test Cases
- ✅ **Valid 6-digit code** - Should authenticate successfully
- ✅ **Invalid code** - Should show error message
- ✅ **Incomplete code** - Should not submit
- ✅ **Resend code** - Should work after countdown
- ✅ **Auto-submit** - Should work with 6 digits
- ✅ **Mobile experience** - Should be touch-friendly

## 🎉 Result

After setup, your users will see a beautiful, branded MFA page that:

- ✅ Matches your Velour app theme perfectly
- ✅ Provides clear security messaging
- ✅ Offers smooth, frictionless experience
- ✅ Works seamlessly on all devices
- ✅ Builds trust with professional design
- ✅ Reduces authentication friction

Your custom MFA page is now ready to provide a premium, secure authentication experience for your Velour users!

## 🆘 Troubleshooting

### Common Issues

1. **MFA page not showing**
   - Check MFA is enabled in Auth0
   - Verify MFA rules are configured
   - Check user has MFA enabled

2. **Codes not working**
   - Verify SMS/email provider configuration
   - Check code expiration settings
   - Test with Auth0 test users

3. **Styling issues**
   - Clear browser cache
   - Check CSS syntax in custom page
   - Verify Auth0 Lock version compatibility

### Getting Help

- **Auth0 Documentation** - [Multi-factor Authentication](https://auth0.com/docs/mfa)
- **Auth0 Community** - [Community Forum](https://community.auth0.com)
- **Auth0 Support** - Contact support for enterprise issues
