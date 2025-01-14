$(document).ready(function() {  // This ensures the DOM is fully loaded
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const programsTerminated = getRandomInt(3, 10);
    const memorySaved = programsTerminated * getRandomInt(25, 40);

    // Ensure the elements exist and are available before accessing them
    if ($('#programsTerminated').length && $('#memorySaved').length) {
        // Set the values to the DOM elements using jQuery
        $('#programsTerminated').text(programsTerminated);
        $('#memorySaved').text(memorySaved);
    } else {
        console.error('Elements not found in the DOM');
    }
});
