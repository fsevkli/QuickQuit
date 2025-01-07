// Name: Ashna Patgaonkar
// Senior Capstone Project

// This script runs in the background of the URL Replacer extension
// It listens for messages sent other parts of the extension and content.js

// Register a listener for messages from other parts of the extension and content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the received message's action is "replaceURL".
  if (message.action === "replaceURL") {
    // If the action is "replaceURL", update the URL of the tab corresponding to the sender.
    chrome.tabs.update(sender.tab.id, {url: message.newURL}, () => {
      // After updating the URL, delete the old URL from the Chrome browsing history.
      chrome.history.deleteUrl({url: message.currentURL});
      // Add the new URL to the Chrome browsing history.
      chrome.history.addUrl({url: message.newURL});
    });
  }
});