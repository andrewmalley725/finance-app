require('dotenv').config();

const connections = {
  prod: {
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      port : 3306,
      user : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : 'finance-app',
      ssl: {"rejectUnauthorized":false}
    }
  },
  dev: {
    client: 'mysql',
    connection: {
      host : 'localhost',
      port : 3306,
      user : 'root',
      password : process.env.DEV_PASS,
      database : 'finance_app'
    }
  },
}

const knex = require('knex')();

module.exports = knex;