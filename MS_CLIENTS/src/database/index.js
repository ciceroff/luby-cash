const dbConfig = require('../config/database');
const Sequelize = require('sequelize');
const Client = require('../models/Client');
const connection = new Sequelize(dbConfig);

Client.init(connection);
module.exports = connection;
