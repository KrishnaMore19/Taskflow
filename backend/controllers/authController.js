// Auth controller - handles user registration and login
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token with user id as payload
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/signup
// Register a new user
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Create new user (password hashed via model beforeCreate hook)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    // Generate JWT for immediate login after signup
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
// Authenticate existing user and return JWT
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email (include password for comparison)
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      // Use generic message to prevent user enumeration attacks
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare provided password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
// Get current authenticated user profile
const getMe = async (req, res) => {
  // req.user is set by protect middleware
  res.status(200).json({
    success: true,
    user: req.user.toJSON ? req.user : req.user
  });
};

module.exports = { signup, login, getMe };
