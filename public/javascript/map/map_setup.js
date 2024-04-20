function initMap() {
  const location = { lat: 52.433799743652344, lng: -1.9201515913009644 };
  const mapOptions = {
    zoom: 19,
    center: location,
    maxZoom: 20,
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
  // Load the GeoJSON data from a web server
  map.data.loadGeoJson('http://localhost:3306/path/to/your/Transformed_Counties_and_Unitary_Authorities_December_2021_UK_BUC.geojson');

  // Style the features
  map.data.setStyle({
    fillColor: 'blue',
    strokeWeight: 1,
    zIndex: 1000
  });
}


window.initMap = initMap;



  // Fetch business data and create circles
  fetch('../../../../output.json')
    .then(response => response.json())
    .then(data => {
      const circles = data.map(business => createBusinessCircle(business, map));
      connectCircles(circles, map);
    })
    .catch(error => console.error('Error fetching data:', error));

  // Create a static circle overlay at a fixed location
  createStaticCircle(location, map);

  // Gradual zoom out effect
  gradualZoomOut(map, mapOptions.zoom);
}

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
    radius: 100
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `<div style="font-size: 16px;"><strong>${business.name}</strong><br/>
              Phone: ${business.phone}<br/>
              <a href="${business.website}" target="_blank">Website</a></div>`
  });

  circle.addListener('mouseover', () => {
    infoWindow.setPosition(circle.getCenter());
    infoWindow.open(map);
  });

  circle.addListener('mouseout', () => {
    infoWindow.close();
  });

  return circle;
}

function connectCircles(circles, map) {
  if (circles.length < 1) return;

  const linePath = [map.getCenter(), ...circles.map(circle => circle.getCenter())];

  const line = new google.maps.Polyline({
    path: linePath,
    geodesic: true,
    strokeColor: '#006499',
    strokeOpacity: 0,
    strokeWeight: 4,
    map: map,
    icons: [{
      icon: {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1.0,
        scale: 4
      },
      offset: '0',
      repeat: '15px'
    }]
  });
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
