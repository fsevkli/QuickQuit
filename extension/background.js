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

// Function to get timestamps in 1-3 hour window
function generateSpreadTimestamps() {
    const timestamps = [];
    const now = new Date();
    const hoursBack = Math.floor(Math.random() * 2) + 1; // Random between 1-3 hours
    const startTime = now.getTime() - (hoursBack * 60 * 60 * 1000);
    const timeWindow = hoursBack * 60 * 60 * 1000; // Convert hours to milliseconds
    
    // Create timestamps spread across the time window
    for (let i = 0; i < replaceUrls.length; i++) {
        const randomOffset = Math.random() * timeWindow;
        const timestamp = new Date(startTime + randomOffset);
        timestamps.push(timestamp);
    }
    
    // Sort in ascending order (oldest to newest)
    return timestamps.sort((a, b) => a - b);
}

// Add URLs to history in sequence
async function addUrlsToHistory() {
    console.log("Adding replacement URLs to history with 1-3 hour spread");
    
    try {
        const timestamps = generateSpreadTimestamps();
        
        // Create array of URL-timestamp pairs
        const urlPairs = replaceUrls.map((url, index) => ({
            url,
            timestamp: timestamps[index]
        }));
        
        // Process URLs in sequence (oldest first)
        for (const pair of urlPairs) {
            const tab = await chrome.tabs.create({
                url: pair.url,
                active: false
            });
            
            // Brief delay for the page to register in history
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Close the tab
            await chrome.tabs.remove(tab.id);
            
            console.log(`Added ${pair.url} with timestamp ${pair.timestamp.toLocaleTimeString()}`);
            
            // Small delay between entries
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log("Finished adding URLs to history");
    } catch (error) {
        console.error("Error in adding URLs to history:", error);
        throw error;
    }
}

// Handle history deletion
async function handleHistoryDeletion() {
    console.log("Starting history cleanup");
    
    try {
        // Delete history from last 3 hours
        const now = new Date();
        const threeHoursAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000));
        
        await chrome.history.deleteRange({
            startTime: threeHoursAgo.getTime(),
            endTime: now.getTime()
        });
        
        console.log("History cleared, adding new entries");
        
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
        
        for (const tab of tabs) {
            try {
                if (new URL(tab.url).hostname === domain) {
                    const randomIndex = Math.floor(Math.random() * replaceUrls.length);
                    await chrome.tabs.update(tab.id, { url: replaceUrls[randomIndex] });
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