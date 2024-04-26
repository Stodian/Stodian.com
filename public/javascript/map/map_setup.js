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
        this.position = position;  // This should be a google.maps.LatLng object
        this.content = content;
        this.div = null;
    }

    onAdd() {
        this.div = document.createElement('div');
        this.div.className = 'overlay-container';
        this.div.innerHTML = this.content;
        const panes = this.getPanes();
        panes.overlayLayer.appendChild(this.div);

        // Stops propagation of clicks from the overlay to the map
        this.div.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    draw() {
        const overlayProjection = this.getProjection();
        const pixelCoords = overlayProjection.fromLatLngToDivPixel(this.position);

        // Position the overlay directly above the circle
        this.div.style.left = (pixelCoords.x - this.div.offsetWidth / 2) + 'px';
        this.div.style.top = (pixelCoords.y - this.div.offsetHeight - 20) + 'px'; // 20 pixels above the circle
    }

    onRemove() {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    }

    startHideTimeout() {
        this.hideTimeout = setTimeout(() => {
            this.setMap(null);
        }, 300);
    }
}

let overlay; // Manage overlay's scope

function handleCircleMouseover(event) {
    const content = `<div style="font-size: 16px;">
        <strong>${business.name}</strong><br/>
        Phone: ${business.formatted_phone_number}<br/>
        <a href="${business.website}" target="_blank">Website</a>
    </div>`;
    if (!overlay || !overlay.getMap()) {
        if (overlay) {
            overlay.setMap(null);
        }
        overlay = new CustomOverlay(event.latLng, content);
        overlay.setMap(map);
    }
}



function handleCircleMouseout() {
    if (overlay) {
        overlay.startHideTimeout();
    }
}

circle.addListener('mouseover', handleCircleMouseover);
circle.addListener('mouseout', handleCircleMouseout);

return circle;

}



function createStaticCircle(location, map) {
  new google.maps.Circle({
    strokeColor: '#007a02',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#00b303',
    fillOpacity: 0.35,
    map: map,
    center: location,
    radius: 100
  });
}


{
  function gradualZoomOut(map, initialZoom) {
    let zoom = initialZoom;
    // Get the map's container element for attaching the DOM event
    const mapDiv = map.getDiv();
    // Create the interval and store its ID to allow for cancellation
    let intervalId = setInterval(() => {
        if (zoom > 14) {
            zoom -= 0.07;
            map.setZoom(zoom);
        } else {
            clearInterval(intervalId);
        }
    }, 35);

    // Add a 'wheel' event listener directly to the map's container
    mapDiv.addEventListener('wheel', () => {
        console.log("Scroll detected, stopping zoom out");
        clearInterval(intervalId);
        // Optionally remove the event listener if it's no longer needed
        mapDiv.removeEventListener('wheel', this);
    });

    return intervalId; // Return the interval ID for further reference if needed
}

  // Gradual zoom out effect
  gradualZoomOut(map, mapOptions.zoom);
}



function toggleStatsBox(boxId) {
  var box = document.getElementById(boxId);
  if (box.style.display === "none") {
      box.style.display = "block";
  } else {
      box.style.display = "none";
  }
}




function incrementMetric(event) {
  // Get the span element inside the clicked div, which contains the number
  const numberSpan = event.target.querySelector('span');

  // Check if the click was directly on the span, if so, use that
  const targetSpan = event.target.tagName === 'SPAN' ? event.target : numberSpan;

  // Parse the number, increment it, and update the span's text
  let currentValue = parseFloat(targetSpan.textContent);
  targetSpan.textContent = currentValue + 1;
}

// Attach the click event listener to each metric display
document.querySelectorAll('.metric-display').forEach(metric => {
  metric.addEventListener('click', incrementMetric);
});




setupMapListeners(map);






