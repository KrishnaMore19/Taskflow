// Main server entry point for TaskFlow API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to PostgreSQL database
connectDB();

// CORS - allow only the frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse incoming JSON request bodies
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes); // authentication routes (public)
app.use('/api/tasks', taskRoutes); // task routes (protected)

// Handle unknown routes
app.use(notFound);

// Global error handler (must be last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TaskFlow API running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
