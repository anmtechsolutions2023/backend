const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config.js')

const mysqlConnection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.Port,
  waitForConnections: true, // Ensures that the pool waits for a connection to be available before throwing an error.
  connectionLimit: 10, // Sets the maximum number of connections to create at once
  queueLimit: 0, // Sets the maximum number of connection requests the pool will queue before returning an error.
})

module.exports = mysqlConnection
