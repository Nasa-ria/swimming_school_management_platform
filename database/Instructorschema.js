const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'lifeguard'],
        required: true
    },
    certification: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    availability: [{
        day: String,
        startTime: String,
        endTime: String
    }],
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Instructor', instructorSchema);