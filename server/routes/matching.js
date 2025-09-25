const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const AIMatchingService = require('../services/aiMatchingService');
const User = require('../models/User');

const router = express.Router();

// Get AI-powered user recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, exclude = [] } = req.query;
    
    const excludeIds = Array.isArray(exclude) ? exclude : exclude.split(',').filter(Boolean);
    
    const recommendations = await AIMatchingService.getRecommendations(
      userId, 
      parseInt(limit), 
      excludeIds
    );

    res.json({
      success: true,
      data: recommendations,
      message: 'Recommendations retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
});

// Get matching insights for current user
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const insights = await AIMatchingService.getMatchingInsights(userId);

    res.json({
      success: true,
      data: insights,
      message: 'Matching insights retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting matching insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get matching insights'
    });
  }
});

// Update user matching preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = req.body;

    // Validate preferences structure
    const validFields = [
      'contentInterests', 'personalityTraits', 'relationshipGoals',
      'ageRange', 'locationPreferences', 'activityPreferences',
      'communicationStyle', 'creatorPreferences'
    ];

    const updateData = {};
    validFields.forEach(field => {
      if (preferences[field] !== undefined) {
        updateData[`matchingPreferences.${field}`] = preferences[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password -__v' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update compatibility scores in background
    AIMatchingService.updateCompatibilityScores(userId).catch(console.error);

    res.json({
      success: true,
      data: user.matchingPreferences,
      message: 'Matching preferences updated successfully'
    });

  } catch (error) {
    console.error('Error updating matching preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update matching preferences'
    });
  }
});

// Get compatibility score between current user and another user
router.get('/compatibility/:targetUserId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const targetUserId = req.params.targetUserId;

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({
        success: false,
        message: 'One or both users not found'
      });
    }

    const compatibility = AIMatchingService.calculateCompatibility(user, targetUser);

    res.json({
      success: true,
      data: {
        targetUser: {
          id: targetUser._id,
          name: targetUser.name || targetUser.profile?.displayName,
          handle: targetUser.handle,
          avatar: targetUser.avatar || targetUser.profile?.avatar
        },
        compatibility: compatibility.score,
        factors: compatibility.factors,
        breakdown: compatibility.breakdown
      },
      message: 'Compatibility calculated successfully'
    });

  } catch (error) {
    console.error('Error calculating compatibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate compatibility'
    });
  }
});

// Record user interaction for AI learning
router.post('/interaction', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId, interactionType, success = true } = req.body;

    if (!targetUserId || !interactionType) {
      return res.status(400).json({
        success: false,
        message: 'targetUserId and interactionType are required'
      });
    }

    await AIMatchingService.learnFromInteraction(userId, targetUserId, interactionType, success);

    res.json({
      success: true,
      message: 'Interaction recorded successfully'
    });

  } catch (error) {
    console.error('Error recording interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record interaction'
    });
  }
});

// Provide feedback on a match
router.post('/feedback', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId, rating, feedback } = req.body;

    if (!targetUserId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'targetUserId and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add feedback to user's AI profile
    const feedbackEntry = {
      userId: targetUserId,
      rating,
      feedback: feedback || '',
      timestamp: new Date()
    };

    await User.findByIdAndUpdate(userId, {
      $push: {
        'aiProfile.learningData.userFeedback': feedbackEntry
      }
    });

    // Update compatibility scores based on feedback
    AIMatchingService.updateCompatibilityScores(userId).catch(console.error);

    res.json({
      success: true,
      message: 'Feedback recorded successfully'
    });

  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record feedback'
    });
  }
});

// Search users with AI-enhanced results
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { query, limit = 20, includeCompatibility = true } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    // Search users by name, handle, or bio
    const searchRegex = new RegExp(query.trim(), 'i');
    const users = await User.find({
      _id: { $ne: userId },
      isActive: true,
      $or: [
        { name: searchRegex },
        { handle: searchRegex },
        { bio: searchRegex },
        { 'profile.displayName': searchRegex },
        { 'profile.bio': searchRegex }
      ]
    }).limit(parseInt(limit) * 2); // Get more results to calculate compatibility

    let results = users.map(user => ({
      userId: user._id,
      name: user.name || user.profile?.displayName,
      handle: user.handle,
      bio: user.bio || user.profile?.bio,
      avatar: user.avatar || user.profile?.avatar,
      online: AIMatchingService.isUserOnline(user),
      followers: user.followers || 0,
      verified: user.profile?.isVerified || false
    }));

    // If compatibility is requested, calculate it for each result
    if (includeCompatibility === 'true') {
      const currentUser = await User.findById(userId);
      results = results.map(result => {
        const targetUser = users.find(u => u._id.toString() === result.userId);
        if (targetUser) {
          const compatibility = AIMatchingService.calculateCompatibility(currentUser, targetUser);
          return {
            ...result,
            compatibility: compatibility.score,
            factors: compatibility.factors
          };
        }
        return result;
      });

      // Sort by compatibility score
      results.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0));
    }

    // Limit final results
    results = results.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: results,
      message: 'Search completed successfully'
    });

  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
});

// Get user's matching statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const aiProfile = user.aiProfile || {};
    const learningData = aiProfile.learningData || {};

    const stats = {
      profileCompleteness: AIMatchingService.calculateProfileCompleteness(user.matchingPreferences),
      totalInteractions: learningData.successfulMatches?.length + learningData.failedMatches?.length || 0,
      successfulMatches: learningData.successfulMatches?.length || 0,
      failedMatches: learningData.failedMatches?.length || 0,
      feedbackProvided: learningData.userFeedback?.length || 0,
      averageCompatibilityScore: this.calculateAverageCompatibility(aiProfile.compatibilityScores),
      lastUpdated: learningData.preferencesUpdated || user.updatedAt
    };

    res.json({
      success: true,
      data: stats,
      message: 'Matching statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting matching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get matching statistics'
    });
  }
});

// Helper function to calculate average compatibility score
function calculateAverageCompatibility(compatibilityScores) {
  if (!compatibilityScores || compatibilityScores.length === 0) {
    return 0;
  }

  const total = compatibilityScores.reduce((sum, score) => sum + score.score, 0);
  return Math.round(total / compatibilityScores.length);
}

module.exports = router;
