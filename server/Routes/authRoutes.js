const express = require('express');
const router = express.Router();

// Assuming you have controller functions for login and register
const authController = require('../Controllers/authController');

router.post('/login', (req, res) => {
    // Handle login logic here, e.g., call authController.login
    authController.login(req, res);
});

router.post('/register', (req, res) => {
    // Handle registration logic here, e.g., call authController.register
    authController.register(req, res);
});

module.exports = router;
