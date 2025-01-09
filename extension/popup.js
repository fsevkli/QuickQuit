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
    return urlObject.hostname;
  } catch (e) {
    console.error('Invalid URL:', e);
    return null;
  }
}

// Get active tab URL domain
async function getActiveTabURLDomain() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) throw new Error("No active tab found");
    
    const currentTab = tabs[0];
    const domain = extractDomain(currentTab.url);
    if (!domain) throw new Error("Invalid URL in active tab");
    
    return { currentUrl: currentTab.url, domain, tabId: currentTab.id };
  } catch (e) {
    console.error('Error getting active tab:', e);
    throw e;
  }
}

// Remove domain entries from history
async function removeDomainEntriesFromHistory(domainInfo) {
  try {
    const results = await chrome.history.search({ 
      text: domainInfo.domain, 
      maxResults: 1000 
    });

    const deletePromises = results.map(async (item) => {
      if (extractDomain(item.url) === domainInfo.domain) {
        await chrome.history.deleteUrl({ url: item.url });
        console.log(`Deleted URL: ${item.url}`);
      }
    });

    await Promise.all(deletePromises);
  } catch (e) {
    console.error('Error removing history:', e);
    throw e;
  }
}

// Replace tabs with same domain
async function replaceTabsWithSameDomain(domainInfo) {
  try {
    const allTabs = await chrome.tabs.query({ currentWindow: true });
    
    const updatePromises = allTabs.map(async (tab) => {
      const tabDomain = extractDomain(tab.url);
      if (tabDomain === domainInfo.domain) {
        const newUrl = getRandomURL(); // Make sure this function exists in randomURLGenerator.js
        await chrome.tabs.update(tab.id, { 
          url: newUrl,
          replaceState: true // This forces the URL to replace the current history entry
        });
        console.log(`Updated tab ${tab.id} to ${newUrl}`);
      }
    });

    await Promise.all(updatePromises);
  } catch (e) {
    console.error('Error replacing tabs:', e);
    throw e;
  }
}

// Button click handler
async function buttonClicked() {
  try {
    const domainInfo = await getActiveTabURLDomain();
    await Promise.all([
      removeDomainEntriesFromHistory(domainInfo),
      replaceTabsWithSameDomain(domainInfo)
    ]);
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

// Initialize event listeners
window.addEventListener('DOMContentLoaded', () => {
  const replaceButton = document.getElementById('button');
  if (replaceButton) {
    replaceButton.addEventListener('click', handleButtonClickOrEscape);
    document.addEventListener('keydown', handleButtonClickOrEscape);
  } else {
    console.error('Button element not found');
  }
});
