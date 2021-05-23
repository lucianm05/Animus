const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('petshop', 'root', '05PH04ZVKANIMUS2001', { dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;