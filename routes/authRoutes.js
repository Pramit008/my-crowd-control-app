const express = require('express');
const { signup, login, getProfile } = require('../controllers/authController');

// const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes

const router = express.Router();

// Route to sign up a new user
router.post('/signup', signup);

// Route to log in an existing user
router.post('/login', login);

// Route to get the user's profile (protected route)
// router.get('/profile', authMiddleware, getProfile);

module.exports = router;
