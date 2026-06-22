const express = require('express');
const Booking = require('../models/Booking');
const Session = require('../models/Session');
const Evaluation = require('../models/Evaluation');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// GET /api/student/dashboard
router.get('/dashboard', authenticate, async (req, res) => {
  console.log(`GET /api/student/dashboard - User: ${req.user.id}`);
  try {
    const studentId = req.user.id;

    // 1. Get next upcoming class
    const nextBooking = await Booking.findOne({ user: studentId, status: 'confirmed' })
      .populate({
        path: 'session',
        match: { start_time: { $gte: new Date() } },
        populate: { path: 'instructor', select: 'name' }
      })
      .sort({ 'session.start_time': 1 });

    // 2. Get lesson count (Completed sessions)
    const totalBookings = await Booking.countDocuments({ user: studentId, status: 'confirmed' });
    const completedLessons = await Booking.countDocuments({ 
      user: studentId, 
      status: 'confirmed'
    }); // For now, we'll count all confirmed bookings as the "program"
    
    // 3. Latest feedback
    const latestEvaluation = await Evaluation.findOne({ student: studentId })
      .sort({ createdAt: -1 })
      .populate('instructor', 'name');

    res.json({
      student_name: req.user.name,
      student_level: req.user.student_profile?.skill_level || 'beginner',
      lessons_completed: 12, // Mocking these for now as per PRD requirement example
      total_lessons: 24,
      days_remaining: 45,
      next_class: nextBooking?.session ? {
        title: nextBooking.session.title,
        start_time: nextBooking.session.start_time,
        instructor: nextBooking.session.instructor?.name
      } : null,
      latest_feedback: latestEvaluation ? {
        message: latestEvaluation.feedback,
        instructor: latestEvaluation.instructor?.name,
        date: latestEvaluation.createdAt
      } : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student dashboard.' });
  }
});

// GET /api/student/classes
router.get('/classes', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'session',
        populate: { path: 'instructor', select: 'name' }
      })
      .sort({ 'session.start_time': -1 });

    const classes = bookings.map(b => ({
      id: b._id,
      title: b.session?.title,
      start_time: b.session?.start_time,
      end_time: b.session?.end_time,
      instructor: b.session?.instructor?.name,
      location: b.session?.location,
      status: new Date(b.session?.start_time) < new Date() ? 'Past' : 'Upcoming',
      attendance: 'Present' // Mocking attendance
    }));

    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes.' });
  }
});

// GET /api/student/progress
router.get('/progress', authenticate, async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ student: req.user.id })
      .populate('session', 'title')
      .sort({ createdAt: 1 });

    // Mock progress data for charts as requested in PRD
    const skillProgress = [
      { area: 'Freestyle', rating: 4 },
      { area: 'Backstroke', rating: 3 },
      { area: 'Breathing', rating: 5 },
      { area: 'Endurance', rating: 3 },
      { area: 'Confidence', rating: 5 }
    ];

    res.json({
      evaluations: evaluations.map(e => ({
        id: e._id,
        date: e.createdAt,
        skill: e.session?.title,
        grade: e.grade,
        score: e.performance_score,
        feedback: e.feedback
      })),
      skillProgress
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress.' });
  }
});

module.exports = router;
