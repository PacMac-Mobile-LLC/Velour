const express = require('express');
const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Minimal auth route is working',
    timestamp: new Date().toISOString()
  });
});

// Minimal registration endpoint
router.post('/register', (req, res) => {
  try {
    console.log('🔍 Minimal registration attempt started');
    console.log('📝 Request body:', req.body);
    
    const { username, email, password, displayName, role = 'subscriber' } = req.body;
    
    if (!username || !email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    console.log('✅ All required fields present');
    
    // Generate a simple token
    const token = 'minimal-token-' + Date.now();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully (minimal)',
      token,
      user: {
        username,
        email,
        displayName,
        role
      }
    });
  } catch (error) {
    console.error('❌ Minimal registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Minimal registration failed',
      error: error.message
    });
  }
});

module.exports = router;
