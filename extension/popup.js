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

// Main button click handler
async function buttonClicked() {
  console.log('Button clicked - starting process');
  
  try {
    // Get active tab domain info (only for tab replacement)
    const domainInfo = await getActiveTabURLDomain();
    console.log('Active domain info:', domainInfo);

    // Delete last 1000 history entries (domain-agnostic)
    await removeHistoryEntries();
    console.log('History deletion completed');

    // Replace tabs with same domain
    await replaceTabsWithSameDomain(domainInfo);
    console.log('Tab replacement completed');

  } catch (e) {
    console.error('Error in button click handler:', e);
  }
}

// Remove last 1000 history entries regardless of domain
async function removeHistoryEntries() {
  try {
    console.log('Starting history removal for last 1000 entries');
    
    // Send message to background script to delete history
    const response = await chrome.runtime.sendMessage({
      action: "deleteHistory"
    });
    
    console.log('History deletion response:', response);
    
    if (!response.success) {
      throw new Error(response.error || 'History deletion failed');
    }
    
  } catch (e) {
    console.error('Error removing history:', e);
    throw e;
  }
}

// Replace tabs with same domain
async function replaceTabsWithSameDomain(domainInfo) {
  try {
    console.log('Starting tab replacement for domain:', domainInfo.domain);
    
    // Send message to background script to replace tabs
    const response = await chrome.runtime.sendMessage({
      action: "replaceTabs",
      domain: domainInfo.domain
    });
    
    console.log('Tab replacement response:', response);
    
    if (!response.success) {
      throw new Error(response.error || 'Tab replacement failed');
    }
    
  } catch (e) {
    console.error('Error replacing tabs:', e);
    throw e;
  }
}

// Event handler setup
function handleButtonClickOrEscape(event) {
  if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Escape')) {
    buttonClicked();
  }
}

// Initialize event listeners
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

// Listen for messages requesting random URL
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getRandomURL") {
    const randomUrl = getRandomURL();
    console.log('Generated random URL:', randomUrl);
    sendResponse({ url: randomUrl });
  }
  return true;
});