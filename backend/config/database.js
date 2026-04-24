// Database configuration using Sequelize ORM with PostgreSQL
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance using DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // disable SQL query logging in all environments
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(' PostgreSQL connected successfully');
    // Sync models without logging the ALTER TABLE statements
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database models synced');
  } catch (error) {
    console.error(' Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };