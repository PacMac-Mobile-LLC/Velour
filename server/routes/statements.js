const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Statement = require('../models/Statement');

// @route   GET /api/statements
// @desc    Get user's statements
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type, status, startDate, endDate } = req.query;

    let query = { userId };
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query['period.startDate'] = { $gte: new Date(startDate) };
      query['period.endDate'] = { $lte: new Date(endDate) };
    }

    const statements = await Statement.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Statement.countDocuments(query);

    res.json({
      success: true,
      data: statements.map(statement => ({
        id: statement._id,
        type: statement.type,
        amount: statement.amount,
        amountFormatted: statement.amountFormatted,
        currency: statement.currency,
        description: statement.description,
        reference: statement.reference,
        status: statement.status,
        period: {
          startDate: statement.period.startDate.toISOString().split('T')[0],
          endDate: statement.period.endDate.toISOString().split('T')[0],
          duration: statement.periodDuration
        },
        breakdown: statement.breakdown,
        payout: statement.payout,
        metadata: statement.metadata,
        createdAt: statement.createdAt.toISOString().split('T')[0],
        updatedAt: statement.updatedAt.toISOString().split('T')[0]
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });

  } catch (error) {
    console.error('Error fetching statements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statements'
    });
  }
});

// @route   GET /api/statements/summary
// @desc    Get earnings summary
// @access  Private
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const summary = await Statement.getEarningsSummary(
      userId, 
      new Date(startDate), 
      new Date(endDate)
    );

    res.json({
      success: true,
      data: summary[0] || {
        totalEarnings: 0,
        totalFees: 0,
        netEarnings: 0,
        statementCount: 0
      }
    });

  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch earnings summary'
    });
  }
});

// @route   GET /api/statements/monthly/:year
// @desc    Get monthly earnings for a year
// @access  Private
router.get('/monthly/:year', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.params.year);

    if (isNaN(year) || year < 2020 || year > new Date().getFullYear() + 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year provided'
      });
    }

    const monthlyEarnings = await Statement.getMonthlyEarnings(userId, year);

    // Fill in missing months with zero values
    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const existingData = monthlyEarnings.find(item => item._id === month);
      monthlyData.push({
        month: month,
        monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
        totalEarnings: existingData?.totalEarnings || 0,
        netEarnings: existingData?.netEarnings || 0,
        statementCount: existingData?.statementCount || 0
      });
    }

    res.json({
      success: true,
      data: monthlyData
    });

  } catch (error) {
    console.error('Error fetching monthly earnings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly earnings'
    });
  }
});

// @route   GET /api/statements/top-earning-periods
// @desc    Get top earning periods
// @access  Private
router.get('/top-earning-periods', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const topPeriods = await Statement.getTopEarningPeriods(userId, parseInt(limit));

    res.json({
      success: true,
      data: topPeriods.map(period => ({
        id: period._id,
        amount: period.amount,
        amountFormatted: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(period.amount),
        period: {
          startDate: period.period.startDate.toISOString().split('T')[0],
          endDate: period.period.endDate.toISOString().split('T')[0]
        },
        description: period.description,
        netAmount: period.breakdown.netAmount
      }))
    });

  } catch (error) {
    console.error('Error fetching top earning periods:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top earning periods'
    });
  }
});

// @route   GET /api/statements/:id
// @desc    Get specific statement
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const statementId = req.params.id;

    const statement = await Statement.findOne({ _id: statementId, userId });

    if (!statement) {
      return res.status(404).json({
        success: false,
        message: 'Statement not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: statement._id,
        type: statement.type,
        amount: statement.amount,
        amountFormatted: statement.amountFormatted,
        currency: statement.currency,
        description: statement.description,
        reference: statement.reference,
        status: statement.status,
        period: {
          startDate: statement.period.startDate.toISOString().split('T')[0],
          endDate: statement.period.endDate.toISOString().split('T')[0],
          duration: statement.periodDuration
        },
        breakdown: statement.breakdown,
        payout: statement.payout,
        metadata: statement.metadata,
        createdAt: statement.createdAt.toISOString().split('T')[0],
        updatedAt: statement.updatedAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error fetching statement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statement'
    });
  }
});

// @route   POST /api/statements
// @desc    Create a new statement (admin only - for testing)
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      type,
      amount,
      currency = 'USD',
      description,
      reference,
      period,
      breakdown,
      metadata
    } = req.body;

    if (!type || !amount || !description || !period) {
      return res.status(400).json({
        success: false,
        message: 'Type, amount, description, and period are required'
      });
    }

    const statement = new Statement({
      userId,
      type,
      amount: parseFloat(amount),
      currency,
      description,
      reference,
      period: {
        startDate: new Date(period.startDate),
        endDate: new Date(period.endDate)
      },
      breakdown: breakdown || {},
      metadata: metadata || {}
    });

    // Calculate net amount if breakdown is provided
    if (breakdown && breakdown.fees) {
      await statement.calculateNetAmount();
    }

    await statement.save();

    res.status(201).json({
      success: true,
      data: {
        id: statement._id,
        type: statement.type,
        amount: statement.amount,
        amountFormatted: statement.amountFormatted,
        currency: statement.currency,
        description: statement.description,
        status: statement.status,
        period: {
          startDate: statement.period.startDate.toISOString().split('T')[0],
          endDate: statement.period.endDate.toISOString().split('T')[0]
        },
        breakdown: statement.breakdown,
        createdAt: statement.createdAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error creating statement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create statement'
    });
  }
});

module.exports = router;
