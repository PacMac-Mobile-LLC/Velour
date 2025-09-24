const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password -__v');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        handle: user.handle,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        location: user.location,
        phone: user.phone,
        website: user.website,
        birthday: user.birthday,
        joinDate: user.createdAt,
        stats: {
          followers: user.followers || 0,
          following: user.following || 0,
          posts: user.posts || 0
        },
        settings: {
          profileVisibility: user.profileVisibility || 'public',
          emailNotifications: user.emailNotifications !== false,
          pushNotifications: user.pushNotifications !== false,
          twoFactorAuth: user.twoFactorAuth || false,
          dataSharing: user.dataSharing || false,
          marketingEmails: user.marketingEmails || false
        },
        links: user.links || []
      }
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.password;
    delete updateData.email; // Email updates should be handled separately
    delete updateData.createdAt;
    delete updateData.updatedAt;

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

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        handle: user.handle,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        location: user.location,
        phone: user.phone,
        website: user.website,
        birthday: user.birthday,
        joinDate: user.createdAt,
        stats: {
          followers: user.followers || 0,
          following: user.following || 0,
          posts: user.posts || 0
        },
        settings: {
          profileVisibility: user.profileVisibility || 'public',
          emailNotifications: user.emailNotifications !== false,
          pushNotifications: user.pushNotifications !== false,
          twoFactorAuth: user.twoFactorAuth || false,
          dataSharing: user.dataSharing || false,
          marketingEmails: user.marketingEmails || false
        },
        links: user.links || []
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Update profile settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      profileVisibility,
      emailNotifications,
      pushNotifications,
      twoFactorAuth,
      dataSharing,
      marketingEmails
    } = req.body;

    const updateData = {};
    if (profileVisibility !== undefined) updateData.profileVisibility = profileVisibility;
    if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications;
    if (pushNotifications !== undefined) updateData.pushNotifications = pushNotifications;
    if (twoFactorAuth !== undefined) updateData.twoFactorAuth = twoFactorAuth;
    if (dataSharing !== undefined) updateData.dataSharing = dataSharing;
    if (marketingEmails !== undefined) updateData.marketingEmails = marketingEmails;

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

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings: {
          profileVisibility: user.profileVisibility || 'public',
          emailNotifications: user.emailNotifications !== false,
          pushNotifications: user.pushNotifications !== false,
          twoFactorAuth: user.twoFactorAuth || false,
          dataSharing: user.dataSharing || false,
          marketingEmails: user.marketingEmails || false
        }
      }
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Add external link
router.post('/links', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, url, type } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: 'Title and URL are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newLink = {
      id: Date.now().toString(),
      title,
      description: description || '',
      url,
      type: type || 'website'
    };

    if (!user.links) {
      user.links = [];
    }

    user.links.push(newLink);
    await user.save();

    res.json({
      success: true,
      message: 'Link added successfully',
      data: newLink
    });

  } catch (error) {
    console.error('Error adding link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add link'
    });
  }
});

// Update external link
router.put('/links/:linkId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const linkId = req.params.linkId;
    const { title, description, url, type } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const linkIndex = user.links.findIndex(link => link.id === linkId);
    if (linkIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    // Update link
    if (title !== undefined) user.links[linkIndex].title = title;
    if (description !== undefined) user.links[linkIndex].description = description;
    if (url !== undefined) user.links[linkIndex].url = url;
    if (type !== undefined) user.links[linkIndex].type = type;

    await user.save();

    res.json({
      success: true,
      message: 'Link updated successfully',
      data: user.links[linkIndex]
    });

  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update link'
    });
  }
});

// Delete external link
router.delete('/links/:linkId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const linkId = req.params.linkId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const linkIndex = user.links.findIndex(link => link.id === linkId);
    if (linkIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    user.links.splice(linkIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Link deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete link'
    });
  }
});

module.exports = router;
