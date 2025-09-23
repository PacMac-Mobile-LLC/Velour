#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌩️  Cloudinary URL Generator\n');
console.log('This script will help you create your CLOUDINARY_URL environment variable.\n');
console.log('You can find these values in your Cloudinary dashboard:');
console.log('1. Go to https://cloudinary.com/console');
console.log('2. Click Settings (⚙️) → API Keys');
console.log('3. Copy your Cloud Name, API Key, and API Secret\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function generateCloudinaryURL() {
  try {
    const cloudName = await askQuestion('Enter your Cloud Name (e.g., dhlm4xdd8): ');
    const apiKey = await askQuestion('Enter your API Key: ');
    const apiSecret = await askQuestion('Enter your API Secret: ');

    if (!cloudName || !apiKey || !apiSecret) {
      console.log('\n❌ Error: All fields are required!');
      rl.close();
      return;
    }

    const cloudinaryURL = `cloudinary://${apiKey}:${apiSecret}@${cloudName}`;

    console.log('\n✅ Your CLOUDINARY_URL has been generated!\n');
    console.log('📋 Copy this to your environment variables:\n');
    console.log(`CLOUDINARY_URL=${cloudinaryURL}\n`);
    
    console.log('🔧 For Render deployment, add this to your backend service environment variables.\n');
    
    console.log('🔒 Security reminder:');
    console.log('- Never commit this to git');
    console.log('- Keep your API secret secure');
    console.log('- Use environment variables for all credentials\n');

    // Also show individual variables option
    console.log('📝 Alternative: Individual variables (if you prefer):');
    console.log(`CLOUDINARY_CLOUD_NAME=${cloudName}`);
    console.log(`CLOUDINARY_API_KEY=${apiKey}`);
    console.log(`CLOUDINARY_API_SECRET=${apiSecret}\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

generateCloudinaryURL();
