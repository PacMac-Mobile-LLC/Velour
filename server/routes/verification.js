const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const DiditService = require('../services/diditService');

// Initialize age verification
router.post('/didit/initialize', authenticateToken, async (req, res) => {
  try {
    const { userId, userEmail, userData } = req.body;

    if (!userId || !userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User ID and email are required'
      });
    }

    const result = await DiditService.initializeVerification(userId, userEmail, userData);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error initializing verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize verification'
    });
  }
});

// Get verification status
router.get('/status/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await DiditService.getVerificationStatus(userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error getting verification status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification status'
    });
  }
});

// Get verification history
router.get('/history/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await DiditService.getVerificationHistory(userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error getting verification history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification history'
    });
  }
});

// Resend verification
router.post('/resend/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await DiditService.resendVerification(userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error resending verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification'
    });
  }
});

// Didit webhook endpoint
router.post('/didit/webhook', async (req, res) => {
  try {
    console.log('🔔 Received Didit webhook:', req.body);

    // Verify webhook signature (in production, verify with Didit's signature)
    // const signature = req.headers['x-didit-signature'];
    // if (!verifyWebhookSignature(req.body, signature)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    const result = await DiditService.handleWebhook(req.body);
    
    if (result.success) {
      res.json({ success: true, message: 'Webhook processed successfully' });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error processing Didit webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook'
    });
  }
});

// Get verification stats (admin only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // In production, check if user is admin
    const Verification = require('../models/Verification');
    const stats = await Verification.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting verification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification stats'
    });
  }
});

// Cleanup expired verifications (admin only)
router.post('/cleanup', authenticateToken, async (req, res) => {
  try {
    // In production, check if user is admin
    const Verification = require('../models/Verification');
    const result = await Verification.cleanupExpired();
    
    res.json({
      success: true,
      data: result,
      message: 'Expired verifications cleaned up'
    });
  } catch (error) {
    console.error('Error cleaning up verifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup verifications'
    });
  }
});

module.exports = router;
