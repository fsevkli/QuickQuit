console.log('Content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
console.log('Content script received message:', request);
  
  if (request.action === "getRandomURL") {
    try {
      const randomUrl = getRandomURL(); // This function comes from background.js
      console.log('Generated random URL:', randomUrl);
      sendResponse({ url: randomUrl });
    } catch (error) {
      console.error('Error generating random URL:', error);
      sendResponse({ error: error.message });
    }
  }
  return true; // Keep the message channel open for async response
});