// User model - stores registered users with hashed passwords
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true, // adds createdAt and updatedAt
  hooks: {
    // Hash password before saving to database
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
    },
    // Hash password if it was changed during update
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method: compare plain password with hashed password
User.prototype.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Instance method: return user object without password field
User.prototype.toSafeObject = function () {
  const { password, ...safeUser } = this.toJSON();
  return safeUser;
};

module.exports = User;
