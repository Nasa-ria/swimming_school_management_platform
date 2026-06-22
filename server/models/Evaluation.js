const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F'], required: true },
  performance_score: { type: Number, min: 0, max: 100 },
  feedback: String,
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);
