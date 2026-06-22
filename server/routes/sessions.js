const express = require('express');
const Session = require('../models/Session');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/sessions
router.get('/', async (req, res) => {
  const { level, status, search } = req.query;
  try {
    let query = {};
    if (level && level !== 'all') query.level = level;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sessions = await Session.find(query)
      .populate('instructor', 'name')
      .sort({ start_time: 1 });
      
    // Map instructor to instructor_name for compatibility
    const results = sessions.map(s => ({
      ...s.toObject(),
      instructor_name: s.instructor?.name || 'TBA'
    }));
    
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
});

// GET /api/sessions/:id
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('instructor', 'name bio specialization');
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    
    // Reviews are currently a separate model in SQL; in Mongo we could embed or use a separate model.
    // To minimize frontend changes, I'll keep them as a separate concept but fetched here.
    // Actually, I'll create a Review model for Mongo to keep it clean.
    res.json({
      ...session.toObject(),
      instructor_name: session.instructor?.name,
      instructor_bio: session.instructor?.bio,
      reviews: [] // Placeholder until Review model is implemented if needed
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session.' });
  }
});

// POST /api/sessions (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json({ message: 'Session created.', id: session._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create session.' });
  }
});

// PUT /api/sessions/:id (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await Session.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Session updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session.' });
  }
});

// DELETE /api/sessions/:id (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete session.' });
  }
});

module.exports = router;
