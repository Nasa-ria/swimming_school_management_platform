const express = require('express');
const Booking = require('../models/Booking');
const Session = require('../models/Session');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/bookings
router.post('/', authenticate, async (req, res) => {
  const { session_id, notes } = req.body;
  if (!session_id) return res.status(400).json({ error: 'Session ID is required.' });

  try {
    const session = await Session.findById(session_id);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    
    if (session.status !== 'available') {
      return res.status(400).json({ error: 'This session is not available for booking.' });
    }
    if (session.enrolled >= session.capacity) {
      return res.status(400).json({ error: 'This session is full.' });
    }

    const existing = await Booking.findOne({ session: session_id, user: req.user.id, status: { $ne: 'cancelled' } });
    if (existing) {
      return res.status(409).json({ error: 'You have already booked this session.' });
    }

    const booking = new Booking({ session: session_id, user: req.user.id, notes });
    await booking.save();
    
    session.enrolled += 1;
    if (session.enrolled >= session.capacity) {
      session.status = 'full';
    }
    await session.save();

    res.status(201).json({ message: 'Booking confirmed!', id: booking._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
});

// GET /api/bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('session')
      .sort({ createdAt: -1 });
      
    // Format to match previous API response
    const results = bookings.map(b => ({
      ...b.toObject(),
      title: b.session?.title,
      start_time: b.session?.start_time,
      end_time: b.session?.end_time,
      location: b.session?.location,
      type: b.session?.type,
      price: b.session?.price,
      level: b.session?.level
    }));
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// GET /api/bookings/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('session')
      .populate('user', 'name email');
      
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    
    res.json({
      ...booking.toObject(),
      title: booking.session?.title,
      start_time: booking.session?.start_time,
      student_name: booking.user?.name,
      student_email: booking.user?.email
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking.' });
  }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled.' });
    }

    booking.status = 'cancelled';
    await booking.save();
    
    const session = await Session.findById(booking.session);
    if (session) {
      session.enrolled = Math.max(session.enrolled - 1, 0);
      session.status = 'available';
      await session.save();
    }
    
    res.json({ message: 'Booking cancelled.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

module.exports = router;
