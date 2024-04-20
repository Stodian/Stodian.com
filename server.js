const express = require('express');
const app = express();
const port = 3306;
const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Send index.html file on accessing root URL
});

app.get('/geojson', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'public/javascript/map/Counties_and_Unitary_Authorities_December_2021_UK_BUC_2022_1631144631117414121.geojson'), { root: __dirname });
});

const cors = require('cors');
app.use(cors());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});