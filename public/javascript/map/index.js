const connection = require('./db');

connection.query('SELECT * FROM your_table', (err, rows, fields) => {
  if (err) throw err;
  console.log('Data received from MySQL database:', rows);
});