$(document).ready(function () { // This is the jQuery equivalent of "DOMContentLoaded"
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const programsTerminated = getRandomInt(3, 10);
    const memorySaved = programsTerminated * getRandomInt(25, 40);

    // Set the values to the DOM elements using jQuery
    $('#programsTerminated').text(programsTerminated);
    $('#memorySaved').text(memorySaved);

    // If you need to add any event listeners, you can use jQuery's .on() method here
});
