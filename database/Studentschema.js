const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9\-\+\s()]{7,20}$/;

const EmergencyContactSchema = new Schema({
    name: { type: String, trim: true },
    phoneNumber: { type: String, trim: true, match: phoneRegex },
    relationship: { type: String, trim: true }
}, { _id: false });

const StudentSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: emailRegex,
        unique: true
    },
    phone: { type: String, required: true, trim: true, match: phoneRegex },
    dateOfBirth: { type: Date },
    enrollmentDate: { type: Date, required: true },
    swimLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Competitive"]
    },
    // sessionId: { type: Schema.Types.ObjectId, ref: 'session' },
    isActive: { type: Boolean, default: true },
    emergencyContact: EmergencyContactSchema
}, {
    timestamps: true // createdAt, updatedAt
});

// ensure unique index on email
StudentSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Student', StudentSchema);
