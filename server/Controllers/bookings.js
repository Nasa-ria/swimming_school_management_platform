const authRoutes = require('../auth');

const { Session, Booking, Member } = require("../models/database/Sessionschema");
const mongoose = require("mongoose");
app.use('/api/auth', authRoutes);



app.patch("/bookings/:bookingId/checkin", async (req, res) => {
    try {
        const { bookingId } = req.params;
        const b = await Booking.findByIdAndUpdate(
            bookingId,
            { booking_status: "checked_in", checked_in_at: new Date() },
            { new: true }
        );
        if (!b) return res.status(404).json({ message: "Booking not found" });
        res.json(b);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.patch("/bookings/:bookingId/no-show", async (req, res) => {
    try {
        const { bookingId } = req.params;
        const b = await Booking.findByIdAndUpdate(
            bookingId,
            { booking_status: "no_show" },
            { new: true }
        );
        if (!b) return res.status(404).json({ message: "Booking not found" });
        res.json(b);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.patch("/bookings/:bookingId/cancel", async (req, res) => {
    try {
        const { bookingId } = req.params;
        const b = await Booking.findByIdAndUpdate(
            bookingId,
            { booking_status: "cancelled", cancelled_at: new Date() },
            { new: true }
        );
        if (!b) return res.status(404).json({ message: "Booking not found" });
        res.json(b);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = app;