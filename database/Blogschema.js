const mongoose = require('mongoose');

const { Schema } = mongoose;

const authorSchema = new Schema({
    name: {
        type: String,
        required: true,
        description: "Author full name"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^.+@.+\..+$/,
        description: "Unique email"
    },
    role: {
        type: String,
        enum: ["admin", "editor", "contributor", "guest"],
        description: "Role"
    },
    bio: String,
    avatarUrl: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Author', authorSchema);
