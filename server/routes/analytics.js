const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Subscription = require('../models/Subscription');
const Statement = require('../models/Statement');

// @route   GET /api/analytics
// @desc    Get user analytics
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = '30d' } = req.query;

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get basic stats
    const [
      totalPosts,
      totalComments,
      totalSubscribers,
      totalEarnings,
      recentPosts,
      recentComments,
      subscriberGrowth,
      earningsGrowth
    ] = await Promise.all([
      // Total posts
      Post.countDocuments({ userId }),
      
      // Total comments on user's posts
      Comment.countDocuments({ 
        postId: { $in: await Post.find({ userId }).distinct('_id') }
      }),
      
      // Total subscribers
      Subscription.countDocuments({ 
        creatorId: userId,
        status: 'active'
      }),
      
      // Total earnings
      Statement.aggregate([
        { $match: { userId: userId, type: 'earnings', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      
      // Recent posts (last 30 days)
      Post.find({ 
        userId,
        createdAt: { $gte: startDate }
      }).sort({ createdAt: -1 }).limit(10),
      
      // Recent comments
      Comment.find({
        postId: { $in: await Post.find({ userId }).distinct('_id') },
        createdAt: { $gte: startDate }
      }).populate('userId', 'name handle avatar').sort({ createdAt: -1 }).limit(10),
      
      // Subscriber growth
      Subscription.aggregate([
        { $match: { creatorId: userId } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),
      
      // Earnings growth
      Statement.aggregate([
        { 
          $match: { 
            userId: userId, 
            type: 'earnings',
            status: 'completed',
            createdAt: { $gte: startDate }
          } 
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            amount: { $sum: '$amount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
    ]);

    // Get engagement metrics
    const engagementMetrics = await Post.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$engagement.likes' },
          totalComments: { $sum: '$engagement.comments' },
          totalShares: { $sum: '$engagement.shares' },
          totalViews: { $sum: '$engagement.views' },
          avgLikes: { $avg: '$engagement.likes' },
          avgComments: { $avg: '$engagement.comments' },
          avgShares: { $avg: '$engagement.shares' },
          avgViews: { $avg: '$engagement.views' }
        }
      }
    ]);

    // Get top performing posts
    const topPosts = await Post.find({ userId })
      .sort({ 'engagement.likes': -1, 'engagement.views': -1 })
      .limit(5)
      .select('title content engagement createdAt');

    // Get content type distribution
    const contentDistribution = await Post.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalLikes: { $sum: '$engagement.likes' },
          totalViews: { $sum: '$engagement.views' }
        }
      }
    ]);

    // Get audience demographics (mock data for now)
    const audienceDemographics = {
      ageGroups: [
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 40 },
        { range: '35-44', percentage: 20 },
        { range: '45+', percentage: 5 }
      ],
      genders: [
        { gender: 'Male', percentage: 45 },
        { gender: 'Female', percentage: 50 },
        { gender: 'Other', percentage: 5 }
      ],
      locations: [
        { country: 'United States', percentage: 60 },
        { country: 'Canada', percentage: 15 },
        { country: 'United Kingdom', percentage: 10 },
        { country: 'Australia', percentage: 8 },
        { country: 'Other', percentage: 7 }
      ]
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalPosts,
          totalComments,
          totalSubscribers,
          totalEarnings: totalEarnings[0]?.total || 0,
          timeframe
        },
        engagement: engagementMetrics[0] || {
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          totalViews: 0,
          avgLikes: 0,
          avgComments: 0,
          avgShares: 0,
          avgViews: 0
        },
        growth: {
          subscribers: subscriberGrowth,
          earnings: earningsGrowth
        },
        topPosts: topPosts.map(post => ({
          id: post._id,
          title: post.title,
          content: post.content.substring(0, 100) + '...',
          likes: post.engagement.likes,
          comments: post.engagement.comments,
          shares: post.engagement.shares,
          views: post.engagement.views,
          createdAt: post.createdAt.toISOString().split('T')[0]
        })),
        contentDistribution: contentDistribution.map(item => ({
          type: item._id,
          count: item.count,
          totalLikes: item.totalLikes,
          totalViews: item.totalViews
        })),
        audience: audienceDemographics,
        recentActivity: {
          posts: recentPosts.map(post => ({
            id: post._id,
            title: post.title,
            type: post.type,
            likes: post.engagement.likes,
            comments: post.engagement.comments,
            createdAt: post.createdAt.toISOString().split('T')[0]
          })),
          comments: recentComments.map(comment => ({
            id: comment._id,
            text: comment.text.substring(0, 100) + '...',
            author: {
              name: comment.userId.name,
              handle: comment.userId.handle,
              avatar: comment.userId.avatar
            },
            createdAt: comment.createdAt.toISOString().split('T')[0]
          }))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard stats
// @access  Private
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalPosts,
      totalSubscribers,
      totalEarnings,
      recentEarnings
    ] = await Promise.all([
      Post.countDocuments({ userId }),
      Subscription.countDocuments({ creatorId: userId, status: 'active' }),
      Statement.aggregate([
        { $match: { userId: userId, type: 'earnings', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Statement.find({ 
        userId: userId, 
        type: 'earnings',
        status: 'completed'
      }).sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      success: true,
      data: {
        totalPosts,
        totalSubscribers,
        totalEarnings: totalEarnings[0]?.total || 0,
        recentEarnings: recentEarnings.map(earning => ({
          id: earning._id,
          amount: earning.amount,
          description: earning.description,
          period: {
            startDate: earning.period.startDate.toISOString().split('T')[0],
            endDate: earning.period.endDate.toISOString().split('T')[0]
          },
          createdAt: earning.createdAt.toISOString().split('T')[0]
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
});

module.exports = router;
