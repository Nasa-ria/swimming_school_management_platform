const authRoutes = require('./auth');
const db = require('./db'); 
app.use('/api/auth', authRoutes);
const { Session, Booking, Member } = require("../database/sessionschema"); 
const mongoose = require("mongoose");


app.get('/api/sessions', async (req, res) => {
    try {
        // Placeholder logic to fetch sessions
        const sampleSessions = [
            { id: 1, title: 'Beginner Swimming Class', description: 'Learn the basics of swimming.', schedule: 'Mondays and Wednesdays at 5 PM' },
            { id: 2, title: 'Advanced Swimming Techniques', description: 'Improve your swimming skills.', schedule: 'Tuesdays and Thursdays at 6 PM' },
        ];
        res.json({
            message: 'Sessions fetched successfully',
            data: sampleSessions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/api/auth/sessions', async (req, res) => {
    try {
        const { title, description, schedule } = req.body;
        // Placeholder logic to create a new session
        const newSession = await db.createSession({ title, description, schedule });
        if (newSession) {
            res.json({
                message: 'Session created successfully',
                sessionId: 'newly-created-session-id'
            });
        } else {
            res.status(400).json({ message: 'Missing required fields' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/auth/sessions/:id', async (req, res) => {
    try {
        const sessionId = req.params.id;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }
        const { title, description, schedule } = req.body;
        // Placeholder logic to update a session
        const updateSession = await db.updateSession(sessionId, { title, description, schedule });
        if (updateSession === true) {
            res.json({
                message: `Session ${sessionId} updated successfully`
            });
        } else {
            res.status(400).json({ message: 'Missing required fields' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.delete('/api/auth/sessions/:id', async (req, res) => {
    try {
        const sessionId = req.params.id;
        // Placeholder logic to delete a session
        await db.deleteSession(sessionId);
        res.json({
            message: `Session ${sessionId} deleted successfully`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/auth/student/sessions/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        // Placeholder logic to fetch sessions for a specific student
        const studentSessions = await db.getSessionsByStudentId(studentId);
        res.json({
            message: `Sessions for student ${studentId} fetched successfully`,
            data: studentSessions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/auth/instructor/sessions/:instructorId', async (req, res) => {
    try {
        const instructorId = req.params.instructorId;
        // Placeholder logic to fetch sessions for a specific instructor
        const instructorSessions = await db.getSessionsByInstructorId(instructorId);
        res.json({
            message: `Sessions for instructor ${instructorId} fetched successfully`,
            data: instructorSessions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/auth/session-left/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        // Placeholder logic to fetch remaining sessions for a specific student
        const sessionsLeft = await db.getRemainingSessionsForStudent(studentId);
        res.json({
            message: `Remaining sessions for student ${studentId} fetched successfully`,
            data: { sessionsLeft }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
// controllers/instructorController.js

const getUpcomingSessions = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const now = new Date();

    const sessions = await Session.aggregate([
      { $match: { instructor: mongoose.Types.ObjectId.isValid(instructorId) ? mongoose.Types.ObjectId(instructorId) : instructorId, start_time: { $gte: now } } },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "session_id",
          as: "bookings"
        }
      },
      {
        $addFields: {
          reserved: { $sum: "$bookings.num_spots" }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          start_time: 1,
          end_time: 1,
          location: 1,
          capacity: 1,
          reserved: 1,
          remaining: { $subtract: ["$capacity", { $ifNull: ["$reserved", 0] }] },
          status: 1
        }
      },
      { $sort: { start_time: 1 } }
    ]);

    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPastSessions = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const now = new Date();

    const sessions = await Session.aggregate([
      { $match: { instructor: mongoose.Types.ObjectId.isValid(instructorId) ? mongoose.Types.ObjectId(instructorId) : instructorId, start_time: { $lt: now } } },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "session_id",
          as: "bookings"
        }
      },
      {
        $addFields: {
          reserved: { $sum: "$bookings.num_spots" },
          checkedIn: {
            $sum: {
              $map: {
                input: "$bookings",
                as: "b",
                in: { $cond: [{ $eq: ["$$b.booking_status", "checked_in"] }, "$$b.num_spots", 0] }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          start_time: 1,
          capacity: 1,
          reserved: 1,
          checkedIn: 1,
          status: 1
        }
      },
      { $sort: { start_time: -1 } }
    ]);

    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSessionBookings = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const bookings = await Booking.find({ session_id: sessionId })
      .populate("member_id", "first_name last_name email")
      .sort({ booked_at: 1 })
      .lean();

    const formatted = bookings.map(b => ({
      booking_id: b._id,
      booking_status: b.booking_status,
      num_spots: b.num_spots,
      booked_at: b.booked_at,
      cancelled_at: b.cancelled_at,
      notes: b.notes,
      member: b.member_id ? {
        id: b.member_id._id,
        first_name: b.member_id.first_name,
        last_name: b.member_id.last_name,
        email: b.member_id.email
      } : null
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = app;