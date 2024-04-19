function loadImage(event) {
    const input = event.target;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      const img = document.getElementById('floorplan-image');
      img.src = event.target.result;
      img.onload = function() {
        processImage();
      };
    };

    reader.readAsDataURL(file);
  }

  function processImage() {
    // Load the input image
    const inputImage = cv.imread('floorplan-image');

    // Resize the image
    const resizedImage = new cv.Mat();
    cv.resize(inputImage, resizedImage, new cv.Size(640, 480));

    // Convert the image to grayscale
    const grayImage = new cv.Mat();
    cv.cvtColor(resizedImage, grayImage, cv.COLOR_RGBA2GRAY);

    // Apply Gaussian blur
    const blurredImage = new cv.Mat();
    cv.GaussianBlur(grayImage, blurredImage, new cv.Size(5, 5), 0);

    // Apply thresholding
    const thresholdedImage = new cv.Mat();
    cv.threshold(blurredImage, thresholdedImage, 127, 255, cv.THRESH_BINARY);

    // Apply morphological operations
    const dilatedImage = new cv.Mat();
    const kernel = cv.Mat.ones(3, 3, cv.CV_8U);
    cv.dilate(thresholdedImage, dilatedImage, kernel);

    // Find contours
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(dilatedImage, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    // Draw contours
    const drawing = new cv.Mat();
    cv.drawContours(drawing, contours, -1, new cv.Scalar(0, 255, 0), 2);

    // Display the output image
    cv.imshow('output', drawing);

    // Convert the drawing matrix to a canvas image
    const canvas = document.getElementById('output-image');
    const ctx = canvas.getContext('2d');
    cv.imshow(canvas, drawing);

    // Set the canvas dimensions to match the image
    canvas.width = drawing.cols;
    canvas.height = drawing.rows;

    // Display the canvas
    document.getElementById('output-box').style.display = 'block';

    // Release resources
    inputImage.delete();
    resizedImage.delete();
    grayImage.delete();
    blurredImage.delete();
    thresholdedImage.delete();
    dilatedImage.delete();
    contours.delete();
    hierarchy.delete();
    drawing.delete();
  }