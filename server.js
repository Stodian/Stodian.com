const express = require('express');
const app = express();
const port = 3306;

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Send index.html file on accessing root URL
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/geojson', (req, res) => {
  res.sendFile(path.join(__dirname, 'Counties_and_Unitary_Authorities_December_2021_UK_BUC.geojson'));
});

const cors = require('cors');
app.use(cors());

app.get('/geojson', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile('public\javascript\map\Counties_and_Unitary_Authorities_December_2021_UK_BUC_2022_1631144631117414121.geojson', { root: __dirname });
});