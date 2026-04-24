// Task routes - all protected, scoped to authenticated user
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTasks, getTaskStats, createTask, getTask,
  updateTask, updateTaskStatus, deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// All task routes require authentication
router.use(protect);

// GET /api/tasks/stats
// IMPORTANT: this must be defined BEFORE /:id route
// otherwise Express matches "stats" as the :id parameter
router.get('/stats', getTaskStats);

// Validation rules for creating a task
const createTaskValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be under 200 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date (YYYY-MM-DD)')
];

// Validation rules for updating a task
const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be under 200 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status must be pending, in_progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high')
];

// GET    /api/tasks          - Get all tasks for current user
// POST   /api/tasks          - Create a new task
router.route('/')
  .get(getTasks)
  .post(createTaskValidation, validate, createTask);

// GET    /api/tasks/:id      - Get a single task
// PUT    /api/tasks/:id      - Update a task
// DELETE /api/tasks/:id      - Delete a task
router.route('/:id')
  .get(getTask)
  .put(updateTaskValidation, validate, updateTask)
  .delete(deleteTask);

// PATCH /api/tasks/:id/status - Quick status update
router.patch('/:id/status', [
  body('status')
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Invalid status value')
], validate, updateTaskStatus);

module.exports = router;