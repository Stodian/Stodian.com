const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', // or your MySQL server IP
  user: 'root', // or your MySQL username
  password: 'Titlwath28!', // or your MySQL password
  database: 'mymapdatabase', // or your MySQL database name
  port: 3306 // or your MySQL server port
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL Server:', err.stack);
    return;
  }

  console.log('Connected to MySQL Server.');
});