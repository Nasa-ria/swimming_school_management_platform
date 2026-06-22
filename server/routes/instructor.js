const express = require('express');
const Session = require('../models/Session');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Evaluation = require('../models/Evaluation');
const { authenticate, isInstructor } = require('../middleware/auth');

const router = express.Router();

// GET /api/instructor/dashboard
router.get('/dashboard', authenticate, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [sessions, pendingSessions, evaluations] = await Promise.all([
      Session.find({ instructor: instructorId, assignment_status: 'accepted' }),
      Session.find({ instructor: instructorId, assignment_status: 'pending' }),
      Evaluation.find({ instructor: instructorId }).sort({ createdAt: -1 }).limit(5).populate('student', 'name')
    ]);

    const sessionIds = sessions.map(s => s._id);
    const [bookings, assignedStudents] = await Promise.all([
      Booking.find({ session: { $in: sessionIds }, status: 'confirmed' }),
      User.find({ role: 'student', 'student_profile.assigned_instructor': instructorId })
    ]);
    
    const bookedStudents = bookings.map(b => b.user.toString());
    const directlyAssigned = assignedStudents.map(s => s._id.toString());
    const uniqueStudents = [...new Set([...bookedStudents, ...directlyAssigned])];

    const upcomingToday = sessions.filter(s => {
      const start = new Date(s.start_time);
      return start >= today && start < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });

    res.json({
      total_students: uniqueStudents.length,
      upcoming_today: upcomingToday.length,
      pending_assignments: pendingSessions.length,
      recent_feedback_count: evaluations.length,
      recent_evaluations: evaluations.map(e => ({
        id: e._id,
        student: e.student?.name,
        grade: e.grade,
        date: e.createdAt
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch instructor dashboard.' });
  }
});

// GET /api/instructor/sessions
router.get('/sessions', authenticate, isInstructor, async (req, res) => {
  try {
    let filter = { instructor: req.user.id };
    if (req.user.role === 'admin') filter = {};
    const sessions = await Session.find(filter).sort({ start_time: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch instructor sessions.' });
  }
});

// PUT /api/instructor/sessions/:sessionId/status
// Accept or Decline a session
router.put('/sessions/:sessionId/status', authenticate, isInstructor, async (req, res) => {
  const { status, note } = req.body;
  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    if (session.instructor.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized for this session.' });
    }

    session.assignment_status = status;
    session.assignment_note = note;
    await session.save();
    res.json({ message: `Session ${status} successfully.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session status.' });
  }
});

// PUT /api/instructor/sessions/:sessionId
// Update session details (time, location, etc)
router.put('/sessions/:sessionId', authenticate, isInstructor, async (req, res) => {
  const { start_time, end_time, location, description, title } = req.body;
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    if (session.instructor.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized for this session.' });
    }

    if (start_time) session.start_time = start_time;
    if (end_time) session.end_time = end_time;
    if (location) session.location = location;
    if (description) session.description = description;
    if (title) session.title = title;

    await session.save();
    res.json({ message: 'Session updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session.' });
  }
});

// GET /api/instructor/sessions/:sessionId/students
// Get students booked for a specific session
router.get('/sessions/:sessionId/students', authenticate, isInstructor, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    
    // Safety check: only the assigned instructor (or admin) can see student list
    if (session.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const bookings = await Booking.find({ session: req.params.sessionId, status: 'confirmed' })
      .populate('user', 'name email student_profile avatar');
    
    const students = bookings.map(b => b.user);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

// GET /api/instructor/sessions/:sessionId/bookings
// Get full booking objects for attendance tracking
router.get('/sessions/:sessionId/bookings', authenticate, isInstructor, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    if (session.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    const bookings = await Booking.find({ session: req.params.sessionId, status: 'confirmed' })
      .populate('user', 'name email avatar');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// PUT /api/instructor/bookings/:bookingId/attendance
// Mark attendance for a student
router.put('/bookings/:bookingId/attendance', authenticate, isInstructor, async (req, res) => {
  const { attendance } = req.body;
  if (!['present', 'absent', 'pending'].includes(attendance)) {
    return res.status(400).json({ error: 'Invalid attendance status.' });
  }
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('session');
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    if (booking.session.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized for this session.' });
    }
    booking.attendance = attendance;
    await booking.save();
    res.json({ message: 'Attendance updated.', booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark attendance.' });
  }
});

// POST /api/instructor/evaluate
// Grade a student's performance
router.post('/evaluate', authenticate, isInstructor, async (req, res) => {
  const { student_id, session_id, grade, performance_score, feedback } = req.body;
  try {
    const evaluation = new Evaluation({
      student: student_id,
      instructor: req.user.id,
      session: session_id,
      grade,
      performance_score,
      feedback
    });
    await evaluation.save();
    res.status(201).json({ message: 'Evaluation submitted successfully.', evaluation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit evaluation.' });
  }
});

// PUT /api/instructor/students/:studentId/level
// Upgrade a student's level
router.put('/students/:studentId/level', authenticate, isInstructor, async (req, res) => {
  const { skill_level } = req.body;
  try {
    const student = await User.findById(req.params.studentId);
    if (!student) return res.status(404).json({ error: 'Student not found.' });
    
    if (!student.student_profile) {
      student.student_profile = { skill_level };
    } else {
      student.student_profile.skill_level = skill_level;
    }
    
    await student.save();
    res.json({ message: `Student level updated to ${skill_level}.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student level.' });
  }
});

// GET /api/instructor/my-students
// Get all students directly assigned to this instructor (or all students if admin)
router.get('/my-students', authenticate, isInstructor, async (req, res) => {
  try {
    let filter = { role: 'student', 'student_profile.assigned_instructor': req.user.id };
    if (req.user.role === 'admin') filter = { role: 'student' };
    
    const students = await User.find(filter).select('name email student_profile avatar');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assigned students.' });
  }
});

module.exports = router;
