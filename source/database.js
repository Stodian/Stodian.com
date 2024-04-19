const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  debug: true,
  connectTimeout: 30000, // milliseconds
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    // Additional logic to handle the error or retry the connection
    return;
  }
  console.log('Connected to the database!');
  conn.release();
});