const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or inactive user' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Check if user is creator
const requireCreator = (req, res, next) => {
  if (req.user.role !== 'creator') {
    return res.status(403).json({ 
      success: false, 
      message: 'Creator access required' 
    });
  }
  next();
};

// Check if user is subscriber
const requireSubscriber = (req, res, next) => {
  if (req.user.role !== 'subscriber') {
    return res.status(403).json({ 
      success: false, 
      message: 'Subscriber access required' 
    });
  }
  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Check subscription access
const requireSubscription = async (req, res, next) => {
  try {
    const { creatorId } = req.params;
    const subscriber = req.user;

    if (subscriber.role !== 'subscriber') {
      return res.status(403).json({ 
        success: false, 
        message: 'Subscriber access required' 
      });
    }

    // Check if user has active subscription to this creator
    const Subscription = require('../models/Subscription');
    const subscription = await Subscription.findOne({
      subscriber: subscriber._id,
      creator: creatorId,
      status: 'active',
      isActive: true
    });

    if (!subscription || !subscription.isValid) {
      return res.status(403).json({ 
        success: false, 
        message: 'Active subscription required' 
      });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Subscription verification error' 
    });
  }
};

// Rate limiting for authentication attempts
const authRateLimit = (req, res, next) => {
  // This would typically use a rate limiting library like express-rate-limit
  // For now, we'll implement a simple check
  const attempts = req.session?.authAttempts || 0;
  const lastAttempt = req.session?.lastAuthAttempt || 0;
  const now = Date.now();
  
  // Reset attempts after 15 minutes
  if (now - lastAttempt > 15 * 60 * 1000) {
    req.session.authAttempts = 0;
  }
  
  // Allow up to 5 attempts per 15 minutes
  if (attempts >= 5) {
    return res.status(429).json({ 
      success: false, 
      message: 'Too many authentication attempts. Please try again later.' 
    });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  requireCreator,
  requireSubscriber,
  optionalAuth,
  requireSubscription,
  authRateLimit
};
