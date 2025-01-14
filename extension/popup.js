document.addEventListener("DOMContentLoaded", function () {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const programsTerminated = getRandomInt(3, 10);
    const memorySaved = programsTerminated * getRandomInt(25, 40);

    // Set the values to the DOM elements
    document.getElementById('programsTerminated').innerText = programsTerminated;
    document.getElementById('memorySaved').innerText = memorySaved;

    // No need for event listener for actionButton if it doesn't exist
});
