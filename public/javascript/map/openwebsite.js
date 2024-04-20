function openWebsiteInModal(url) {
    const iframe = document.getElementById('websiteIframe');
    const modal = document.getElementById('websiteModal');
    if (url) {
      iframe.src = url;  // Set the source of the iframe to the website URL
  
      // Show the modal when the url parameter is not empty
      modal.classList.remove('hidden');
      $('#websiteModal').modal('show');
  
      // Hide the modal when the hidden.bs.modal event is triggered
      $('#websiteModal').on('hidden.bs.modal', function (e) {
        modal.classList.add('hidden');
      });
  
      // Hide the modal when a click event is triggered outside of the modal element
      $(document).on('click', function(e) {
        if ($(e.target).is('#websiteModal') === false) {
          modal.classList.add('hidden');
          $('#websiteModal').modal('hide');
        }
      });
    } else {
      console.log('No URL provided');
    }
  }