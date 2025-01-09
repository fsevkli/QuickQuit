 //Importing script used to generate random urls to replace with.
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
          console.log('Deleted URL: ${item.url}');
           // Generate a random URL to replace the deleted URL
           var replaceUrl = { url: getRandomURL() };
 
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
       const { domain } = await getActiveTabURLDomain();
       chrome.tabs.query({ currentWindow: true }, function(allTabs) {
           allTabs.forEach(function(tab) {
               const tabDomain = extractDomain(tab.url);
               if (tabDomain ===  domain) {
                   const url = getRandomURL(); // Your function to get a random URL
                   chrome.tabs.update(tab.id, { url: url }); // Update the URL of the tab with a random one
                   
                   console.log(`Updated tab with ID: ${tab.id} to URL: ${url}`);

               }
           });
       });
   } catch (error) {
       console.error(error);
   }
 }
 
 async function buttonClicked() {
  try {
    // Ensure randomURLGenerator.js is loaded before performing any operations
    await loadRandomURLGenerator();

    // Get the active tab's domain and remove corresponding entries from history
    const { domain } = await getActiveTabURLDomain();
    console.log(`Removing history entries for domain: ${domain}`);
    await removeDomainEntriesFromHistory(domain);

    // Replace all tabs with the same domain with random URLs
    await replaceTabsWithSameDomain();
  } catch (error) {
    console.error("Error in buttonClicked:", error);
  }
}
 
 // Function to handle button click or Escape key press
 function handleButtonClickOrEscape(event) {
   if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Escape')) {
       buttonClicked(); // Call the buttonClicked function when the button is clicked or Escape key is pressed
   }
 }
 
 //Add event listeners for button click and keydown event
 window.addEventListener('DOMContentLoaded', function () {
   const replaceButton = document.getElementById('button');
   replaceButton.addEventListener('click', buttonClicked);
   document.addEventListener('keydown', handleButtonClickOrEscape);
 });
 