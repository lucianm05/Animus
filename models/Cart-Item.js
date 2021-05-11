const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },

  image: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  totalPrice: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

module.exports = CartItem;
