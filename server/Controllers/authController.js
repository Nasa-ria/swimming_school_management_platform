const express = require('express');
const router = express.Router();
const { generateToken, verifyToken } = require('./jwtToken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models/Userschema');
const { Role } = require('../models/Userschema');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email and populate role
        const user = await User.findOne({ email }).populate('role_id');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return token and role
        res.json({
            message: 'Login successful',
            token: generateToken({ id: user._id, email: user.email, role: user.role_id.name }),
            role: user.role_id.name,
            user: {
                id: user._id,
                email: user.email,
                role: user.role_id.name
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Signup endpoint
router.post('/register', async (req, res) => {
    const { fullName, email, password, phone, role } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Find or create role

        let roleDoc = await Role.findOne({ name: role || 'student' });

        if (!roleDoc) {
            // Create default student role if it doesn't exist
            roleDoc = new Role({
                name: role || 'student',
                description: `${role || 'student'} role`
            });
            await roleDoc.save();
        }

        // Split fullName into first and last name
        const nameParts = (fullName || '').trim().split(' ');
        const first_name = nameParts[0] || '';
        const last_name = nameParts.slice(1).join(' ') || '';

        // Create new user
        const newUser = new User({
            email,
            password_hash,
            role_id: roleDoc._id,
            profile: {
                first_name,
                last_name,
                phone
            }
        });

        await newUser.save();

        res.status(201).json({
            message: 'Registration successful',
            userId: newUser._id,
            token: generateToken({ id: newUser._id, email: newUser.email, role: roleDoc.name }),
            role: roleDoc.name,
            user: {
                id: newUser._id,
                email: newUser.email,
                role: roleDoc.name
            }
        });
    } catch (err) {
        console.error('error during registration', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Google Auth
router.post('/google', async (req, res) => {
    const { idToken } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload['email'];

        const user = await User.findOne({ email });

        if (!user) {
            // Create user if not exists (simplified)
            // In real app, might want to ask for more info or generate random password
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }

        res.json({
            message: 'Google authentication successful',
            token: generateToken({ id: user._id, email: user.email, role: user.role }),
            role: user.role
        });
    } catch (error) {
        res.status(401).json({ message: 'Google authentication failed', error: error.message });
    }
});

module.exports = router;
