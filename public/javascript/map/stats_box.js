document.querySelector('.game-icon').addEventListener('mouseover', function() {
    document.querySelector('.stats-box').style.display = 'block';
});

document.querySelector('.game-icon').addEventListener('mouseout', function() {
    document.querySelector('.stats-box').style.display = 'none';
});