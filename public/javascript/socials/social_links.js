document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.social-links a');
    const transitionTime = 5; // Time to slide back in seconds
    const proximityThreshold = 100; // Pixels

    // Function to move an icon to a random position within viewport bounds
    const teleportIcon = (icon) => {
        const randomX = Math.random() * (window.innerWidth - icon.offsetWidth);
        const randomY = Math.random() * (window.innerHeight - icon.offsetHeight);
        icon.style.transition = 'none'; // Disable transition for teleportation
        icon.style.left = `${randomX}px`;
        icon.style.top = `${randomY}px`;

        // Schedule return to original position
        setTimeout(() => {
            icon.style.transition = `all ${transitionTime}s ease`;
            icon.style.left = '';
            icon.style.top = '';
        }, 50); // Short delay before starting the slide back to enable transition
    };

    // Detect cursor proximity and teleport if necessary
    const checkCursorProximity = (event) => {
        icons.forEach(icon => {
            const rect = icon.getBoundingClientRect();
            const iconCenterX = rect.left + rect.width / 2;
            const iconCenterY = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(iconCenterX - event.clientX, 2) + Math.pow(iconCenterY - event.clientY, 2));

            if (distance < proximityThreshold) {
                teleportIcon(icon);
            }
        });
    };

    // Initial setup for icons
    icons.forEach(icon => {
        icon.style.position = 'fixed'; // Use fixed positioning for control
        // Record original positions by CSS class or inline style
        icon.dataset.originalLeft = icon.style.left;
        icon.dataset.originalTop = icon.style.top;
    });

    document.addEventListener('mousemove', checkCursorProximity);
});
