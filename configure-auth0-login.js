#!/usr/bin/env node

/**
 * Auth0 Custom Login Configuration Helper
 * 
 * This script helps you configure Auth0 to use the custom Velour login page
 * instead of the default ugly Auth0 Universal Login page.
 */

console.log(`
🎨 AUTH0 CUSTOM LOGIN SETUP
============================

You're currently seeing the default Auth0 login page instead of our beautiful 
Velour-styled custom login page. Here's how to fix it:

📋 STEP-BY-STEP INSTRUCTIONS:
============================

1. 🌐 Go to Auth0 Dashboard:
   → https://manage.auth0.com
   → Log in to your account
   → Select your 'vibecodes' tenant

2. 🎨 Navigate to Universal Login:
   → Click "Branding" in left sidebar
   → Click "Universal Login"
   → Click "Login" tab

3. 🔄 Switch to Custom Template:
   → You'll see "Default Templates" is selected (this is the problem!)
   → Click "Custom Templates" instead
   → Click "Create Custom Template"
   → Select "Login" from dropdown
   → Click "Create"

4. 📝 Replace the Code:
   → Delete ALL existing code in the editor
   → Copy ALL content from: auth0-custom-login.html
   → Paste it into the Auth0 editor
   → Click "Save" (top right)

5. ✅ Test:
   → Go to your login URL
   → You should now see the beautiful Velour login page!

🔧 CURRENT AUTH0 CONFIGURATION:
===============================
Domain: vibecodes.us.auth0.com
Client ID: OejuDvHhYdI5z7a2x6K3R5zWQxhy0gY2
Redirect URI: https://vibecodes.space

📁 FILES TO USE:
================
- auth0-custom-login.html (Custom login template)
- AUTH0_CUSTOM_LOGIN_SETUP.md (Detailed guide)
- QUICK_AUTH0_SETUP.md (Quick reference)

🚨 IMPORTANT NOTES:
===================
- The custom template must be saved in Auth0 dashboard
- Changes can take 5-10 minutes to propagate
- Clear browser cache if you still see the old page
- Make sure you're using "Custom Templates" not "Default Templates"

🎯 WHAT YOU'LL SEE AFTER SETUP:
===============================
✅ Beautiful dark gradient background
✅ Velour branding with pink/purple theme  
✅ Styled Google/Twitter login buttons
✅ Elegant form inputs with focus effects
✅ Professional, modern appearance
✅ Consistent with your website branding

❌ BEFORE (Default Auth0):
- Ugly blue/gray interface
- Generic Auth0 branding
- Basic styling
- Poor user experience

✅ AFTER (Custom Velour):
- Beautiful dark gradient background
- Velour branding with pink/purple theme
- Styled social login buttons
- Elegant form inputs
- Professional appearance
- Consistent branding

🎉 RESULT:
==========
You'll have a beautiful, professional Velour-branded login page that 
matches your website's aesthetic instead of the ugly default Auth0 page!

Need help? Check the detailed guide in AUTH0_CUSTOM_LOGIN_SETUP.md
`);

// Check if we're in the right directory
const fs = require('fs');
const path = require('path');

const customLoginFile = path.join(__dirname, 'auth0-custom-login.html');

if (fs.existsSync(customLoginFile)) {
  console.log(`
✅ Custom login template found: auth0-custom-login.html
📏 File size: ${fs.statSync(customLoginFile).size} bytes
📝 Ready to copy and paste into Auth0 dashboard
`);
} else {
  console.log(`
❌ Custom login template not found: auth0-custom-login.html
Please make sure you're in the correct directory.
`);
}

console.log(`
🚀 QUICK START:
===============
1. Open: https://manage.auth0.com
2. Go to: Branding → Universal Login → Login tab
3. Switch to: Custom Templates
4. Copy content from: auth0-custom-login.html
5. Paste into Auth0 editor and save
6. Test your login page!

Happy coding! 🎨✨
`);
