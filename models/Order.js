const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  sent: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },

  processing: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },

  finished: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },

  cancelled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },

  deliveryMethod: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  payMethod: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Order;
