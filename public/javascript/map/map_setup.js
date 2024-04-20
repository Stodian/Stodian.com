
function initMap() {
  const location = { lat: 52.433799743652344, lng: -1.9201515913009644 };
  const mapOptions = {
    zoom: 19,
    center: location,
    maxZoom: 20, // set maximum zoom level
    minZoom:4, // set minimum zoom level
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
      },
    
      
      // ... add additional feature types as needed
    ],



    // Disable various UI elements to enhance the 'gamified' look
    disableDefaultUI: true,
    // Optional: depending on the gamified look you want, consider enabling or disabling certain controls
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,

  };


  const map = new google.maps.Map(document.getElementById("map"), mapOptions);




// Fetch the JSON data from your local file
fetch('../../../../output.json')
.then(response => response.json())
.then(data => {
    const circles = [];
    data.forEach(business => {
        const location = new google.maps.LatLng(business.lat, business.lng);

        const circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: location,
            radius: 100 // Radius in meters
        });

        circles.push(circle);
    });





    
  function connectCircles(circles, map) {
    if (circles.length < 1) return; // Ensure there is at least one circle to connect

    // Start the line path from the map's center
    const linePath = [map.getCenter()];

    // Add the center of each circle to the path
    circles.forEach(circle => {
        linePath.push(circle.getCenter());
    });

    // Create a polyline using the line coordinates and map
    const line = new google.maps.Polyline({
        path: linePath,
        geodesic: true,
        strokeColor: '#006499', // Dark blue color for visibility
        strokeOpacity: 0, // Make the base line invisible
        strokeWeight: 4,
        map: map,
        icons: [{
            icon: {
                path: 'M 0,-1 0,1', // SVG path notation for a simple line
                strokeOpacity: 1.0, // Fully opaque line segments
                scale: 4 // Scale of the icon to adjust the appearance of dashes
            },
            offset: '0',
            repeat: '15px' // Distance between each segment of the dashed line
        }]
    });
}
    


    // Connect the circles after they are created
    connectCircles(circles, map);
})


.catch(error => console.error('Error fetching data:', error));






      // Load the GeoJSON file directly from the local path
map.data.loadGeoJson('Counties_and_Unitary_Authorities_December_2021_UK_BUC_2022_1631144631117414121.geojson');

      // Define a style for the GeoJSON features.
map.data.setStyle({
fillColor: 'blue',
strokeWeight: 1
});


    // Create a circle overlay instead of a marker
const circle = new google.maps.Circle({
strokeColor: '#FF0000', // The color of the circle's border
strokeOpacity: 0.8, // The opacity of the circle's border
strokeWeight: 2, // The thickness of the circle's border
fillColor: '#FF0000', // The color of the circle's fill
fillOpacity: 0.35, // The opacity of the circle's fill
map: map, // The map to place the circle on
center: location, // The position of the center of the circle
radius: 100 // The radius of the circle in meters
});


// Fetch the JSON data from your local file
fetch('../../../../output.json')
.then(response => response.json())
.then(data => {
  const circles = [];
  data.forEach(business => {
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

    circles.push(circle);
  });

connectCircles(circles, map); // Connect the circles after they are created
})
.catch(error => console.error('Error fetching data:', error));



let zoom = mapOptions.zoom;
const interval = setInterval(() => {
zoom -= 0.07; // Adjust the decrement rate for the desired animation speed
map.setZoom(zoom);
if (zoom <=14) {
  clearInterval(interval);
}
}, 70); // Adjust the interval for smoother or faster animation

}




