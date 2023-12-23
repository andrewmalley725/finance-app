require('dotenv').config();

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'localhost',
      port : 3306,
      user : 'root',
      password : process.env.DB_PASS,
      database : 'finance_app'
    }
});

module.exports = knex;