const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    
    const user = new User({ name, email, password, phone });
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, email, role: 'user', name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: user._id, name, email, role: 'user' },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  console.log('--- LOGIN ROUTE REACHED ---');
  console.log('Body:', req.body);
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    console.log('Comparing passwords...');
    const match = await user.comparePassword(password);
    console.log('Match result:', match);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET is missing from environment variables!');
      throw new Error('JWT_SECRET missing');
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    console.error('Login error details:', err);
    res.status(500).json({ error: 'Server error during login: ' + err.message });
  }
});

// GET /api/auth/user
router.get('/user', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

module.exports = router;
