chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background script received a message:", message);

    if (message.type === "HANDLE_HISTORY") {
        const { domains, safeContent, exitSite } = message;

        // Normalize domains
        const domainsFixed = fixDomains(domains);
        const exitSiteClean = getCleanURL(exitSite);
        const exitSiteFixed = fixUrls(exitSiteClean);

        console.log("Domains to replace:", domainsFixed);
        console.log("Safe content types:", safeContent);
        console.log("Exit site:", exitSiteFixed);

        // Search the user's browsing history
        chrome.history.search({ text: "", maxResults: 500 }, async (results) => {
            console.log("Browsing history fetched:", results);

            const safeUrls = generateSafeUrls(safeContent, domains.length);
            console.log("Generated safe URLs:", safeUrls);

            const promises = results.map(async (item) => {
                const itemUrl = new URL(item.url);
                const itemDomain = itemUrl.hostname.replace(/^www\./, "");

                if (domainsFixed.some((domain) => itemDomain === domain)) {
                    console.log(`Deleting domain entry: ${item.url}`);
                    await chrome.history.deleteUrl({ url: item.url });

                    const safeUrl = safeUrls.pop() || exitSiteFixed || "https://www.google.com";
                    console.log(`Opening safe URL in a new tab: ${safeUrl}`);

                    const newTab = await chrome.tabs.create({ url: safeUrl, active: false });

                    await new Promise(resolve => setTimeout(resolve, 500));

                    chrome.tabs.get(newTab.id, (tab) => {
                        const faviconUrl = getFaviconUrl(tab.url);
                        if (faviconUrl) {
                            chrome.tabs.executeScript(newTab.id, {
                                code: `document.querySelector('link[rel="icon"]').setAttribute("href", "${faviconUrl}");`
                            });
                        }
                    });

                    await chrome.tabs.remove(newTab.id);
                    console.log(`Closed the tab with URL: ${safeUrl}`);
                }
            });

            await Promise.all(promises);

            const redirectUrl = exitSiteFixed || "https://www.google.com";
            if (sender && sender.tab) {
                console.log(`Redirecting to exit site: ${redirectUrl}`);
                chrome.tabs.update(sender.tab.id, { url: redirectUrl });
            } else {
                console.error("Sender tab not found. Cannot redirect.");
            }

            sendResponse({ success: true });
        });

        return true;
    } else {
        console.error("Unknown message type:", message.type);
        sendResponse({ success: false, error: "Invalid message type" });
    }
});

// Helper function to normalize domains
function fixDomains(domains) {
    return domains.map(domain => {
        const url = new URL(domain);
        return url.hostname.replace(/^www\./, ""); // Normalize the domain (e.g., remove "www.")
    });
}
