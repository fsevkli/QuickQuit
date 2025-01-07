// Creates a new button element.
/*const button = document.createElement('button');
// Sets the text content of the button to 'Replace URL'.
button.textContent = 'Replace URL';
// Add an event listener to the button for the 'click' event.
button.addEventListener('click', () => {
  // When the button is clicked, gets the current URL of the tab.
  const currentURL = window.location.href;
  // Define the new URL to replace the current URL. 
  const newURL = 'https://youtube.com'; // Replace with the desired URL

  // Sends a message to background.js of the Chrome extension.
  // The message contains the action 'replaceURL', currentURL, and newURL.
  chrome.runtime.sendMessage({
    action: 'replaceURL',
    currentURL,
    newURL
  });
});

// Appends the button to the body of the HTML document.
document.body.appendChild(button); */

button.addEventListener('click', () => {
  const currentURL = window.location.href;
  const newURL = 'https://youtube.com';
  chrome.runtime.sendMessage({
    action: 'replaceURL',
    currentURL,
    newURL
  });
  chrome.runtime.sendMessage({
    action: 'urlReplacementInitiated',
    currentURL,
    newURL
  });
});

