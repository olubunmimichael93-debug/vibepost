const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

router.post('/setup', async (req, res) => {
  try {
    const adminExists = await Admin.findOne();
    if (adminExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin already exists' 
      });
    }
    
    const admin = await Admin.create({
      email: 'admin@vibe.com',
      password: 'vibe123'
    });
    
    res.json({
      success: true,
      message: 'Admin created',
      credentials: {
        email: 'admin@vibe.com',
        password: 'vibe123'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = generateToken(admin._id);
    res.json({
      success: true,
      token,
      admin: { id: admin._id, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;