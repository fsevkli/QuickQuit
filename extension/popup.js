document.addEventListener("DOMContentLoaded", function () {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const programsTerminated = getRandomInt(3, 10);
    const memorySaved = programsTerminated * getRandomInt(25, 40);

    document.getElementById('programsTerminated').innerText = programsTerminated;
    document.getElementById('memorySaved').innerText = memorySaved;

    document.getElementById('actionButton').addEventListener('click', function () {
        // Potential addition of functionality
    });
});