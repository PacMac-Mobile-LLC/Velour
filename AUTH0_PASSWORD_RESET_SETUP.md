# Auth0 Custom Password Reset Page Setup

This guide will help you implement the custom Velour-themed password reset page in your Auth0 dashboard.

## 🔑 Custom Password Reset Page Features

The custom password reset page includes:
- ✅ **Velour Branding** - Logo and theme matching your app
- ✅ **Clear Messaging** - Explains the password reset process
- ✅ **Modern Design** - Clean, professional appearance with key icon
- ✅ **Responsive Layout** - Works perfectly on all devices
- ✅ **Email Validation** - Real-time email format validation
- ✅ **Loading States** - Spinner during reset link sending
- ✅ **Error Handling** - Clear error messages and feedback
- ✅ **Success Feedback** - Confirmation when reset link is sent
- ✅ **Back to Login** - Easy navigation back to login page
- ✅ **Security Messaging** - Reassures users about the process

## 🚀 Setup Instructions

### Step 1: Configure Password Reset in Auth0

1. **Go to Auth0 Dashboard**
   - Navigate to [Auth0 Dashboard](https://manage.auth0.com)
   - Go to **Authentication** → **Database**

2. **Enable Password Reset**
   - Ensure your database connection allows password reset
   - Configure password reset settings
   - Set up email templates for password reset

3. **Configure Email Templates**
   - Go to **Branding** → **Email Templates**
   - Customize the "Reset Password" template
   - Add your Velour branding to the email

### Step 2: Upload Custom Password Reset Page

1. **Go to Auth0 Dashboard**
   - Navigate to **Branding** → **Universal Login**

2. **Enable Custom Login Page**
   - Toggle **"Customize Login Page"** to **ON**
   - Click **"Edit"** to open the code editor

3. **Replace Default Code**
   - Copy the entire contents of `auth0-custom-password-reset.html`
   - Paste it into the Auth0 code editor
   - Click **"Save"**

### Step 3: Configure Password Reset Settings

The custom password reset page is pre-configured with these settings:

```javascript
{
  theme: {
    primaryColor: '#ff69b4',
    logo: 'data:image/svg+xml;base64,...' // Velour logo
  },
  allowSignUp: false,
  allowForgotPassword: true,
  allowShowPassword: false,
  autoclose: true,
  autofocus: true,
  allowLogin: false
}
```

## 🎯 Password Reset Flow

### Step 1: User Requests Reset
- User enters email address
- Email validation occurs in real-time
- Submit button sends reset request

### Step 2: Reset Link Sent
- Auth0 sends reset email to user
- Success message confirms email was sent
- User is instructed to check their email

### Step 3: User Clicks Reset Link
- User clicks link in email
- Redirected to password reset form
- User enters new password

### Step 4: Password Updated
- New password is validated
- Password is updated in Auth0
- User is redirected to login

## 🔧 Advanced Features

### Email Validation
Real-time email format validation:

```javascript
function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

input.addEventListener('blur', function() {
  var email = this.value.trim();
  if (email && !isValidEmail(email)) {
    showError('Please enter a valid email address');
  }
});
```

### Loading States
Custom loading spinner during reset link sending:

```javascript
submitButton.addEventListener('click', function() {
  if (!this.disabled) {
    this.innerHTML = '<div class="loading-spinner"></div>Sending reset link...';
    this.disabled = true;
  }
});
```

### Error Handling
- **Clear error messages** for invalid emails
- **Success feedback** when reset link is sent
- **Loading states** during processing
- **Graceful error recovery**

## 🎨 Design Elements

### Reset Icon
- **Animated key icon** with pulse effect
- **Gradient background** matching your theme
- **Visual indicator** for password reset

### Input Styling
- **Email input** with proper validation
- **Focus states** with pink accent
- **Placeholder text** for guidance
- **Error states** with clear messaging

### Button Design
- **Full-width button** for easy tapping
- **Gradient background** matching your theme
- **Hover effects** and transitions
- **Loading spinner** during processing

## 📱 Mobile Optimization

### Touch-friendly Design
- **Large input fields** for easy typing
- **Full-width buttons** for easy tapping
- **Proper spacing** between elements
- **Responsive layout** for all screen sizes

### Email Input
- **Proper keyboard** on mobile devices
- **Email validation** with visual feedback
- **Auto-focus** for better UX

## 🔒 Security Features

### Email Validation
- **Format validation** for email addresses
- **Real-time feedback** for invalid emails
- **Prevents invalid submissions**

### Rate Limiting
- **Auth0 built-in** rate limiting
- **Prevents spam** and abuse
- **User-friendly** error messages

### Secure Process
- **HTTPS only** connections
- **Secure reset links** with expiration
- **No sensitive data** exposed

## 🚀 Implementation Examples

### Basic Password Reset
The page automatically handles:
- Email input and validation
- Reset link sending
- Success/error feedback
- Navigation back to login

### Custom Email Template
Configure your email template in Auth0:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #ff69b4 0%, #7a288a 100%); color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .button { background: #ff69b4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Velour</h1>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Click the button below to reset your password:</p>
      <a href="{{link}}" class="button">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
```

## 🧪 Testing

### Test Password Reset Flow
1. **Enable password reset** in Auth0 dashboard
2. **Configure email templates** with your branding
3. **Test with valid email** to verify reset link is sent
4. **Test with invalid email** to verify error handling
5. **Test reset link** to verify password can be changed
6. **Test mobile experience** on different devices

### Test Cases
- ✅ **Valid email** - Should send reset link successfully
- ✅ **Invalid email format** - Should show error message
- ✅ **Non-existent email** - Should show generic success message
- ✅ **Rate limiting** - Should handle multiple requests gracefully
- ✅ **Mobile experience** - Should be touch-friendly
- ✅ **Email template** - Should match your branding

## 🎉 Result

After setup, your users will see a beautiful, branded password reset page that:

- ✅ Matches your Velour app theme perfectly
- ✅ Provides clear, helpful messaging
- ✅ Offers smooth, intuitive experience
- ✅ Works seamlessly on all devices
- ✅ Builds trust with professional design
- ✅ Reduces support requests with clear instructions

Your custom password reset page is now ready to provide a premium, user-friendly experience for your Velour users!

## 🆘 Troubleshooting

### Common Issues

1. **Reset link not working**
   - Check email template configuration
   - Verify reset link URL in email
   - Check Auth0 password reset settings

2. **Email not being sent**
   - Verify email provider configuration
   - Check Auth0 email settings
   - Test with Auth0 test users

3. **Styling issues**
   - Clear browser cache
   - Check CSS syntax in custom page
   - Verify Auth0 Lock version compatibility

### Getting Help

- **Auth0 Documentation** - [Password Reset](https://auth0.com/docs/authenticate/password-reset)
- **Auth0 Community** - [Community Forum](https://community.auth0.com)
- **Auth0 Support** - Contact support for enterprise issues

## 📧 Email Template Customization

### Branded Email Template
Create a custom email template that matches your Velour theme:

1. **Go to Auth0 Dashboard** → **Branding** → **Email Templates**
2. **Select "Reset Password"** template
3. **Customize with your branding**:
   - Add Velour logo
   - Use your color scheme
   - Match your app's tone
   - Include clear instructions

### Template Variables
Use these variables in your email template:
- `{{link}}` - Password reset link
- `{{user.email}}` - User's email address
- `{{user.name}}` - User's name
- `{{organization.name}}` - Organization name

### Best Practices
- **Clear subject line** - "Reset your Velour password"
- **Prominent reset button** - Easy to find and click
- **Security messaging** - Explain the process
- **Expiration notice** - Mention link expiration
- **Support contact** - Include help information
