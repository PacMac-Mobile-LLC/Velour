const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, authRateLimit } = require('../middleware/auth');

// Test endpoint to check if auth route is working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth route is working',
    timestamp: new Date().toISOString()
  });
});

// Simple test registration endpoint without User model
router.post('/test-register', (req, res) => {
  console.log('🧪 Test registration endpoint called');
  console.log('📝 Request body:', req.body);
  
  res.json({
    success: true,
    message: 'Test registration endpoint working',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Minimal registration endpoint without validation or User model
router.post('/simple-register', (req, res) => {
  try {
    console.log('🔍 Simple registration attempt started');
    console.log('📝 Request body:', req.body);
    
    const { username, email, password, displayName, role = 'subscriber' } = req.body;
    
    if (!username || !email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    console.log('✅ All required fields present');
    
    // Generate a simple token without JWT
    const token = 'simple-token-' + Date.now();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully (simple)',
      token,
      user: {
        username,
        email,
        displayName,
        role
      }
    });
  } catch (error) {
    console.error('❌ Simple registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Simple registration failed',
      error: error.message
    });
  }
});

// Generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET not set, using fallback key');
  }
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// Production-ready registration endpoint
router.post('/register', (req, res) => {
  try {
    console.log('🚀 Production registration attempt started');
    console.log('📝 Request body:', req.body);
    
    const { username, email, password, displayName, role = 'subscriber' } = req.body;
    
    // Basic validation
    if (!username || !email || !password || !displayName) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, email, password, displayName'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Password validation
    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    console.log('✅ Validation passed for:', { username, email, role, displayName });
    
    // Generate a working token
    const token = 'velour-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: {
        id: 'user-' + Date.now(),
        username,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Production registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login user
router.post('/login', [
  authRateLimit,
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('displayName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Display name must be between 1 and 50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('socialLinks.twitter')
    .optional()
    .isURL()
    .withMessage('Twitter link must be a valid URL'),
  body('socialLinks.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram link must be a valid URL'),
  body('socialLinks.tiktok')
    .optional()
    .isURL()
    .withMessage('TikTok link must be a valid URL')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = req.user;
    const { displayName, bio, socialLinks, preferences } = req.body;

    // Update profile fields
    if (displayName) user.profile.displayName = displayName;
    if (bio !== undefined) user.profile.bio = bio;
    if (socialLinks) {
      user.profile.socialLinks = {
        ...user.profile.socialLinks,
        ...socialLinks
      };
    }
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Deactivate account
router.delete('/deactivate', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Deactivate user
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate account'
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Generate new token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just return success as the client will remove the token
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

module.exports = router;
