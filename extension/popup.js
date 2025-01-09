// This function dynamically loads the random URL generator script
function loadRandomURLGenerator() {
  return new Promise((resolve, reject) => {
    var script = document.createElement('script');
    script.src = 'randomURLGenerator.js';
    script.onload = () => {
      console.log("randomURLGenerator.js script loaded successfully");
      resolve();  // Resolve once the script has loaded
    };
    script.onerror = (error) => {
      console.error("Failed to load randomURLGenerator.js", error);
      reject("Script loading failed");
    };
    document.head.appendChild(script);
  });
}

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
      const currentUrl = tabs[0].url;
      const domain = extractDomain(currentUrl);
      resolve(domain);
    });
  });
}

// Function to remove all instances of a specified domain from the browsing history
async function removeDomainEntriesFromHistory(domainToRemove) {
  chrome.history.search({ text: domainToRemove }, function (results) {
    results.forEach(function (item) {
      // Check if the URL's hostname includes the domain to remove
      if (new URL(item.url).hostname.includes(domainToRemove)) {
        // Delete the URL that matches the domain of the current URL
        chrome.history.deleteUrl({ url: item.url }, function () {
          // Generate a random URL to replace the deleted URL
          var replaceUrl = {
            url: getRandomURL()
          };

          // Add the random URL to the browsing history
          chrome.history.addUrl(replaceUrl, function () { //won't add a url if the url is already added.
            console.log("URL replaced successfully!");
          });
        });
      }
    });
  });
}

// Replace URLs of all tabs with the same domain as the active tab with random URLs
async function replaceTabsWithSameDomain() {
  try {
    const activeDomain = await getActiveTabURLDomain();
    chrome.tabs.query({ currentWindow: true }, function (allTabs) {
      allTabs.forEach(function (tab) {
        const tabDomain = extractDomain(tab.url);
        if (tabDomain === activeDomain) {
          const url = getRandomURL(); // Your function to get a random URL
          chrome.tabs.update(tab.id, { url: url }); // Update the URL of the tab with a random one
          console.log(`Updated tab with ID: ${tab.id} to URL: ${url}`);
        }
      });
    });
  } catch (error) {
    console.error('Error replacing tabs:', error);
  }
}

// Button click function to delete history and replace URLs in tabs
async function buttonClicked() {
  // Make sure randomURLGenerator.js is loaded before proceeding
  await loadRandomURLGenerator();  // Wait for the script to load

  // Uses functions to get the domain on the tab you are on and then removes it once the button is clicked
  domainToRemove = await getActiveTabURLDomain();
  console.log(`Removing history for domain: ${domainToRemove}`);
  await removeDomainEntriesFromHistory(domainToRemove);
  await replaceTabsWithSameDomain();
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
