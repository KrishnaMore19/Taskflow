// Task model - each task belongs to a specific user (multi-user isolation)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: { len: [1, 200], notEmpty: true }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending',
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    allowNull: false
  },
  // Use 'due_date' as both JS name and DB column to avoid mapping confusion
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'due_date'
  },
  // Use 'user_id' as JS name matching the actual DB column
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'tasks',
  timestamps: true
});

// Association using exact column name 'user_id'
Task.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });

module.exports = Task;