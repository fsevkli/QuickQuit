// Set up initial permission checks when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    checkPermissions();
});

// Permission checking function
function checkPermissions() {
    chrome.permissions.contains({
        permissions: ['history', 'tabs', 'scripting'],
        origins: ['<all_urls>']
    }, (result) => {
        if (!result) {
            requestPermissions();
        }
    });
}

// Request necessary permissions
function requestPermissions() {
    chrome.permissions.request({
        permissions: ['history', 'tabs', 'scripting'],
        origins: ['<all_urls>']
    }, (granted) => {
        if (granted) {
            console.log('All required permissions granted');
        } else {
            console.warn('Some permissions were denied');
        }
    });
}

// Main message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background script received a message:", message);

    if (message.type === "HANDLE_HISTORY") {
        // Check permissions before proceeding
        chrome.permissions.contains({ permissions: ['history'] }, (hasPermission) => {
            if (!hasPermission) {
                sendResponse({ 
                    success: false, 
                    error: "Required permissions not granted" 
                });
                return;
            }

            handleHistoryDeletion(message, sender, sendResponse);
        });

        return true; // Keep the message channel open for async response
    } else if (message.type === "CHECK_PERMISSIONS") {
        checkPermissions();
        sendResponse({ success: true });
    } else {
        console.error("Unknown message type:", message.type);
        sendResponse({ success: false, error: "Invalid message type" });
    }
});

// Handle the history deletion process
function handleHistoryDeletion(message, sender, sendResponse) {
    const { domains, safeContent, exitSite } = message;

    // Normalize domains
    const domainsFixed = fixDomains(domains);

    console.log("Domains to replace:", domainsFixed);
    console.log("Safe content types:", safeContent);
    console.log("Exit site:", exitSite);

    // Search the user's browsing history
    chrome.history.search({ text: "", maxResults: 500 }, async (results) => {
        console.log("Browsing history fetched:", results);

        // Generate safe URLs for replacement
        const safeUrls = generateSafeUrls(safeContent, domains.length);
        console.log("Generated safe URLs:", safeUrls);

        // Process each history entry
        const promises = results.map(async (item) => {
            const itemUrl = new URL(item.url);
            const itemDomain = getCleanURL(itemUrl.hostname); // Normalize the domain

            console.log(`Checking domain: ${itemDomain}`);
            if (domainsFixed.some((domain) => itemDomain.endsWith(domain)) || isGoogleUrl(item.url)) {
                console.log(`Deleting domain entry: ${item.url}`);
                await chrome.history.deleteUrl({ url: item.url });

                const safeUrl = safeUrls.pop() || exitSite || "https://www.google.com";
                console.log(`Adding safe URL: ${safeUrl}`);
                await chrome.history.addUrl({ url: safeUrl });
            }
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        // Redirect the user to the exit site
        if (sender && sender.tab) {
            console.log(`Redirecting to exit site: ${exitSite}`);
            chrome.tabs.update(sender.tab.id, { url: exitSite });
        } else {
            console.error("Sender tab not found. Cannot redirect.");
        }

        sendResponse({ success: true });
    });
}

// Helper: Normalize a URL
function getCleanURL(url) {
    return url
        .replace(/^https?:\/\//, "") // Remove protocol
        .replace(/^www\./, "")      // Remove "www."
        .replace(/\/$/, "");        // Remove trailing slash
}

// Helper: Normalize a list of domains
function fixDomains(domains) {
    return domains.map((domain) => getCleanURL(domain));
}

// Helper: Generate Safe URLs
function generateSafeUrls(contentTypes, count) {
    const safeContentMap = {
        news: [
            "https://www.bbc.com/live/news",
            "https://edition.cnn.com/world",
            "https://www.nytimes.com/section/world",
            "https://www.theguardian.com/world",
            "https://www.reuters.com/world",
            "https://www.aljazeera.com",
            "https://apnews.com/world-news",
            "https://www.dw.com/top-stories/s-9097",
            "https://news.sky.com/world",
            "https://www.cbc.ca/news"
        ],
        videos: [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=tpiyEe_CqB4",
            "https://www.youtube.com/watch?v=FfJOz5UX0sk",
            "https://www.youtube.com/feed/trending",
            "https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ",
            "https://www.youtube.com/gaming",
            "https://www.youtube.com/channel/UCEgdi0XIXXZ-qJOFPf4JSKw",
            "https://www.youtube.com/results?search_query=comedy",
            "https://www.youtube.com/results?search_query=documentary",
            "https://www.youtube.com/results?search_query=vlogs"
        ],
        sports: [
            "https://www.espn.com/nfl",
            "https://www.cricbuzz.com/cricket-match/live-scores",
            "https://www.livescore.com",
            "https://sports.yahoo.com",
            "https://www.bbc.com/sport",
            "https://www.skysports.com/live-scores",
            "https://www.foxsports.com/scores",
            "https://www.si.com",
            "https://bleacherreport.com/scores",
            "https://www.goal.com/live-scores"
        ],
        recipes: [
            "https://www.allrecipes.com/recipe/17481/simple-white-cake",
            "https://www.bbcgoodfood.com/recipes/lentil-soup",
            "https://www.bonappetit.com/recipe/barley-and-roasted-vegetable-soup",
            "https://www.loveandlemons.com/brownies-recipe",
            "https://www.bbcgoodfood.com/recipes/beef-vegetable-casserole",
            "https://www.seriouseats.com/pasta-carbonara-sauce-recipe",
            "https://minimalistbaker.com/1-bowl-vegan-banana-oat-pancakes",
            "https://www.delish.com/cooking/recipe-ideas/a19695267/best-caesar-salad-recipe",
            "https://www.tasteofhome.com/recipes/apple-pie",
            "https://www.kingarthurbaking.com/recipes/perfectly-pillowy-cinnamon-rolls-recipe"
        ],
        weather: [
            "https://weather.com",
            "https://www.weather.gov",
            "https://www.wunderground.com",
            "https://www.accuweather.com",
            "https://www.theweathernetwork.com",
            "https://www.windy.com",
            "https://www.nhc.noaa.gov",
            "https://www.weatherbug.com",
            "https://www.yahoo.com/news/weather",
            "https://www.climate.gov"
        ],
        shows: [
            "https://www.netflix.com/browse/genre/89814",
            "https://www.hulu.com/guides/category/featured",
            "https://www.hbo.com/whats-new-whats-leaving",
            "https://www.amazon.com/gp/video/storefront/ref=atv_hm_hom_legacy_redirect",
            "https://ondisneyplus.disney.com/recent-releases",
            "https://www.apple.com/tv-pr",
            "https://www.justwatch.com",
            "https://www.shudder.com/collections/featured-collections",
            "https://tubitv.com/category/featured",
            "https://www.imdb.com/chart/moviemeter/?ref_=nv_mv_mpm"
        ],
        music: [
            "https://open.spotify.com/track/4fGEj1YkKvY4KZiK8isuSg",
            "https://music.apple.com/ca/curator/best-playlists-ever/1494209940",
            "https://soundcloud.com/charts/top",
            "https://www.deezer.com/channels/new",
            "https://music.amazon.com",
            "https://bandcamp.com/discover",
            "https://www.shazam.com/charts/top-200",
            "https://audiomack.com/trending-now/songs",
            "https://www.songkick.com/leaderboards/popular_artists",
            "https://www.musixmatch.com/discover"
        ]
    };

    // Flatten and shuffle URLs
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

// Helper: Check if a URL is a Google URL
function isGoogleUrl(url) {
    try {
        const parsedUrl = new URL(url);
        const domain = parsedUrl.hostname.replace(/^www\./, "");
        return domain.endsWith("google.com");
    } catch (error) {
        console.error("Error parsing URL:", url, error);
        return false;
    }
}