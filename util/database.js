const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('petshop', 'root', 'zvenkolucian2001', { dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;