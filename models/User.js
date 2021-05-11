const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  name: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true,
  },

  email: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true,
  },

  password: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
});

module.exports = User;
