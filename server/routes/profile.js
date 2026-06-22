const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// GET /api/profile
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// PUT /api/profile
router.put('/', authenticate, async (req, res) => {
  const { name, phone, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, avatar }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// PUT /api/profile/student
router.put('/student', authenticate, async (req, res) => {
  const { age, skill_level, medical_info, emergency_contact } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.student_profile = {
      age,
      skill_level,
      medical_info,
      emergency_contact
    };
    if (user.role === 'user') user.role = 'student';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student profile.' });
  }
});

module.exports = router;
