require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');
const path = 'output.json';

const query = 'architects';
const location = '52.771317, -1.554997'; // Your desired location
const radius = 500; // Search within 500km of the specified location
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

async function getPlacesDetails(places, existingData) {
  const details = await Promise.all(
    places.map(async (place) => {
      // Check if place is already in the existing data by name
      if (existingData.some(e => e.name === place.name)) {
        return null; // Skip this place since it's already listed
      }
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.place_id}&fields=name,formatted_phone_number,website,geometry&key=${apiKey}`;
      const response = await fetch(detailsUrl);
      const data = await response.json();
      return {
        name: place.name,
        formatted_phone_number: data.result.formatted_phone_number,
        website: data.result.website,
        lat: data.result.geometry.location.lat,
        lng: data.result.geometry.location.lng
      };
    })
  );

  // Filter out null values and append only new places to the file
  const newDetails = details.filter(detail => detail !== null);
  if (newDetails.length > 0) {
    fs.appendFile(path, JSON.stringify(newDetails, null, 2), (err) => {
      if (err) throw err;
      console.log('New detailed places have been added to the file!');
    });
  } else {
    console.log('No new places to add.');
  }
}

function searchPlaces() {
  fs.readFile(path, (err, data) => {
    let existingData = [];
    if (!err) {
      try {
        existingData = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing JSON from file:', e);
      }
    }

    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${location}&radius=${radius}&key=${apiKey}`;
    fetch(searchUrl)
      .then(response => response.json())
      .then(data => {
        getPlacesDetails(data.results, existingData);
      })
      .catch(error => console.error('Error:', error));
  });
}

searchPlaces();
