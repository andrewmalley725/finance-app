require('dotenv').config();
// const knex = require('knex');
// const config = require('../../knexfile');

// const db = knex(config.development);

// module.exports = db;

const connections = {
  prod:  {
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
}


function getConnection(){
  //const env = process.env.NODE_ENV;
  return connections.prod;
}
 

const knex = require('knex')(getConnection());


module.exports = knex;