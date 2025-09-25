const User = require('../models/User');
const mongoose = require('mongoose');

class AIMatchingService {
  /**
   * Calculate compatibility score between two users
   * @param {Object} user1 - First user object
   * @param {Object} user2 - Second user object
   * @returns {Object} Compatibility score and breakdown
   */
  static calculateCompatibility(user1, user2) {
    const factors = {
      interests: this.calculateInterestCompatibility(user1, user2),
      personality: this.calculatePersonalityCompatibility(user1, user2),
      location: this.calculateLocationCompatibility(user1, user2),
      activity: this.calculateActivityCompatibility(user1, user2),
      age: this.calculateAgeCompatibility(user1, user2),
      goals: this.calculateGoalCompatibility(user1, user2)
    };

    // Weighted average of all factors
    const weights = {
      interests: 0.25,
      personality: 0.20,
      location: 0.15,
      activity: 0.15,
      age: 0.10,
      goals: 0.15
    };

    const overallScore = Object.keys(factors).reduce((total, factor) => {
      return total + (factors[factor] * weights[factor]);
    }, 0);

    return {
      score: Math.round(overallScore),
      factors,
      breakdown: this.generateCompatibilityBreakdown(factors)
    };
  }

  /**
   * Calculate interest compatibility based on shared content interests
   */
  static calculateInterestCompatibility(user1, user2) {
    const interests1 = user1.matchingPreferences?.contentInterests || [];
    const interests2 = user2.matchingPreferences?.contentInterests || [];

    if (interests1.length === 0 || interests2.length === 0) {
      return 50; // Neutral score if no interests specified
    }

    const sharedInterests = interests1.filter(interest => 
      interests2.includes(interest)
    ).length;

    const totalInterests = new Set([...interests1, ...interests2]).size;
    const compatibility = (sharedInterests / totalInterests) * 100;

    return Math.min(100, Math.max(0, compatibility));
  }

  /**
   * Calculate personality compatibility using trait similarity
   */
  static calculatePersonalityCompatibility(user1, user2) {
    const traits1 = user1.matchingPreferences?.personalityTraits || {};
    const traits2 = user2.matchingPreferences?.personalityTraits || {};

    const traitKeys = Object.keys(traits1);
    if (traitKeys.length === 0) return 50;

    let totalDifference = 0;
    let traitCount = 0;

    traitKeys.forEach(trait => {
      if (traits1[trait] && traits2[trait]) {
        const difference = Math.abs(traits1[trait] - traits2[trait]);
        totalDifference += difference;
        traitCount++;
      }
    });

    if (traitCount === 0) return 50;

    const averageDifference = totalDifference / traitCount;
    // Convert difference to compatibility (lower difference = higher compatibility)
    const compatibility = Math.max(0, 100 - (averageDifference * 20));

    return Math.round(compatibility);
  }

  /**
   * Calculate location compatibility
   */
  static calculateLocationCompatibility(user1, user2) {
    const loc1 = user1.matchingPreferences?.locationPreferences || {};
    const loc2 = user2.matchingPreferences?.locationPreferences || {};

    // If both users are open to international connections
    if (loc1.international && loc2.international) {
      return 100;
    }

    // If both prefer same country
    if (loc1.sameCountry && loc2.sameCountry) {
      return 80;
    }

    // If both prefer nearby connections
    if (loc1.nearby && loc2.nearby) {
      return 90;
    }

    // Default compatibility
    return 60;
  }

  /**
   * Calculate activity compatibility
   */
  static calculateActivityCompatibility(user1, user2) {
    const activities1 = user1.matchingPreferences?.activityPreferences || [];
    const activities2 = user2.matchingPreferences?.activityPreferences || [];

    if (activities1.length === 0 || activities2.length === 0) {
      return 50;
    }

    const sharedActivities = activities1.filter(activity => 
      activities2.includes(activity)
    ).length;

    const totalActivities = new Set([...activities1, ...activities2]).size;
    const compatibility = (sharedActivities / totalActivities) * 100;

    return Math.min(100, Math.max(0, compatibility));
  }

  /**
   * Calculate age compatibility
   */
  static calculateAgeCompatibility(user1, user2) {
    const ageRange1 = user1.matchingPreferences?.ageRange || { min: 18, max: 100 };
    const ageRange2 = user2.matchingPreferences?.ageRange || { min: 18, max: 100 };

    // Calculate user ages (simplified - in real app, use birthday)
    const age1 = this.calculateAge(user1.birthday);
    const age2 = this.calculateAge(user2.birthday);

    if (!age1 || !age2) return 50;

    // Check if users are within each other's age preferences
    const user1Compatible = age2 >= ageRange1.min && age2 <= ageRange1.max;
    const user2Compatible = age1 >= ageRange2.min && age1 <= ageRange2.max;

    if (user1Compatible && user2Compatible) {
      return 100;
    } else if (user1Compatible || user2Compatible) {
      return 70;
    } else {
      return 30;
    }
  }

  /**
   * Calculate goal compatibility
   */
  static calculateGoalCompatibility(user1, user2) {
    const goals1 = user1.matchingPreferences?.relationshipGoals || [];
    const goals2 = user2.matchingPreferences?.relationshipGoals || [];

    if (goals1.length === 0 || goals2.length === 0) {
      return 50;
    }

    const sharedGoals = goals1.filter(goal => goals2.includes(goal)).length;
    const totalGoals = new Set([...goals1, ...goals2]).size;
    const compatibility = (sharedGoals / totalGoals) * 100;

    return Math.min(100, Math.max(0, compatibility));
  }

  /**
   * Generate human-readable compatibility breakdown
   */
  static generateCompatibilityBreakdown(factors) {
    const breakdown = [];

    if (factors.interests >= 80) {
      breakdown.push("You share many common interests!");
    } else if (factors.interests >= 60) {
      breakdown.push("You have some shared interests.");
    } else {
      breakdown.push("You have different interests that could complement each other.");
    }

    if (factors.personality >= 80) {
      breakdown.push("Your personalities are very compatible.");
    } else if (factors.personality >= 60) {
      breakdown.push("Your personalities complement each other well.");
    } else {
      breakdown.push("You have contrasting personalities that could create interesting dynamics.");
    }

    if (factors.activity >= 80) {
      breakdown.push("You enjoy similar activities and communication styles.");
    } else if (factors.activity >= 60) {
      breakdown.push("You have some overlapping activity preferences.");
    } else {
      breakdown.push("You have different activity preferences that could offer variety.");
    }

    return breakdown;
  }

  /**
   * Get recommended users for a given user
   */
  static async getRecommendations(userId, limit = 20, excludeIds = []) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get all other users excluding the current user and specified exclusions
      const excludeList = [userId, ...excludeIds];
      const otherUsers = await User.find({
        _id: { $nin: excludeList },
        isActive: true
      }).limit(100); // Get more users to calculate compatibility

      // Calculate compatibility for each user
      const recommendations = otherUsers.map(otherUser => {
        const compatibility = this.calculateCompatibility(user, otherUser);
        return {
          user: otherUser,
          compatibility: compatibility.score,
          factors: compatibility.factors,
          breakdown: compatibility.breakdown
        };
      });

      // Sort by compatibility score and return top recommendations
      return recommendations
        .sort((a, b) => b.compatibility - a.compatibility)
        .slice(0, limit)
        .map(rec => ({
          userId: rec.user._id,
          name: rec.user.name || rec.user.profile?.displayName,
          handle: rec.user.handle,
          bio: rec.user.bio || rec.user.profile?.bio,
          avatar: rec.user.avatar || rec.user.profile?.avatar,
          compatibility: rec.compatibility,
          factors: rec.factors,
          breakdown: rec.breakdown,
          online: this.isUserOnline(rec.user),
          followers: rec.user.followers || 0,
          verified: rec.user.profile?.isVerified || false
        }));

    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  /**
   * Update user's compatibility scores with other users
   */
  static async updateCompatibilityScores(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get all other active users
      const otherUsers = await User.find({
        _id: { $ne: userId },
        isActive: true
      });

      const compatibilityScores = [];

      for (const otherUser of otherUsers) {
        const compatibility = this.calculateCompatibility(user, otherUser);
        
        compatibilityScores.push({
          userId: otherUser._id,
          score: compatibility.score,
          factors: compatibility.factors,
          lastUpdated: new Date()
        });
      }

      // Update user's AI profile with new compatibility scores
      await User.findByIdAndUpdate(userId, {
        'aiProfile.compatibilityScores': compatibilityScores,
        'aiProfile.learningData.preferencesUpdated': new Date()
      });

      return compatibilityScores;

    } catch (error) {
      console.error('Error updating compatibility scores:', error);
      throw error;
    }
  }

  /**
   * Learn from user interactions and feedback
   */
  static async learnFromInteraction(userId, targetUserId, interactionType, success = true) {
    try {
      const updateField = success ? 'successfulMatches' : 'failedMatches';
      
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          [`aiProfile.learningData.${updateField}`]: targetUserId
        }
      });

      // Update behavior patterns
      await this.updateBehaviorPatterns(userId, interactionType);

    } catch (error) {
      console.error('Error learning from interaction:', error);
      throw error;
    }
  }

  /**
   * Update user behavior patterns
   */
  static async updateBehaviorPatterns(userId, interactionType) {
    try {
      const now = new Date();
      const currentHour = now.getHours();

      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          'aiProfile.behaviorPatterns.activeHours': currentHour
        },
        $inc: {
          'aiProfile.behaviorPatterns.interactionFrequency': 1
        }
      });

    } catch (error) {
      console.error('Error updating behavior patterns:', error);
      throw error;
    }
  }

  /**
   * Calculate user age from birthday
   */
  static calculateAge(birthday) {
    if (!birthday) return null;
    
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Check if user is online (simplified - in real app, use real-time data)
   */
  static isUserOnline(user) {
    if (!user.lastLogin) return false;
    
    const lastLogin = new Date(user.lastLogin);
    const now = new Date();
    const diffMinutes = (now - lastLogin) / (1000 * 60);
    
    // Consider user online if they logged in within the last 30 minutes
    return diffMinutes <= 30;
  }

  /**
   * Get personalized matching insights for a user
   */
  static async getMatchingInsights(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const preferences = user.matchingPreferences || {};
      const aiProfile = user.aiProfile || {};

      const insights = {
        profileCompleteness: this.calculateProfileCompleteness(preferences),
        topInterests: preferences.contentInterests?.slice(0, 5) || [],
        personalitySummary: this.generatePersonalitySummary(preferences.personalityTraits),
        activityPreferences: preferences.activityPreferences || [],
        communicationStyle: preferences.communicationStyle || {},
        recommendations: {
          improveProfile: this.getProfileImprovementSuggestions(preferences),
          expandInterests: this.getInterestExpansionSuggestions(preferences.contentInterests),
          optimizeMatching: this.getMatchingOptimizationTips(aiProfile)
        }
      };

      return insights;

    } catch (error) {
      console.error('Error getting matching insights:', error);
      throw error;
    }
  }

  /**
   * Calculate profile completeness percentage
   */
  static calculateProfileCompleteness(preferences) {
    const fields = [
      'contentInterests',
      'personalityTraits',
      'relationshipGoals',
      'ageRange',
      'locationPreferences',
      'activityPreferences',
      'communicationStyle'
    ];

    let completedFields = 0;
    fields.forEach(field => {
      if (preferences[field] && 
          (Array.isArray(preferences[field]) ? preferences[field].length > 0 : true)) {
        completedFields++;
      }
    });

    return Math.round((completedFields / fields.length) * 100);
  }

  /**
   * Generate personality summary
   */
  static generatePersonalitySummary(traits) {
    if (!traits) return "Personality not assessed yet";

    const topTraits = Object.entries(traits)
      .filter(([_, value]) => value >= 4)
      .map(([trait, _]) => trait)
      .slice(0, 3);

    if (topTraits.length === 0) return "Balanced personality";

    return `Mostly ${topTraits.join(', ')}`;
  }

  /**
   * Get profile improvement suggestions
   */
  static getProfileImprovementSuggestions(preferences) {
    const suggestions = [];

    if (!preferences.contentInterests || preferences.contentInterests.length < 3) {
      suggestions.push("Add more content interests to improve matching accuracy");
    }

    if (!preferences.relationshipGoals || preferences.relationshipGoals.length === 0) {
      suggestions.push("Specify your relationship goals for better matches");
    }

    if (!preferences.activityPreferences || preferences.activityPreferences.length < 2) {
      suggestions.push("Add more activity preferences to find compatible users");
    }

    return suggestions;
  }

  /**
   * Get interest expansion suggestions
   */
  static getInterestExpansionSuggestions(currentInterests) {
    const allInterests = [
      'fitness', 'art', 'music', 'photography', 'travel', 'food', 'fashion',
      'technology', 'gaming', 'sports', 'education', 'business', 'lifestyle',
      'beauty', 'comedy', 'dance', 'writing', 'crafts', 'nature', 'pets'
    ];

    const currentSet = new Set(currentInterests || []);
    const suggestions = allInterests.filter(interest => !currentSet.has(interest));

    return suggestions.slice(0, 5);
  }

  /**
   * Get matching optimization tips
   */
  static getMatchingOptimizationTips(aiProfile) {
    const tips = [];

    if (!aiProfile.learningData || aiProfile.learningData.successfulMatches.length < 5) {
      tips.push("Interact with more users to improve AI matching accuracy");
    }

    if (!aiProfile.behaviorPatterns || aiProfile.behaviorPatterns.activeHours.length < 3) {
      tips.push("Be more active to help the AI understand your preferences");
    }

    if (!aiProfile.learningData || aiProfile.learningData.userFeedback.length < 3) {
      tips.push("Provide feedback on matches to improve future recommendations");
    }

    return tips;
  }
}

module.exports = AIMatchingService;
