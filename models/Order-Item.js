const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },

  totalPrice: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },

  name: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = OrderItem;
