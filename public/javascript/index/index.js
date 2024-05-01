document.addEventListener('DOMContentLoaded', function () {
    const messages = ["Residential",  "Commercial", "Industrial", "Educational", "Public"];
    const typingSpeed = 150; // milliseconds
    const deletingSpeed = 75; // milliseconds
    let currentMessage = 0;
    let charIndex = 0;
    const span = document.getElementById('dynamic');  // Adjusted to target the new dynamic span

    function typeLetter() {
        if (charIndex < messages[currentMessage].length) {
            span.textContent += messages[currentMessage].charAt(charIndex);
            charIndex++;
            setTimeout(typeLetter, typingSpeed);
        } else {
            setTimeout(deleteText, 2000); // Wait before starting to delete
        }
    }

    function deleteText() {
        if (charIndex > 0) {
            span.textContent = messages[currentMessage].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(deleteText, deletingSpeed);
        } else {
            currentMessage = (currentMessage + 1) % messages.length; // Move to the next message
            setTimeout(typeLetter, 500); // Wait before starting to type next message
        }
    }

    typeLetter(); // Start typing the first message
});






document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('cadCanvas');
    const ctx = canvas.getContext('2d');
    const headerHeight = 50; // Height of the header

    // Adjust canvas dimensions to start below the header
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - headerHeight;
    canvas.style.top = `${headerHeight}px`;

    function drawGrid() {
        const spacing = 20; // Grid spacing
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        ctx.beginPath();
        // Draw vertical lines
        for (let x = 0; x <= canvas.width; x += spacing) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        // Draw horizontal lines
        for (let y = 0; y <= canvas.height; y += spacing) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.strokeStyle = '#ddd'; // Light grey grid lines
        ctx.stroke();
    }

    function updateCanvas() {
        drawGrid();
        // Additional interactive features can be added here
    }

    setInterval(updateCanvas, 50); // Update canvas every 50 milliseconds
});


