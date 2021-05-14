const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Review = sequelize.define('review', {
  id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  comment: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Review;