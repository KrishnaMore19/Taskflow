// Task controller - CRUD operations scoped strictly to the authenticated user
const { Op } = require('sequelize');
const Task = require('../models/Task');

// GET /api/tasks/stats
// Returns task counts by status for the logged-in user
const getTaskStats = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    // Use exact DB column name 'user_id' in all WHERE clauses
    const total     = await Task.count({ where: { user_id } });
    const pending   = await Task.count({ where: { user_id, status: 'pending' } });
    const inProgress = await Task.count({ where: { user_id, status: 'in_progress' } });
    const completed = await Task.count({ where: { user_id, status: 'completed' } });

    res.status(200).json({
      success: true,
      stats: { total, pending, inProgress, completed }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks
// Fetch all tasks for the logged-in user with optional filters
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'DESC' } = req.query;

    // Always filter by user_id (exact DB column) for strict user isolation
    const where = { user_id: req.user.id };

    if (status)   where.status = status;
    if (priority) where.priority = priority;
    if (search)   where.title = { [Op.iLike]: `%${search}%` };

    // Map JS sort field names to actual DB column names
    const sortFieldMap = {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      due_date:  'due_date',
      dueDate:   'due_date',  // handle both forms from frontend
      priority:  'priority',
      title:     'title'
    };

    const sortCol   = sortFieldMap[sortBy] || 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const tasks = await Task.findAll({
      where,
      order: [[sortCol, sortOrder]]
    });

    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
// Create a new task for the authenticated user
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      title:       title.trim(),
      description: description?.trim() || '',
      priority:    priority || 'medium',
      due_date:    dueDate  || null,   // use exact DB column name
      user_id:     req.user.id          // use exact DB column name
    });

    res.status(201).json({ success: true, message: 'Task created successfully', task });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
// Get a single task - only if it belongs to the logged-in user
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
// Update task - only if it belongs to the logged-in user
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    await task.update({
      title:       title       !== undefined ? title.trim()       : task.title,
      description: description !== undefined ? description.trim() : task.description,
      status:      status   || task.status,
      priority:    priority || task.priority,
      due_date:    dueDate  !== undefined ? (dueDate || null) : task.due_date
    });

    // Re-fetch to get clean updated object
    await task.reload();

    res.status(200).json({ success: true, message: 'Task updated successfully', task });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/status
// Quick status update only
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'in_progress', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await task.update({ status });

    res.status(200).json({ success: true, message: `Task marked as ${status}`, task });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
// Delete a task - only if it belongs to the logged-in user
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await task.destroy();

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks, getTaskStats, createTask,
  getTask, updateTask, updateTaskStatus, deleteTask
};