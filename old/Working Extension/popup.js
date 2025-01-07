// Name: Ashna Patgaonkar
// Senior Capstone Project

// Add an event listener that listens for the DOMContentLoaded event, which fires when the initial HTML document has been completely loaded and parsed.
document.addEventListener("DOMContentLoaded", function() {
  // Get the button element with the id "replaceButton".
  var replaceButton = document.getElementById("replaceButton");

  // Add an event listener to the replaceButton element for the "click" event.
  replaceButton.addEventListener("click", function() {
    // Query the active tab in the current window using the chrome.tabs API.
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Retrieve the URL of the active tab from the tabs array.
      var currentURL = tabs[0].url;
      // Define the new URL to replace the current URL.
      var newURL = "https://www.youtube.com/";

      // Send a message to the background script of the Chrome extension using the chrome.runtime API.
      // The message contains the action "replaceURL", currentURL, and newURL.
      // Also, provide a callback function to handle the response from the background script.
      chrome.runtime.sendMessage({
        action: "replaceURL",
        currentURL: currentURL,
        newURL: newURL
      }, function(response) {
        // Log the response message received from the background script to the console.
        console.log(response.message);
      });
    });
  });
});
