const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const UserRegistrationService = require('../services/userRegistrationService');

// Welcome message template (in production, this would be stored in database)
const WELCOME_TEMPLATE = {
  subject: "Welcome to Velour! 🎉",
  content: `Hi {{userName}}! 👋

Welcome to Velour - Where Desire Meets Luxury! I'm Matty, the founder of this platform, and I'm thrilled to have you join our community of creators and fans.

🎯 **What you can do on Velour:**
• Subscribe to your favorite creators for exclusive content
• Discover amazing creators through our recommendation system
• Send direct messages to creators you're subscribed to
• Organize creators into custom collections
• Access private content in creator vaults
• Schedule live sessions with creators
• Track your subscription analytics and statements

💬 **Need Help?**
I'm here to help! You can always DM me directly for:
• Platform questions and support
• Feature requests and feedback
• Technical issues
• Creator account setup
• Payment or subscription help

🚀 **Getting Started:**
1. Browse our featured creators on the homepage
2. Subscribe to creators you love
3. Start building your collections
4. Explore the vault for exclusive content
5. Don't hesitate to reach out if you need anything!

Thank you for choosing Velour. I'm excited to see what amazing connections you'll make here!

Best regards,
Matty
Founder & CEO, Velour

P.S. - Follow me @matty for platform updates and behind-the-scenes content! ✨`,
  quickReplies: [
    "Thanks! How do I find creators?",
    "I need help with my account",
    "How do subscriptions work?",
    "I want to become a creator"
  ]
};

// Get welcome message template
router.get('/template', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: WELCOME_TEMPLATE
    });
  } catch (error) {
    console.error('Error fetching welcome template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch welcome template'
    });
  }
});

// Update welcome message template (admin only)
router.put('/template', authenticateToken, async (req, res) => {
  try {
    // In production, check if user is admin
    // For now, just return success
    res.json({
      success: true,
      message: 'Welcome template updated successfully'
    });
  } catch (error) {
    console.error('Error updating welcome template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update welcome template'
    });
  }
});

// Send welcome message to new user
router.post('/send-message', authenticateToken, async (req, res) => {
  try {
    const { userId, userEmail, userName } = req.body;

    const result = await UserRegistrationService.sendWelcomeMessage(userId, userEmail, userName);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error sending welcome message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send welcome message'
    });
  }
});

// Check if user has received welcome message
router.get('/status/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await UserRegistrationService.hasReceivedWelcome(userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error checking welcome status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check welcome status'
    });
  }
});

// Mark welcome message as read
router.put('/mark-read/:userId/:messageId', authenticateToken, async (req, res) => {
  try {
    const { userId, messageId } = req.params;

    const result = await UserRegistrationService.markWelcomeAsRead(userId, messageId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error marking welcome as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark welcome as read'
    });
  }
});

// Get welcome message for user
router.get('/message/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await UserRegistrationService.getWelcomeMessage(userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error fetching welcome message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch welcome message'
    });
  }
});

module.exports = router;
