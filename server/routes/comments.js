const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add comment to post
router.post('/', async (req, res) => {
  try {
    const { postId, author, content } = req.body;
    
    const comment = await Comment.create({
      postId,
      author: author || 'Anonymous',
      content
    });
    
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete comment
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    
    await comment.deleteOne();
    await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });
    
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;