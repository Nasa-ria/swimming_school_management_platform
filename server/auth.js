const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { generateToken, verifyToken } = require('./jwtToken');
const bcrypt = require('bcrypt');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
const authRoutes = require('./auth');
const db = require('./db'); 
const bcrypt = require('bcrypt');
app.use('/api/auth', authRoutes);

// Login endpoint   
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    // Placeholder logic for authentication
    db.getUserByUsername(username, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        bcrypt.compare(password, user.passwordHash, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            res.json({
                message: 'Login successful',
                token: generateToken({ username })
            });
        });
    });
});

// Signup endpoint
app.post('/api/auth/signup', (req, res) => {
    const { fullName, email, password, phone, token } = req.body;

    // Verify token if provided
    let decoded = null;
    if (token) {
        decoded = verifyToken(token);
        if (decoded) {
            console.log("Token is valid");
        } else {
            console.log("Token is invalid");
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    // Placeholder logic for user registration
    if (email && password && fullName && phone) {
        res.json({
            message: 'Registration successful',
            userId: 'newly-created-user-id'
        });
    } else {
        res.status(400).json({
            message: 'Missing required fields'
        });
    }
});

module.exports = app;
