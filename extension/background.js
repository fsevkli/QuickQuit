// Define replacement URLs
const replaceUrls = [
    "https://www.youtube.com/watch?v=cY2G3dhW8qc",
    "https://www.youtube.com/watch?v=2A8OqL-nHT8",
    "https://www.youtube.com/watch?v=txqiwrbYGrs",
    "https://www.youtube.com/watch?v=ciOFpMapc6o",
    "https://www.youtube.com/watch?v=k3wWF6pQgpE",
    "https://www.youtube.com/watch?v=lx3egn8v4Mg",
    "https://www.youtube.com/watch?v=b6hoBp7Hk-A",
    "https://www.youtube.com/watch?v=QQ9gs-5lRKc",
    "https://www.youtube.com/watch?v=d7qqu9HC7V0",
    "https://www.youtube.com/watch?v=fLclGPr7fj4",
    "https://www.youtube.com/watch?v=a91oTLx-1No.com"
];

// Get random delay between min and max minutes
function getRandomMinuteDelay(minMinutes, maxMinutes) {
    return Math.floor(Math.random() * (maxMinutes - minMinutes + 1) + minMinutes) * 60000;
}

// Create a temporary tab, load URL, and close after delay
async function createTemporaryVisit(url, delay) {
    try {
        // Create new tab
        const tab = await chrome.tabs.create({ 
            url: url,
            active: false // Keep it in background
        });

        // Wait for specified delay
        await new Promise(resolve => setTimeout(resolve, delay));

        // Close the tab
        await chrome.tabs.remove(tab.id);
        
        console.log(`Visited ${url} for ${delay/1000} seconds`);
    } catch (error) {
        console.error(`Error during temporary visit to ${url}:`, error);
    }
}

// Add URLs to history with natural timestamps
async function addUrlsToHistory() {
    console.log("Adding replacement URLs to history with natural timestamps");
    
    try {
        // Create a copy of URLs array to shuffle
        const shuffledUrls = [...replaceUrls];
        // Fisher-Yates shuffle
        for (let i = shuffledUrls.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledUrls[i], shuffledUrls[j]] = [shuffledUrls[j], shuffledUrls[i]];
        }

        // Process URLs in sequence with natural delays
        for (const url of shuffledUrls) {
            const delay = getRandomMinuteDelay(1, 30); // Random delay between 1-30 minutes
            await createTemporaryVisit(url, 3000); // Load each URL for 3 seconds
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        console.log("Finished adding URLs to history");
    } catch (error) {
        console.error("Error in adding URLs to history:", error);
        throw error;
    }
}

// Handle history deletion
async function handleHistoryDeletion() {
    console.log("Starting history deletion");
    
    try {
        // Delete last hour of history
        const endTime = new Date().getTime();
        const startTime = endTime - (60 * 60 * 1000); // Last hour
        
        await chrome.history.deleteRange({
            startTime: startTime,
            endTime: endTime
        });
        
        console.log("History deleted, adding new entries");
        
        // Add new history entries
        await addUrlsToHistory();
        
        return { success: true };
    } catch (error) {
        console.error("Error in history deletion:", error);
        throw error;
    }
}

// Handle tab replacement
async function handleTabReplacement(domain) {
    console.log("Starting tab replacement for domain:", domain);
    
    try {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        console.log(`Found ${tabs.length} tabs to process`);
        
        for (const tab of tabs) {
            try {
                if (new URL(tab.url).hostname === domain) {
                    const newUrl = getRandomURL();
                    await chrome.tabs.update(tab.id, { url: newUrl });
                    console.log("Updated tab", tab.id, "to:", newUrl);
                    // Add small delay between tab updates
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.error("Error processing tab:", tab.id, error);
            }
        }
        
        return { success: true };
    } catch (error) {
        console.error("Error in tab replacement:", error);
        throw error;
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background script received message:", request);
    
    if (request.action === "deleteHistory") {
        handleHistoryDeletion()
            .then(result => sendResponse(result))
            .catch(error => {
                console.error("History deletion error:", error);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
    
    if (request.action === "replaceTabs") {
        handleTabReplacement(request.domain)
            .then(result => sendResponse(result))
            .catch(error => {
                console.error("Tab replacement error:", error);
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});