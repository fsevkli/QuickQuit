chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "HANDLE_HISTORY") {
        const { domains, safeContent, exitSite } = message;

        chrome.history.search({ text: "", maxResults: 500 }, (results) => {
            // Generate safe URLs for all content types
            const safeUrls = generateSafeUrls(safeContent, domains.length);

            results.forEach((item) => {
                // Check if the current URL matches a domain to replace
                if (domains.some((domain) => item.url.includes(domain))) {
                    console.log(`Deleting domain entry: ${item.url}`);
                    chrome.history.deleteUrl({ url: item.url });

                    // Replace with a safe URL
                    const safeUrl = safeUrls.pop() || exitSite || "https://www.google.com";
                    console.log(`Adding safe URL: ${safeUrl}`);
                    chrome.history.addUrl({ url: safeUrl });
                } 
                // Check if the URL is a Google search
                else if (isGoogleUrl(item.url)) {
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
        news: [
            "https://www.bbc.co.uk/news/world",
            "https://edition.cnn.com/world",
            "https://www.nytimes.com/section/world"
        ],
        videos: [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=3JZ_D3ELwOQ"
        ],
        sports: [
            "https://www.espn.com",
            "https://www.sports.yahoo.com",
            "https://www.foxsports.com"
        ],
        recipes: [
            "https://www.allrecipes.com/",
            "https://www.foodnetwork.com/",
            "https://www.tasteofhome.com/"
        ],
        weather: [
            "https://www.weather.com/",
            "https://www.accuweather.com/",
            "https://www.bbc.com/weather"
        ],
        shows: [
            "https://www.netflix.com/",
            "https://www.hulu.com/",
            "https://www.hbomax.com/"
        ],
        music: [
            "https://www.spotify.com/",
            "https://www.apple.com/music/",
            "https://www.soundcloud.com/"
        ]
    };

    // Flatten and shuffle the URLs for randomness
    const allUrls = contentTypes.flatMap((type) => safeContentMap[type] || []);
    return shuffleArray(allUrls).slice(0, count);
}

// Helper: Shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}