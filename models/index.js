const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your database config file

const db = {};

// Import User model
db.User = require('./User')(sequelize); // Pass the sequelize instance to the User model definition

// Attach Sequelize instance to `db`
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
