const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define(
  'product',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: Sequelize.TEXT,
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

    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    animalCategory: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    productType: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

module.exports = Product;
