const sgMail = require('@sendgrid/mail');

console.log('API Key:', process.env.SENDGRID_API_KEY ? 'Loaded' : 'Not loaded');
console.log('API Key starts with:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.substring(0, 10) + '...' : 'N/A');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'your-email@gmail.com', // Change to your personal email
  from: 'support@vibecodes.space',
  subject: 'Test Email from Vibecodes',
  text: 'This is a test email from Vibecodes!',
  html: '<p>This is a test email from <strong>Vibecodes</strong>!</p>',
};

console.log('Attempting to send email...');
console.log('From:', msg.from);
console.log('To:', msg.to);

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
  })
  .catch((error) => {
    console.error('❌ Error details:');
    console.error('Status:', error.code);
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Response body:', error.response.body);
    }
  });
