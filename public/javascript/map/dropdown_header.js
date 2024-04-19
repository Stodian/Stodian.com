// script.js
document.addEventListener('mousemove', function(e) {
    const header = document.getElementById('main-header');
    if (e.clientY < 50) {  // Adjust this value if needed
        header.style.top = '0';
    } else {
        header.style.top = '-100px';  // Adjust to match the negative top value in CSS
    }
});
