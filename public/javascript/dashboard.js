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
    const lines = []; // Array to store drawn lines and their timestamps

    // Adjust canvas dimensions to start below the header
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - headerHeight;
    canvas.style.top = `${headerHeight}px`;

    function drawGrid() {
        const spacing = 20; // Grid spacing
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += spacing) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += spacing) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.strokeStyle = '#ddd'; // Light grey grid lines
        ctx.stroke();
    }

    function drawLine(x1, y1, x2, y2, opacity) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`; // Black line color with opacity
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round'; // Creates rounded corners
        ctx.lineCap = 'round'; // Creates rounded ends of lines
        ctx.stroke();
    }

    function draw(event) {
        const x = event.clientX;
        const y = event.clientY - headerHeight;
        const lastPoint = lines.length > 0 ? lines[lines.length - 1].point : null;
        const currentTime = Date.now();

        if (!lastPoint || lastPoint.x !== x || lastPoint.y !== y) {
            const point = { x, y };
            lines.push({ point, timestamp: currentTime });
            if (lastPoint) {
                const opacity = Math.max(0, 1 - (currentTime - lastPoint.timestamp) / 5000);
                drawLine(lastPoint.x, lastPoint.y, x, y, opacity);
            }
        }
    }

    function updateCanvas() {
        drawGrid();
        const currentTime = Date.now();
        lines.forEach((line, index) => {
            if (index > 0) {
                const prevPoint = lines[index - 1].point;
                const opacity = Math.max(0, 1 - (currentTime - line.timestamp) / 1000);
                drawLine(prevPoint.x, prevPoint.y, line.point.x, line.point.y, opacity);
            }
        });
        lines = lines.filter(line => currentTime - line.timestamp <= 5000); // Clean up old lines
    }

    canvas.addEventListener('mousedown', function(event) {
        draw(event);
        canvas.addEventListener('mousemove', draw);
    });

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', draw);
    });

    setInterval(updateCanvas, 20); // Update canvas more frequently for smoother animation
});



