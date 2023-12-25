require('dotenv').config();

  const connection = {
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      port : 3306,
      user : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : 'finance-app',
      ssl: {"rejectUnauthorized":false}
    }
  }
 

const knex = require('knex')(connection);

module.exports = knex;