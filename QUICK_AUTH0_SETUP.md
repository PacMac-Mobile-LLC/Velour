# Quick Auth0 Custom Login Setup

## The Problem
You're seeing the ugly default Auth0 login page instead of our beautiful Velour-styled login page.

## Quick Fix (5 minutes)

### Step 1: Go to Auth0 Dashboard
1. Open [https://manage.auth0.com](https://manage.auth0.com)
2. Log in to your account
3. Select your `vibecodes` tenant

### Step 2: Navigate to Universal Login
1. Click **"Branding"** in the left sidebar
2. Click **"Universal Login"**
3. Click the **"Login"** tab

### Step 3: Switch to Custom Template
1. You'll see **"Default Templates"** is currently selected
2. Click **"Custom Templates"** instead
3. Click **"Create Custom Template"**
4. Select **"Login"** from dropdown
5. Click **"Create"**

### Step 4: Replace the Code
1. **Delete ALL existing code** in the editor
2. **Copy ALL content** from this file: `auth0-custom-login.html`
3. **Paste it** into the Auth0 editor
4. Click **"Save"** (top right)

### Step 5: Test
1. Go to your login URL
2. You should now see the beautiful Velour login page!

## That's It! 🎉

You should now see:
- ✅ Dark gradient background
- ✅ Velour branding
- ✅ Styled Google/Twitter buttons
- ✅ Professional appearance

## If It Doesn't Work
1. **Hard refresh** your browser (Ctrl+F5)
2. **Wait 5-10 minutes** for changes to propagate
3. **Check** that you saved the template correctly

## Need Help?
The full setup guide is in `AUTH0_CUSTOM_LOGIN_SETUP.md`
