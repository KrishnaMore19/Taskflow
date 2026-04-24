// Auth routes - public endpoints for registration and login
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Validation rules for signup
const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Validation rules for login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// POST /api/auth/signup
router.post('/signup', signupValidation, validate, signup);

// POST /api/auth/login
router.post('/login', loginValidation, validate, login);

// GET /api/auth/me - protected route
router.get('/me', protect, getMe);

module.exports = router;
