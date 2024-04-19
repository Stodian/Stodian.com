const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  debug: true,
  timeout: 30000, // increase timeout to 30 seconds
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connection.connect()
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    if (err) throw err;
  });