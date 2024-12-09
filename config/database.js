const {Sequelize} = require('sequelize');

const sequelize= new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'express-socket-bullmq',
    username: 'postgres',
    password: 'zain13',
    logging: console.log, 
});

module.exports=sequelize;