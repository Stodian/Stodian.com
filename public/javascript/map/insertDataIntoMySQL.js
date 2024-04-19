const mysql = require('mysql');
const fetchArchitectOffices = require('./fetchDataFromGooglePlaces.js');

const connection = mysql.createConnection({
  host: 'localhost',
  user: '3thanreid',
  password: 'Titlwath28!',
  database: 'mymapdatabase'
});

async function insertData() {
  const apiKey = 'AIzaSyD6tAduWuL-vyr_Z5c-LsRGZYXfZIUNmcI';
  const architectOffices = await fetchArchitectOffices(apiKey);

  if (architectOffices.length === 0) {
    console.log('No architect offices found.');
    return;
  }

  connection.connect();

  architectOffices.forEach(office => {
    const { name, formatted_phone_number, website, geometry } = office;
    const { lat, lng } = geometry.location;

    const sql = `INSERT INTO architect_offices (name, phone_number, website, latitude, longitude) VALUES (?, ?, ?, ?, ?)`;
    const values = [name, formatted_phone_number, website, lat, lng];

    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error inserting data into MySQL:', error);
      } else {
        console.log(`Inserted office: ${name}`);
      }
    });
  });

  connection.end();
}

insertData();
