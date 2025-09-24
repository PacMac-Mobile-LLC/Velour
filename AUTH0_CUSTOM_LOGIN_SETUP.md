# Auth0 Custom Login Page Setup Guide

This guide will help you configure Auth0 to use the beautiful custom Velour login page instead of the default Auth0 Universal Login.

## Current Issue
You're seeing the default Auth0 login page (ugly blue/gray interface) instead of our custom Velour-styled login page with the pink/purple gradient theme.

## Solution: Configure Auth0 Universal Login

### Step 1: Access Auth0 Dashboard
1. Go to [https://manage.auth0.com](https://manage.auth0.com)
2. Log in to your Auth0 account
3. Select your tenant (should be `vibecodes`)

### Step 2: Navigate to Universal Login
1. In the left sidebar, click **"Branding"**
2. Click **"Universal Login"**
3. You should see tabs: "Login", "Sign Up", "Password Reset", etc.

### Step 3: Configure Custom Login Page
1. Click on the **"Login"** tab
2. You'll see two options:
   - **"Default Templates"** (currently selected - this is why you see the ugly page)
   - **"Custom Templates"** (this is what we want)

3. **Switch to Custom Templates:**
   - Click **"Custom Templates"**
   - Click **"Create Custom Template"**
   - Select **"Login"** from the dropdown
   - Click **"Create"**

### Step 4: Upload Custom Login Template
1. You'll see a code editor with the default Auth0 template
2. **Delete all the existing code** in the editor
3. **Copy the entire content** from our custom template file: `auth0-custom-login.html`
4. **Paste it** into the Auth0 editor
5. Click **"Save"** at the top right

### Step 5: Configure Custom Sign Up Page (Optional)
1. Go back to the **"Universal Login"** section
2. Click the **"Sign Up"** tab
3. Switch to **"Custom Templates"**
4. Create a new custom template for **"Sign Up"**
5. Use the same template content (it handles both login and signup)

### Step 6: Configure Custom Password Reset Page (Optional)
1. Click the **"Password Reset"** tab
2. Switch to **"Custom Templates"**
3. Create a new custom template for **"Password Reset"**
4. Use the same template content

### Step 7: Test the Configuration
1. Go to your application's login URL
2. You should now see the beautiful Velour-styled login page with:
   - Dark gradient background
   - Pink/purple Velour branding
   - Styled Google/Twitter buttons
   - Elegant form inputs
   - Professional appearance

## Alternative: Quick Setup Method

If you prefer a quicker approach:

### Method 1: Direct Template Upload
1. In Auth0 Dashboard → **Branding** → **Universal Login**
2. Click **"Advanced Options"** at the bottom
3. Look for **"Custom Login Page"** section
4. Upload the `auth0-custom-login.html` file directly

### Method 2: Lock Configuration
1. In your Auth0 Dashboard → **Applications**
2. Select your application
3. Go to **"Settings"** tab
4. Scroll down to **"Advanced Settings"**
5. Look for **"Lock Configuration"** or **"Custom Login Page"**
6. Enable custom login page

## Troubleshooting

### Still Seeing Default Page?
1. **Clear Browser Cache** - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
2. **Check Template Status** - Ensure custom template is saved and active
3. **Verify Application Settings** - Make sure your app is configured correctly
4. **Wait for Propagation** - Auth0 changes can take 5-10 minutes to propagate

### Template Not Loading?
1. **Check Syntax** - Ensure HTML/CSS is valid
2. **Test Locally** - Open the template file in a browser to verify it works
3. **Check Auth0 Logs** - Look for any error messages in Auth0 dashboard

### Styling Issues?
1. **CSS Conflicts** - Our template includes all necessary styles
2. **Responsive Design** - Template is mobile-friendly
3. **Browser Compatibility** - Works in all modern browsers

## What You'll See After Setup

### Before (Default Auth0):
- ❌ Ugly blue/gray interface
- ❌ Generic Auth0 branding
- ❌ Basic styling
- ❌ Poor user experience

### After (Custom Velour):
- ✅ **Beautiful dark gradient background**
- ✅ **Velour branding with pink/purple theme**
- ✅ **Styled social login buttons**
- ✅ **Elegant form inputs with focus effects**
- ✅ **Professional, modern appearance**
- ✅ **Consistent with your website branding**

## Custom Template Features

Our custom template includes:
- **🎨 Velour Branding** - Pink/purple gradient theme
- **📱 Responsive Design** - Works on all devices
- **🔐 Security Features** - Proper form validation
- **✨ Smooth Animations** - Professional transitions
- **🎯 User Experience** - Intuitive and modern interface
- **🌙 Dark Theme** - Matches your website aesthetic

## Files to Use

Use the following file for the custom template:
- **`auth0-custom-login.html`** - Complete custom login template

## Support

If you encounter any issues:
1. Check Auth0 documentation: [https://auth0.com/docs/universal-login](https://auth0.com/docs/universal-login)
2. Verify your Auth0 plan supports custom templates
3. Contact Auth0 support if needed

---

**Result**: You'll have a beautiful, professional Velour-branded login page that matches your website's aesthetic! 🎉