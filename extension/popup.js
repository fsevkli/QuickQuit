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
       
       chrome.tabs.query({ currentWindow: true }, function(allTabs) {
           allTabs.forEach(function(tab) {
               const tabDomain = extractDomain(tab.url);
               if (tabDomain === activeDomain) {
                   const url = getRandomURL(); // Your function to get a random URL
                   chrome.tabs.update(tab.id, { url: url }); // Update the URL of the tab with a random one
               }
           });
       });
   } catch (error) {
       console.error(error);
   }
 }
 
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
 
 //Add event listeners for button click and keydown event
 window.addEventListener('DOMContentLoaded', function () {
   const replaceButton = document.getElementById('button');
   replaceButton.addEventListener('click', buttonClicked);
   document.addEventListener('keydown', handleButtonClickOrEscape);
 });
 