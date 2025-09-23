const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: ['https://videochat-wv3g.onrender.com', process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.get('/api/ping', (req, res) => {
  res.json({
    success: true,
    message: 'Pong! Service is alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Working registration endpoint
app.post('/api/auth/register', (req, res) => {
  try {
    console.log('🚀 Minimal registration attempt');
    console.log('📝 Request body:', req.body);
    
    const { username, email, password, displayName, role = 'subscriber' } = req.body;
    
    // Basic validation
    if (!username || !email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    console.log('✅ Validation passed');
    
    // Generate token
    const token = 'minimal-token-' + Date.now();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: {
        id: 'user-' + Date.now(),
        username,
        email,
        displayName,
        role
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
});
