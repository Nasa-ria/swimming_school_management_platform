const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, default: 'group' },
  description: String,
  capacity: { type: Number, default: 10 },
  enrolled: { type: Number, default: 0 },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  price: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'full', 'cancelled'], default: 'available' },
  assignment_status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'accepted' },
  assignment_note: String,
  location: String,
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all'], default: 'all' },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
