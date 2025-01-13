function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const programsTerminated = getRandomInt(3, 10);
const memorySaved = programsTerminated * getRandomInt(25, 40);

document.getElementById('programsTerminated').innerText = programsTerminated;
document.getElementById('memorySaved').innerText = memorySaved;

// If you want to handle the button click:
document.getElementById('actionButton').addEventListener('click', function() {
    console.log("Button clicked!");
    // You can put additional functionality here to handle the button click
});
