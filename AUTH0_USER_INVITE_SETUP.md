# Auth0 Custom User Invite Page Setup

This guide will help you implement the custom Velour-themed user invite page in your Auth0 dashboard.

## 🎉 Custom User Invite Page Features

The custom user invite page includes:
- ✅ **Velour Branding** - Logo and theme matching your app
- ✅ **Welcome Message** - Personalized invitation experience
- ✅ **Modern Design** - Clean, professional appearance with celebration icon
- ✅ **Responsive Layout** - Works perfectly on all devices
- ✅ **Invite Details** - Shows who invited the user
- ✅ **Benefits List** - Highlights what users get by joining
- ✅ **Invite Code Display** - Shows invite code if provided
- ✅ **Account Creation** - Seamless signup process
- ✅ **Terms Acceptance** - Clear terms and privacy policy links
- ✅ **Security Messaging** - Reassures users about data protection

## 🚀 Setup Instructions

### Step 1: Configure User Invitations in Auth0

1. **Go to Auth0 Dashboard**
   - Navigate to [Auth0 Dashboard](https://manage.auth0.com)
   - Go to **User Management** → **Users**

2. **Enable User Invitations**
   - Ensure your database connection allows user creation
   - Configure invitation settings
   - Set up email templates for invitations

3. **Configure Email Templates**
   - Go to **Branding** → **Email Templates**
   - Customize the "Invitation" template
   - Add your Velour branding to the email

### Step 2: Upload Custom User Invite Page

1. **Go to Auth0 Dashboard**
   - Navigate to **Branding** → **Universal Login**

2. **Enable Custom Login Page**
   - Toggle **"Customize Login Page"** to **ON**
   - Click **"Edit"** to open the code editor

3. **Replace Default Code**
   - Copy the entire contents of `auth0-custom-user-invite.html`
   - Paste it into the Auth0 code editor
   - Click **"Save"**

### Step 3: Configure User Invite Settings

The custom user invite page is pre-configured with these settings:

```javascript
{
  theme: {
    primaryColor: '#ff69b4',
    logo: 'data:image/svg+xml;base64,...' // Velour logo
  },
  allowSignUp: true,
  allowForgotPassword: true,
  allowShowPassword: true,
  autoclose: true,
  autofocus: true,
  allowLogin: true,
  loginAfterSignUp: true
}
```

## 🎯 User Invite Flow

### Step 1: User Receives Invitation
- User receives email invitation with custom link
- Link includes invite code and inviter information
- User clicks link to access invite page

### Step 2: Invite Page Display
- Beautiful branded invite page loads
- Shows who invited the user
- Displays benefits of joining Velour
- Shows invite code if provided

### Step 3: Account Creation
- User fills out signup form
- Invite code is automatically included
- Account is created with invite context

### Step 4: Welcome Experience
- User is redirected to dashboard
- Welcome message confirms successful signup
- User can start using Velour immediately

## 🔧 Advanced Features

### Invite Code Handling
Automatic invite code extraction and inclusion:

```javascript
// Extract invite information from URL parameters
var urlParams = new URLSearchParams(window.location.search);
var inviteCode = urlParams.get('invite_code');
var inviterName = urlParams.get('inviter_name');

// Update invite details if available
if (inviterName) {
  document.getElementById('inviter-name').textContent = inviterName;
}

if (inviteCode) {
  document.getElementById('invite-code-value').textContent = inviteCode;
  document.getElementById('invite-code-section').style.display = 'block';
}
```

### Personalized Messaging
Dynamic content based on invite parameters:

```javascript
// Update invite details if available
if (inviterName) {
  document.getElementById('inviter-name').textContent = inviterName;
}
```

### Loading States
Custom loading spinner during account creation:

```javascript
submitButton.addEventListener('click', function() {
  if (!this.disabled) {
    this.innerHTML = '<div class="loading-spinner"></div>Creating account...';
    this.disabled = true;
  }
});
```

## 🎨 Design Elements

### Invite Icon
- **Animated celebration icon** with pulse effect
- **Gradient background** matching your theme
- **Visual indicator** for invitation

### Benefits List
- **Clear benefits** of joining Velour
- **Visual icons** for each benefit
- **Compelling reasons** to create account

### Invite Details
- **Personalized messaging** with inviter name
- **Clear explanation** of the invitation
- **Professional presentation**

### Invite Code Display
- **Highlighted invite code** if provided
- **Monospace font** for easy reading
- **Visual emphasis** on the code

## 📱 Mobile Optimization

### Touch-friendly Design
- **Large input fields** for easy typing
- **Full-width buttons** for easy tapping
- **Proper spacing** between elements
- **Responsive layout** for all screen sizes

### Account Creation
- **Streamlined signup** process
- **Auto-focus** on first input
- **Clear validation** feedback

## 🔒 Security Features

### Invite Code Validation
- **Automatic inclusion** of invite codes
- **Hidden input** for secure transmission
- **Validation** on the backend

### Terms Acceptance
- **Clear terms** and privacy policy links
- **User agreement** before account creation
- **Legal compliance** built-in

### Secure Process
- **HTTPS only** connections
- **Secure invite links** with expiration
- **No sensitive data** exposed

## 🚀 Implementation Examples

### Basic User Invitation
The page automatically handles:
- Invite code extraction from URL
- Personalized messaging
- Account creation with invite context
- Success feedback and redirect

### Custom Email Template
Configure your invitation email template in Auth0:

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
      <h2>You're Invited to Velour!</h2>
      <p>Hi there!</p>
      <p>{{inviter.name}} has invited you to join Velour, the exclusive creator platform.</p>
      <p>Click the button below to accept your invitation and create your account:</p>
      <a href="{{url}}" class="button">Accept Invitation</a>
      <p>If you didn't expect this invitation, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
```

### Invite URL Parameters
The invite page supports these URL parameters:
- `invite_code` - The invitation code
- `inviter_name` - Name of the person who invited
- `inviter_email` - Email of the person who invited

Example invite URL:
```
https://vibecodes.space/invite?invite_code=ABC123&inviter_name=John%20Doe&inviter_email=john@example.com
```

## 🧪 Testing

### Test User Invitation Flow
1. **Enable user invitations** in Auth0 dashboard
2. **Configure email templates** with your branding
3. **Send test invitation** to verify email delivery
4. **Test invite link** to verify page loads correctly
5. **Test account creation** with invite code
6. **Test mobile experience** on different devices

### Test Cases
- ✅ **Valid invite link** - Should load invite page correctly
- ✅ **Invalid invite code** - Should handle gracefully
- ✅ **Account creation** - Should create account with invite context
- ✅ **Mobile experience** - Should be touch-friendly
- ✅ **Email template** - Should match your branding
- ✅ **Terms acceptance** - Should be clearly displayed

## 🎉 Result

After setup, your invited users will see a beautiful, branded invitation page that:

- ✅ Matches your Velour app theme perfectly
- ✅ Provides personalized invitation experience
- ✅ Highlights benefits of joining your platform
- ✅ Offers smooth, intuitive signup process
- ✅ Works seamlessly on all devices
- ✅ Builds excitement and trust with professional design
- ✅ Reduces friction in the onboarding process

Your custom user invite page is now ready to provide a premium, welcoming experience for new Velour users!

## 🆘 Troubleshooting

### Common Issues

1. **Invite page not loading**
   - Check invite link format and parameters
   - Verify custom login page is enabled
   - Check browser console for errors

2. **Invite code not working**
   - Verify invite code is valid and not expired
   - Check invite code parameter in URL
   - Verify backend invite code validation

3. **Styling issues**
   - Clear browser cache
   - Check CSS syntax in custom page
   - Verify Auth0 Lock version compatibility

### Getting Help

- **Auth0 Documentation** - [User Invitations](https://auth0.com/docs/manage-users/user-accounts/user-invitations)
- **Auth0 Community** - [Community Forum](https://community.auth0.com)
- **Auth0 Support** - Contact support for enterprise issues

## 📧 Email Template Customization

### Branded Invitation Email
Create a custom email template that matches your Velour theme:

1. **Go to Auth0 Dashboard** → **Branding** → **Email Templates**
2. **Select "Invitation"** template
3. **Customize with your branding**:
   - Add Velour logo
   - Use your color scheme
   - Match your app's tone
   - Include clear call-to-action

### Template Variables
Use these variables in your email template:
- `{{url}}` - Invitation acceptance link
- `{{inviter.name}}` - Name of the person who invited
- `{{inviter.email}}` - Email of the person who invited
- `{{organization.name}}` - Organization name

### Best Practices
- **Clear subject line** - "You're invited to join Velour!"
- **Prominent CTA button** - Easy to find and click
- **Personal touch** - Include inviter's name
- **Benefits highlight** - Mention what they'll get
- **Support contact** - Include help information
