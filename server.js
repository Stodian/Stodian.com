const express = require('express');
const app = express();
const port = 3046;
const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/geojson', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'public', 'javascript', 'map', 'Counties_and_Unitary_Authorities_December_2021_UK_BUC_2022_1631144631117414121.geojson'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});