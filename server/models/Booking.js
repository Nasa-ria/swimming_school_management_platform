const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'confirmed' },
  payment_status: { type: String, enum: ['pending', 'completed', 'refunded'], default: 'pending' },
  attendance: { type: String, enum: ['present', 'absent', 'pending'], default: 'pending' },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
