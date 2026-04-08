const express = require('express');
const router = express.Router();
const Share = require('../models/Share');
const Post = require('../models/Post');

// Track share
router.post('/', async (req, res) => {
  try {
    const { postId } = req.body;
    
    await Share.create({ postId });
    const updatedPost = await Post.findByIdAndUpdate(
      postId, 
      { $inc: { shares: 1 } },
      { new: true }
    );
    
    res.json({ success: true, shares: updatedPost.shares });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get share count
router.get('/:postId', async (req, res) => {
  try {
    const count = await Share.countDocuments({ postId: req.params.postId });
    res.json({ success: true, shares: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;