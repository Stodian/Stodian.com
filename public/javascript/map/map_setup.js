
function initMap() {
  const location = { lat: 52.433799743652344, lng: -1.9201515913009644 };
  const mapOptions = {
    zoom: 19,
    center: location,
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

  const map = new google.maps.Map(document.getElementById('map'), mapOptions);


      // Load the GeoJSON file directly from the local path
map.data.loadGeoJson('../../Counties_and_Unitary_Authorities_December_2021_UK_BUC_2022_1631144631117414121.geojson');

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

let zoom = mapOptions.zoom;
const interval = setInterval(() => {
zoom -= 0.07; // Adjust the decrement rate for the desired animation speed
map.setZoom(zoom);
if (zoom <=14) {
  clearInterval(interval);
}
}, 70); // Adjust the interval for smoother or faster animation

}
