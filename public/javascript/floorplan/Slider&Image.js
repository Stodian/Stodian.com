function updateImageProcessing() {
    const brightnessValue = document.getElementById('brightness-slider').value;
    const contrastValue = document.getElementById('contrast-slider').value;
    const sharpnessValue = document.getElementById('sharpness-slider').value;
    // Get other values as needed

    // This is the data you'll send to your backend
    const processingData = {
        brightness: brightnessValue,
        contrast: contrastValue,
        // Include other parameters as needed
    };

    fetch('/process-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(processingData)
    })
    .then(response => response.blob())
    .then(blob => {
        const outputImage = document.getElementById('output-image');
        outputImage.src = URL.createObjectURL(blob);
        outputImage.style.display = 'block';
    })
    .catch(error => console.error('Error:', error));
}

// Add event listeners to your sliders that will call the updateImageProcessing function when changed
document.getElementById('brightness-slider').addEventListener('input', updateImageProcessing);
document.getElementById('contrast-slider').addEventListener('input', updateImageProcessing);
// Attach to other sliders similarly