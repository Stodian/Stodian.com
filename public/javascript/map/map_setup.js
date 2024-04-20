function initMap() {
  const location = { lat: 52.433799743652344, lng: -1.9201515913009644 };
  const mapOptions = {
    zoom: 19,
    center: location,
    minZoom: 4,
    disableDefaultUI: true,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
      { elementType: 'labels', stylers: [{ visibility: 'off' }] },
      { elementType: 'geometry.stroke', stylers: [{ color: '#000000' }] },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#999999' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#666666' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#C9C9C9' }]
      }
    ],
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);


  {
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  map.data.loadGeoJson(
    "https://storage.googleapis.com/mapsdevsite/json/google.json",
  );
}


{
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  map.data.loadGeoJson(
    "http://localhost:8080/geojson",
  );
}


window.initMap = initMap;



  // Fetch business data and create circles
  fetch('../../../../output.json')
    .then(response => response.json())
    .then(data => {
      const circles = data.map(business => createBusinessCircle(business, map));
      connectCircles(circles, map);
      // Wait for all circles to be created and added to the map
      setTimeout(() => {
        drawShortestPath(circles, map);
      }, 1000);
    })
    .catch(error => console.error('Error fetching data:', error));

  // Create a static circle overlay at a fixed location
  createStaticCircle(location, map);

  // Gradual zoom out effect
  gradualZoomOut(map, mapOptions.zoom);
}

// Function to create and return a Google Maps Circle with an attached InfoWindow
function createBusinessCircle(business, map) {
  const location = new google.maps.LatLng(business.lat, business.lng);
  const circle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    center: location,
    radius: 100  // Adjust the radius based on your needs
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `<div style="font-size: 16px;"><strong>${business.name}</strong><br/>
              Phone: ${business.formatted_phone_number}<br/>
              <a href="${business.website}" target="_blank">Website</a></div>`
  });

  const template = document.createElement('div');
  template.innerHTML = `
    <div class="info-window">
      <div class="info-window-content">
        <h2 class="info-window-title">${business.name}</h2>
        <p class="info-window-phone">Call us: <a href="tel:${business.phone}">${business.phone}</a></p>
        <p class="info-window-website"><a href="${business.website}" target="_blank">Visit our website</a></p>
      </div>
    </div>
  `;


circle.addListener('mouseover', () => {
  infoWindow.setPosition(circle.getCenter());
  infoWindow.open(map);
});

circle.addListener('mouseout', () => {
  infoWindow.close();
});

return circle;
}

// Function to fetch data from a GeoJSON file and create circles
function loadAndDisplayCircles(map) {
  fetch('URL_TO_YOUR_GEOJSON_FILE')  // Replace this with the actual URL
    .then(response => response.json())
    .then(data => {
      const circles = data.features.map(feature => {
        const business = {
          lat: feature.geometry.coordinates[1],  // Assuming [longitude, latitude] order
          lng: feature.geometry.coordinates[0],
          name: feature.properties.name,
          formatted_phone_number: feature.properties.formatted_phone_number, // Using the formatted_phone_number property
          website: feature.properties.website
        };
        return createBusinessCircle(business, map);
      });
      connectCircles(circles, map);
    })
    .catch(error => console.error('Error loading the GeoJSON data: ', error));
}



function createStaticCircle(location, map) {
  new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    center: location,
    radius: 100
  });
}





function gradualZoomOut(map, initialZoom) {
  let zoom = initialZoom;
  const interval = setInterval(() => {
    zoom -= 0.07;
    map.setZoom(zoom);
    if (zoom <= 14) {
      clearInterval(interval);
    }
  }, 70);
}



