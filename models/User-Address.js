const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserAddress = sequelize.define('userAddress', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  country: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  state: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  address: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  zipCode: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  fullName: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  phoneNumber: {
    type: Sequelize.INTEGER,
    allowNull: true,
  }
});

module.exports = UserAddress;