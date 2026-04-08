const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const { protect } = require('../middleware/auth');

// Get all posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single post (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create post (admin only)
router.post('/', protect, async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update post (admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete post (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    await Comment.deleteMany({ postId: req.params.id });
    await Like.deleteMany({ postId: req.params.id });
    await post.deleteOne();
    
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle like on post (public)
router.post('/:id/like', async (req, res) => {
  try {
    const userId = req.body.userId || 'anonymous_' + req.ip;
    const postId = req.params.id;
    
    const existingLike = await Like.findOne({ postId, userId });
    
    if (existingLike) {
      await existingLike.deleteOne();
      await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
      res.json({ success: true, liked: false });
    } else {
      await Like.create({ postId, userId });
      await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
      res.json({ success: true, liked: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check if user liked post
router.get('/:id/like-status', async (req, res) => {
  try {
    const userId = req.query.userId || 'anonymous_' + req.ip;
    const like = await Like.findOne({ postId: req.params.id, userId });
    res.json({ success: true, liked: !!like });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;