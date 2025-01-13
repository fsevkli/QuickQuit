chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "HANDLE_HISTORY") {
      const { domains, safeContent, exitSite } = message;
  
      chrome.history.search({ text: "", maxResults: 500 }, (results) => {
        const safeUrls = generateSafeUrls(safeContent, domains.length);
  
        results.forEach((item) => {
          if (domains.some((domain) => item.url.includes(domain))) {
            console.log(`Deleting domain entry: ${item.url}`);
            chrome.history.deleteUrl({ url: item.url });
  
            const safeUrl = safeUrls.pop() || exitSite || "https://www.google.com";
            console.log(`Adding safe URL: ${safeUrl}`);
            chrome.history.addUrl({ url: safeUrl });
          } else if (isGoogleUrl(item.url)) {
            console.log(`Deleting Google search: ${item.url}`);
            chrome.history.deleteUrl({ url: item.url });
          }
        });
  
        // Redirect the user to the specified exit site
        const redirectUrl = exitSite || "https://www.google.com";
        if (sender.tab) {
          chrome.tabs.update(sender.tab.id, { url: redirectUrl });
        }
  
        sendResponse({ success: true });
      });
  
      return true; // Indicate asynchronous response
    }
  });
  
  // Helper: Identify if a URL is a Google search or service
  function isGoogleUrl(url) {
    return /^https:\/\/www\.google\.[a-z.]+/.test(url);
  }
  
  // Helper: Generate Safe URLs
  function generateSafeUrls(contentTypes, count) {
    const safeContentMap = {
      news: ["https://www.bbc.com/news", "https://www.cnn.com"],
      videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      sports: ["https://www.espn.com"]
    };
  
    const urls = contentTypes.flatMap(
      (type) => safeContentMap[type] || ["https://www.google.com"]
    );
    return Array(count).fill(urls).flat().slice(0, count);
  }