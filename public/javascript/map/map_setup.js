// Define the initMap function outside of other functions
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





  // Fetch business data and create circles
  fetch('../../../../output.json')
      .then(response => response.json())
      .then(data => {
          const circles = data.map(business => createBusinessCircle(business, map));
          // Connect the circles
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

  return circle;
}





// Function to create a static circle overlay at a fixed location
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

    // Add click event listener to the circle
    circle.addListener('click', () => {
        // Open the website associated with the business in a modal
        openWebsiteInModal(business.website);
    });

    // Check if modal is open when the circle is clicked
    circle.addListener('click', () => {
        const modal = document.getElementById('yourModalId'); // Replace 'yourModalId' with the actual ID of your modal element
        if (modal.style.display === 'block') {
            // If modal is displayed, change circle color to pink
            circle.setOptions({
                strokeColor: '#FF69B4',
                fillColor: '#FF69B4'
            });
        }
    });
    

    // Function to style the pathway effect
function styleSalesPathway() {
    const salesSteps = document.getElementById('salesSteps').getElementsByTagName('li');
    let completedSteps = 0;
  
    for (let i = 0; i < salesSteps.length; i++) {
      const checkbox = salesSteps[i].querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
        completedSteps++;
        salesSteps[i].classList.add('completed');
      } else {
        salesSteps[i].classList.remove('completed');
        if (completedSteps === i) {
          salesSteps[i].classList.add('active');
          break;
        }
      }
    }
  }
  
  // Event listener for checkbox changes
  const checkboxes = document.querySelectorAll('.sales-process input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      styleSalesPathway();
    });
  });
  
  // Initial styling on page load
  styleSalesPathway();
  

    return circle;
}



// Function to perform a gradual zoom out effect
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





// Call the initMap function when the Google Maps API is loaded
window.initMap = initMap;



