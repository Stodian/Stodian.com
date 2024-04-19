require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');

const query = 'architects';
const location = '52.43391591225873, -1.920106887366209'; // Your desired location
const radius = 1000; // Search within 1km of the specified location
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

async function getPlacesDetails(places) {
  const details = await Promise.all(
    places.map(async (place) => {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.place_id}&fields=name,formatted_phone_number,website,geometry&key=${apiKey}`;
      const response = await fetch(detailsUrl);
      const data = await response.json();
      return {
        name: place.name,
        formatted_phone_number: data.result.formatted_phone_number,
        website: data.result.website,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      };
    })
  );

  fs.writeFile('output.json', JSON.stringify(details, null, 2), (err) => {
    if (err) throw err;
    console.log('The file with detailed places has been saved!');
  });
}

function searchPlaces() {
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${location}&radius=${radius}&key=${apiKey}`;

  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      getPlacesDetails(data.results);
    })
    .catch(error => console.error('Error:', error));
}

searchPlaces();
