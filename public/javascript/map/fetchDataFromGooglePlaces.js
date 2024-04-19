const fetch = require('node-fetch');

async function fetchArchitectOffices(apiKey) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  const query = 'architect offices in Birmingham UK';
  const url = `${baseUrl}?query=${encodeURIComponent(query)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching data from Google Places API:', error);
    return [];
  }
}

module.exports = fetchArchitectOffices;
