 //Importing script used to generate random urls to replace with.
var script = document.createElement('script');
script.src = 'randomURLGenerator.js';
document.head.appendChild(script);

//This function extracts domain from a url
function extractDomain(url) {
  const urlObject = new URL(url);
  return urlObject.hostname;
}

//This function gets the URL Hostname from the current tab
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
  return new Promise((resolve, reject) => {
    chrome.history.search({ text: domainToRemove, maxResults: 1000 }, function (results) {
      let deletionPromises = [];

      results.forEach(function (item) {
        const itemDomain = new URL(item.url).hostname;
        if (itemDomain.includes(domainToRemove)) {
          // Create a promise for each deleteUrl call
          let deletePromise = new Promise((delResolve, delReject) => {
            chrome.history.deleteUrl({ url: item.url }, function () {
              if (chrome.runtime.lastError) {
                delReject(`Failed to delete URL: ${item.url}`);
              } else {
                console.log(`Deleted URL: ${item.url}`);
                delResolve();
              }
            });
          });
          deletionPromises.push(deletePromise);
        }
      });

      // Wait for all deletions to finish
      Promise.all(deletionPromises)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(`Error deleting URLs: ${error}`);
        });
    });
  });
}


// Replace URLs of all tabs with the same domain as the active tab with random URLs
async function replaceTabsWithSameDomain() {
  try {
    const activeDomain = await getActiveTabURLDomain();
    
    chrome.tabs.query({ currentWindow: true }, function(allTabs) {
      allTabs.forEach(function(tab) {
        const tabDomain = extractDomain(tab.url);
        if (tabDomain === activeDomain) {
          const url = getRandomURL(); // generating a random URL
          chrome.tabs.update(tab.id, { url: url }); // Update the URL of the tab with a random one
          console.log(`Updated tab with ID: ${tab.id} to URL: ${url}`);
        }
      });
    });
  } catch (error) {
    console.error('Error replacing tabs:', error);
  }
}

async function buttonClicked() {
  try {
    // Get the domain of the active tab
    const domainToRemove = await getActiveTabURLDomain();
    console.log(`Removing history for domain: ${domainToRemove}`);

    // Remove domain entries from history
    await removeDomainEntriesFromHistory(domainToRemove);

    // Replace all tabs with the same domain with random URLs
    await replaceTabsWithSameDomain();
  } catch (error) {
    console.error('Error in buttonClicked:', error);
  }
}

// Function to handle button click or Escape key press
function handleButtonClickOrEscape(event) {
  if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Escape')) {
    buttonClicked();
  }
}

//Add event listeners for button click and keydown event
window.addEventListener('DOMContentLoaded', function () {
  const replaceButton = document.getElementById('button');
  replaceButton.addEventListener('click', buttonClicked);
  document.addEventListener('keydown', handleButtonClickOrEscape);
});
