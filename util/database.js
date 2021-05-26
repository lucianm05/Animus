const Sequelize = require('sequelize').Sequelize;
const dotenv = require('dotenv').config();

const dbName = process.env.DBNAME;
const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASS;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, { dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;