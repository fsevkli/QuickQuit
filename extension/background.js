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

// Function to get a random URL
function getRandomURL() {
    const randomIndex = Math.floor(Math.random() * replaceUrls.length);
    return replaceUrls[randomIndex];
}

// Function to create a spread of timestamps throughout today
function generateTimestamps() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0); // Start at 9 AM
    const timestamps = [];
    
    for (let i = 0; i < replaceUrls.length; i++) {
        const randomHours = Math.floor(Math.random() * 8); // Spread across 8 hours
        const randomMinutes = Math.floor(Math.random() * 60);
        const timestamp = new Date(startOfDay.getTime() + (randomHours * 3600000) + (randomMinutes * 60000));
        timestamps.push(timestamp);
    }
    
    return timestamps.sort((a, b) => a - b); // Sort chronologically
}

// Add URLs to history in sequence
async function addUrlsToHistory() {
    console.log("Adding replacement URLs to history with spread timestamps");
    
    try {
        const timestamps = generateTimestamps();
        const currentTime = new Date();
        
        // Create array of URL-timestamp pairs and sort by timestamp
        const urlPairs = replaceUrls.map((url, index) => ({
            url,
            timestamp: timestamps[index]
        })).sort((a, b) => a.timestamp - b.timestamp);
        
        // Process URLs in chronological order
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
        // Delete today's history
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        
        await chrome.history.deleteRange({
            startTime: startOfDay.getTime(),
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
        console.log(`Found ${tabs.length} tabs to process`);
        
        for (const tab of tabs) {
            try {
                if (new URL(tab.url).hostname === domain) {
                    const newUrl = getRandomURL();
                    await chrome.tabs.update(tab.id, { url: newUrl });
                    console.log("Updated tab", tab.id, "to:", newUrl);
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