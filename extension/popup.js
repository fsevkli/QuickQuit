// Dynamically load randomURLGenerator.js and wait for it to load
var script = document.createElement('script');
script.src = 'randomURLGenerator.js';
document.head.appendChild(script);


// This function extracts the domain from a URL
function extractDomain(url) {
  const urlObject = new URL(url);
  return urlObject.hostname;
}

// This function gets the URL Hostname from the current tab
async function getActiveTabURLDomain() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length === 0) {
        reject("No active tab found");
        return;
      }
      const currentTab = tabs[0];
      const currentUrl = currentTab.url;
      const domain = extractDomain(currentUrl);
      resolve({ currentUrl, domain, tabId: currentTab.id });
    });
  });
}

// Function to remove all instances of a specified domain from the browsing history
async function removeDomainEntriesFromHistory(domainToRemove) {
  chrome.history.search({ text: domainToRemove, maxResults: 1000 }, function (results) {
    results.forEach(function (item) {
      // Check if the URL's hostname includes the domain to remove
      if (new URL(item.url).hostname.includes(domainToRemove)) {
        // Delete the URL that matches the domain of the current URL
        chrome.history.deleteUrl({ url: item.url }, function () {
          console.log(`Deleted URL: ${item.url}`);

          // Generate a random URL to replace the deleted URL
          const replaceUrl = getRandomURL(); // Get a random URL

          // Instead of using chrome.history.addUrl (which doesn't exist), just log the replacement
          console.log(`Replaced with random URL: ${replaceUrl}`);
        });
      }
    });
  });
}

// Replace URLs of all tabs with the same domain as the active tab with random URLs
async function replaceTabsWithSameDomain() {
  try {
    const { domain } = await getActiveTabURLDomain();
    chrome.tabs.query({ currentWindow: true }, function(allTabs) {
      allTabs.forEach(function(tab) {
        const tabDomain = extractDomain(tab.url);
        if (tabDomain === domain) {
          const url = getRandomURL(); // Get a random URL
          chrome.tabs.update(tab.id, { url: url }); // Update the URL of the tab with a random one
          console.log(`Updated tab with ID: ${tab.id} to URL: ${url}`);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

// Triggered when the button is clicked to remove domain entries and replace tabs
async function buttonClicked() {

  //Uses functions to get the domain on the tab you are on and then removes it once the button is clicked
  domainToRemove = await getActiveTabURLDomain();
  removeDomainEntriesFromHistory(domainToRemove);
  replaceTabsWithSameDomain();
}

// Function to handle button click or Escape key press
function handleButtonClickOrEscape(event) {
  if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Escape')) {
    buttonClicked(); // Call the buttonClicked function when the button is clicked or Escape key is pressed
  }
}

// Add event listeners for button click and keydown event
window.addEventListener('DOMContentLoaded', function () {
  const replaceButton = document.getElementById('button');
  replaceButton.addEventListener('click', buttonClicked);
  document.addEventListener('keydown', handleButtonClickOrEscape);
});
