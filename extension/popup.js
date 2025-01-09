// Dynamically load randomURLGenerator.js
var script = document.createElement('script');
script.src = 'randomURLGenerator.js';
script.onload = () => console.log('Random URL Generator loaded');
script.onerror = (e) => console.error('Error loading Random URL Generator:', e);
document.head.appendChild(script);

// Extract domain from URL
function extractDomain(url) {
  try {
    const urlObject = new URL(url);
    console.log('Extracted domain:', urlObject.hostname);
    return urlObject.hostname;
  } catch (e) {
    console.error('Invalid URL:', url, e);
    return null;
  }
}

// Get active tab URL domain
async function getActiveTabURLDomain() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('Active tabs found:', tabs);
    
    if (tabs.length === 0) {
      console.error("No active tab found");
      throw new Error("No active tab found");
    }
    
    const currentTab = tabs[0];
    const domain = extractDomain(currentTab.url);
    
    if (!domain) {
      console.error("Invalid URL in active tab");
      throw new Error("Invalid URL in active tab");
    }
    
    console.log('Active tab info:', { url: currentTab.url, domain, tabId: currentTab.id });
    return { currentUrl: currentTab.url, domain, tabId: currentTab.id };
  } catch (e) {
    console.error('Error getting active tab:', e);
    throw e;
  }
}

// Remove domain entries from history
async function removeDomainEntriesFromHistory(domainInfo) {
  try {
    console.log('Starting history removal for domain:', domainInfo.domain);
    
    const results = await chrome.history.search({ 
      text: domainInfo.domain, 
      maxResults: 1000 
    });
    
    console.log('Found history entries:', results.length);

    for (const item of results) {
      const itemDomain = extractDomain(item.url);
      console.log('Checking history item:', { url: item.url, domain: itemDomain });
      
      if (itemDomain === domainInfo.domain) {
        try {
          await chrome.history.deleteUrl({ url: item.url });
          console.log('Successfully deleted URL from history:', item.url);
        } catch (deleteError) {
          console.error('Error deleting URL:', item.url, deleteError);
        }
      }
    }
    
    console.log('History removal completed');
  } catch (e) {
    console.error('Error removing history:', e);
    throw e;
  }
}


// Replace tabs with same domain
async function replaceTabsWithSameDomain(domainInfo) {
  try {
    console.log('Starting tab replacement for domain:', domainInfo.domain);
    
    const allTabs = await chrome.tabs.query({ currentWindow: true });
    console.log('Found total tabs:', allTabs.length);
    
    for (const tab of allTabs) {
      const tabDomain = extractDomain(tab.url);
      console.log('Checking tab:', { id: tab.id, url: tab.url, domain: tabDomain });
      
      if (tabDomain === domainInfo.domain) {
        const newUrl = getRandomURL();
        console.log('Generated new URL for tab:', newUrl);
        
        try {
          await chrome.tabs.update(tab.id, { url: newUrl });
          console.log('Successfully updated tab:', tab.id, 'to:', newUrl);
          
          // Remove old URL from history
          if (tab.url) {
            await chrome.history.deleteUrl({ url: tab.url });
            console.log('Removed old URL from history:', tab.url);
          }
        } catch (updateError) {
          console.error('Error updating tab:', tab.id, updateError);
        }
      }
    }
    
    console.log('Tab replacement completed');
  } catch (e) {
    console.error('Error replacing tabs:', e);
    throw e;
  }
}

// Add this at the start of buttonClicked function
async function buttonClicked() {
  console.log('Button clicked - starting process');
  
  try {
    // Get active tab domain
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs.length) throw new Error("No active tab found");
    
    const domain = new URL(tabs[0].url).hostname;
    console.log('Active domain:', domain);

    // Send message to background script to delete history
    const historyResponse = await chrome.runtime.sendMessage({
      action: "deleteHistory",
      domain: domain
    });
    console.log('History deletion response:', historyResponse);

    // Send message to background script to replace tabs
    const tabResponse = await chrome.runtime.sendMessage({
      action: "replaceTabs",
      domain: domain
    });
    console.log('Tab replacement response:', tabResponse);

  } catch (e) {
    console.error('Error in button click handler:', e);
  }
}

// Event handler setup
function handleButtonClickOrEscape(event) {
  if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Escape')) {
    buttonClicked();
  }
}

// Modify the event listener setup
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - setting up listeners');
  const replaceButton = document.getElementById('button');
  
  if (replaceButton) {
    console.log('Button found - adding event listeners');
    replaceButton.addEventListener('click', handleButtonClickOrEscape);
    document.addEventListener('keydown', handleButtonClickOrEscape);
    console.log('Event listeners added successfully');
  } else {
    console.error('Button element not found');
  }
});

// Listen for messages from background script asking for random URL
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getRandomURL") {
    sendResponse({ url: getRandomURL() });
  }
  return true;
});