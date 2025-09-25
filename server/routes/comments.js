const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Comment = require('../models/Comment');
const CommentLike = require('../models/CommentLike');
const User = require('../models/User');

const router = express.Router();

// POST /api/comments/:id/like - Toggle like on comment
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.sub;

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Toggle like
    const result = await CommentLike.toggleLike(commentId, userId);
    
    // Get updated like count
    const updatedComment = await Comment.findById(commentId);
    
    res.json({
      isLiked: result.isLiked,
      likeCount: updatedComment.likes
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ error: 'Failed to toggle comment like' });
  }
});

// PUT /api/comments/:id - Update comment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.sub;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }

    comment.content = content.trim();
    comment.is_edited = true;
    comment.edited_at = new Date();

    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub;

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    // Soft delete
    comment.is_deleted = true;
    await comment.save();

    // Decrement comment count on video
    const Video = require('../models/Video');
    await Video.findByIdAndUpdate(comment.video_id, { $inc: { comments: -1 } });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;