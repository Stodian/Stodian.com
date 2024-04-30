document.addEventListener('DOMContentLoaded', function () {
    const text = "The Home of Stodian Group";
    const typingSpeed = 150; // milliseconds
    let index = 0;
    const span = document.getElementById('typed-words');

    function typeLetter() {
        if (index < text.length) {
            span.textContent += text.charAt(index);
            index++;
            setTimeout(typeLetter, typingSpeed);
        }
    }

    typeLetter(); // Start typing
});