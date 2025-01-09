// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background script received message:", request);
  
    if (request.action === "deleteHistory") {
      handleHistoryDeletion(request.domain)
        .then(() => sendResponse({ success: true }))
        .catch(error => {
          console.error("History deletion error:", error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep the message channel open for async response
    }
  
    if (request.action === "replaceTabs") {
      handleTabReplacement(request.domain)
        .then(() => sendResponse({ success: true }))
        .catch(error => {
          console.error("Tab replacement error:", error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep the message channel open for async response
    }
  });
  
  // Handle history deletion
  async function handleHistoryDeletion(domain) {
    console.log("Starting history deletion for domain:", domain);
    const results = await chrome.history.search({
      text: domain,
      maxResults: 1000
    });
  
    console.log(`Found ${results.length} history entries for domain:`, domain);
  
    for (const item of results) {
      try {
        if (new URL(item.url).hostname === domain) {
          await chrome.history.deleteUrl({ url: item.url });
          console.log("Deleted history entry:", item.url);
        }
      } catch (error) {
        console.error("Error processing URL:", item.url, error);
      }
    }
  }
  
  // Handle tab replacement
  async function handleTabReplacement(domain) {
    console.log("Starting tab replacement for domain:", domain);
    const tabs = await chrome.tabs.query({ currentWindow: true });
    
    for (const tab of tabs) {
      try {
        if (new URL(tab.url).hostname === domain) {
          // Get random URL from content script
          const response = await chrome.tabs.sendMessage(tab.id, { action: "getRandomURL" });
          if (response && response.url) {
            await chrome.tabs.update(tab.id, { url: response.url });
            console.log("Updated tab to:", response.url);
          }
        }
      } catch (error) {
        console.error("Error processing tab:", tab.id, error);
      }
    }
  }