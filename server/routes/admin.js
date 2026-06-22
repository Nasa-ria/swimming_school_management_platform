const express = require('express');
const User = require('../models/User');
const Session = require('../models/Session');
const Booking = require('../models/Booking');
const Product = require('../models/Product');
const Order = require('../models/Order');
const BlogPost = require('../models/BlogPost');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/dashboard
router.get('/dashboard', authenticate, isAdmin, async (req, res) => {
  try {
    const [
      total_users,
      total_students,
      total_sessions,
      total_bookings,
      total_products,
      total_orders,
      total_posts,
      orders
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Session.countDocuments(),
      Booking.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      BlogPost.countDocuments(),
      Order.find().select('total_amount')
    ]);

    const revenue = orders.reduce((sum, o) => sum + o.total_amount, 0);

    const recent_bookings = await Booking.find()
      .populate('user', 'name')
      .populate('session', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      total_users,
      total_students,
      total_sessions,
      total_bookings,
      total_products,
      total_orders,
      total_posts,
      revenue: parseFloat(revenue.toFixed(2)),
      recent_bookings: recent_bookings.map(b => ({
        id: b._id,
        student: b.user?.name,
        session: b.session?.title,
        status: b.status
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats.' });
  }
});

// GET /api/admin/users
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// POST /api/admin/create-users
router.post('/create-users', authenticate, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const user = new User({ name, email, password, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', authenticate, isAdmin, async (req, res) => {
  const { role } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: 'User role updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin users.' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// GET /api/admin/inventory
router.get('/inventory', authenticate, isAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ stock: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory.' });
  }
});

// GET /api/admin/instructors
router.get('/instructors', authenticate, isAdmin, async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select('name email');
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch instructors.' });
  }
});

// GET /api/admin/assignments
router.get('/assignments', authenticate, isAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email student_profile')
      .populate('student_profile.assigned_instructor', 'name');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignments.' });
  }
});

// POST /api/admin/assign-instructor
router.post('/assign-instructor', authenticate, isAdmin, async (req, res) => {
  const { student_id, instructor_id } = req.body;
  try {
    const student = await User.findById(student_id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found.' });
    }
    
    student.student_profile.assigned_instructor = instructor_id;
    await student.save();
    res.json({ message: 'Instructor assigned successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign instructor.' });
  }
});

// GET /api/admin/paid-sessions
router.get('/paid-sessions', authenticate, isAdmin, async (req, res) => {
  try {
    // A paid session is a booking with status 'confirmed' (since we don't have a separate payment table yet, we use status)
    const bookings = await Booking.find({ status: 'confirmed' })
      .populate('user', 'name')
      .populate({
        path: 'session',
        populate: { path: 'instructor', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json(bookings.map(b => ({
      id: b._id,
      student_name: b.user?.name,
      session_title: b.session?.title,
      date: b.session?.start_time,
      assigned_instructor: b.session?.instructor?.name || 'Unassigned',
      instructor_id: b.session?.instructor?._id,
      session_id: b.session?._id,
      status: b.status
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch paid sessions.' });
  }
});

// POST /api/admin/assign-session-instructor
router.post('/assign-session-instructor', authenticate, isAdmin, async (req, res) => {
  const { session_id, instructor_id } = req.body;
  try {
    const session = await Session.findById(session_id);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    
    session.instructor = instructor_id;
    await session.save();
    res.json({ message: 'Instructor assigned to session.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign session instructor.' });
  }
});

// GET /api/admin/student-overview
router.get('/student-overview', authenticate, isAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email student_profile createdAt')
      .populate('student_profile.assigned_instructor', 'name');

    // For each student, get their booking counts and performance data
    const studentData = await Promise.all(students.map(async (student) => {
      const [completedCount, totalBookings] = await Promise.all([
        Booking.countDocuments({ user: student._id, status: 'confirmed' }), // Mocking completed as confirmed for now
        Booking.countDocuments({ user: student._id })
      ]);

      return {
        id: student._id,
        name: student.name,
        email: student.email,
        level: student.student_profile?.skill_level || 'beginner',
        instructor: student.student_profile?.assigned_instructor?.name || 'None',
        sessions_completed: completedCount,
        sessions_remaining: 10, // Mocking remaining based on a hypothetical plan
        attendance_rate: '95%',
        joined_date: student.createdAt
      };
    }));

    res.json(studentData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student overview.' });
  }
});

module.exports = router;
