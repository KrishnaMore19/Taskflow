// Auth middleware - verifies JWT token and attaches user to request
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from token payload (id field)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] } // never expose password hash
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists.'
      });
    }

    // Attach user to request for use in controllers
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    next(error);
  }
};

module.exports = { protect };
