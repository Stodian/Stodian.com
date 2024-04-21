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



  const infoWindow = new google.maps.InfoWindow();
  infoWindow.setContent(`
    <div style="font-size: 16px;">
      <strong>${business.name}</strong><br/>
      Phone: ${business.formatted_phone_number}<br/>
      <a href="#" onclick="openWebsiteInModal('${business.website}'); return false;">Website</a>
    </div>
  `);

  

    
  class CustomOverlay extends google.maps.OverlayView {
    constructor(position, content) {
        super();
        this.position = position;
        this.content = content;
        this.div = null;
    }

    onAdd() {
        this.div = document.createElement('div');
        this.div.className = 'overlay-container';
        this.div.style.position = 'absolute';
        this.div.style.background = "white";
        this.div.style.border = "1px solid black";
        this.div.style.padding = "10px";
        this.div.innerHTML = this.content;
        const panes = this.getPanes();
        panes.overlayLayer.appendChild(this.div);

        // Ensure the overlay stays when hovered over
        this.div.addEventListener('mouseover', (event) => {
          event.stopPropagation();
          // Keep visible while hovered
          clearTimeout(this.hideTimeout);
        });
        
        this.div.addEventListener('mouseout', (event) => {
          event.stopPropagation();
          // Hide after mouseout with delay
          this.hideTimeout = setTimeout(() => {
              this.setMap(null);
          }, 300); // short delay before hiding
        });
        
        this.div.addEventListener('click', (event) => {
          event.stopPropagation(); // Important to allow click events on links
        });
    }

    draw() {
        const overlayProjection = this.getProjection();
        const position = overlayProjection.fromLatLngToDivPixel(this.position);
        this.div.style.left = position.x + 'px';
        this.div.style.top = position.y + 'px';
    }

    onRemove() {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    }
}

let overlay; // Declare overlay variable outside to manage its scope

circle.addListener('mouseover', () => {
    const content = `
        <div style="font-size: 16px;">
            <strong>${business.name}</strong><br/>
            Phone: ${business.formatted_phone_number}<br/>
            <a href="#" onclick="openWebsiteInModal('${business.website}'); return false;">Website</a>
        </div>
    `;
    if (!overlay) {
        overlay = new CustomOverlay(circle.getCenter(), content);
        overlay.setMap(map);
    } else {
        overlay.div.innerHTML = content; // Update content if overlay already exists
    }
    // Prevent overlay from disappearing when mouse is over the circle
    clearTimeout(overlay.hideTimeout);
});

circle.addListener('mouseout', () => {
    // Start the process to hide the overlay, but allow cancellation if quickly hovered again
    overlay.hideTimeout = setTimeout(() => {
        if (overlay && !overlay.div.matches(':hover')) {
            overlay.setMap(null); // Remove the overlay from the map if not hovered
            overlay = null;
        }
    }, 1000); // short delay before hiding
});

return circle;
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



