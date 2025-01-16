document.addEventListener("DOMContentLoaded", function () {
    // Function to generate a random integer between min and max (inclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate random values for programs terminated and memory saved
    const programsTerminated = getRandomInt(4, 9);
    const memorySaved = programsTerminated * getRandomInt(55, 85);

    // Set the values to the DOM elements (using native JavaScript)
    const programsTerminatedElement = document.getElementById('programsTerminated');
    const memorySavedElement = document.getElementById('memorySaved');

    if (programsTerminatedElement && memorySavedElement) {
        programsTerminatedElement.innerText = programsTerminated;
        memorySavedElement.innerText = memorySaved;
    } else {
        console.error('Elements not found in the DOM');
    }

});

document.getElementById("request-permissions").addEventListener("click", () => {
    chrome.permissions.request(
      { permissions: ["history"] },
      (granted) => {
        if (granted) {
          console.log("History permission granted.");
          // Proceed with functionality
        } else {
          console.log("History permission denied. Extension cannot function.");
          alert("This extension requires access to browser history to work.");
        }
      }
    );
  });
  