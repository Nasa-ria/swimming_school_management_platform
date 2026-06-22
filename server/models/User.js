const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentProfileSchema = new mongoose.Schema({
  age: Number,
  skill_level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  medical_info: String,
  emergency_contact: String,
  assigned_instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'student', 'instructor', 'admin'], default: 'user' },
  avatar: String,
  phone: String,
  student_profile: studentProfileSchema,
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    quantity: { type: Number, default: 1 }
  }],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
