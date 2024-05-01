document.addEventListener('DOMContentLoaded', function () {
    const messages = ["Mechanical",  "Electrical", "Plumbing", "Fire", "Communications"];
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