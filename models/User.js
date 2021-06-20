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
  },

  email: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  password: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },

  testUser: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
});

module.exports = User;
