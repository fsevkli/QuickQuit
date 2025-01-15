chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background script received a message:", message);

    if (message.type === "HANDLE_HISTORY") {
        const { domains, safeContent, exitSite } = message;

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

            // Create an array of promises for deleting and adding URLs
            const promises = results.map(async (item) => {
                const itemUrl = new URL(item.url);
                const itemDomain = itemUrl.hostname.replace(/^www\./, ""); // Normalize the domain

                // Compare the item domain with the user-provided domains
                if (domainsFixed.some((domain) => itemDomain === domain)) {
                    console.log(`Deleting domain entry: ${item.url}`);
                    await chrome.history.deleteUrl({ url: item.url });

                    const safeUrl = safeUrls.pop() || exitSiteFixed || "https://www.google.com";
                    console.log(`Opening safe URL in a new tab: ${safeUrl}`);

                    // Open the safe URL in a new tab, wait for a short time, then close the tab
                    const newTab = await chrome.tabs.create({ url: safeUrl, active: false });

                    // Wait for a short duration before closing the tab
                    await new Promise(resolve => setTimeout(resolve, 500)); // Adjust the time as needed

                    // Close the newly opened tab
                    await chrome.tabs.remove(newTab.id);
                    console.log(`Closed the tab with URL: ${safeUrl}`);
                }
            });

            // Wait for all promises to resolve before redirecting
            await Promise.all(promises);

            // Redirect the user to the specified exit site or Google
            const redirectUrl = exitSiteFixed || "https://www.google.com";
            if (sender && sender.tab) {
                console.log(`Redirecting to exit site: ${redirectUrl}`);
                chrome.tabs.update(sender.tab.id, { url: redirectUrl });
            } else {
                console.error("Sender tab not found. Cannot redirect.");
            }

            sendResponse({ success: true });
        });

        return true; // Keep the message channel open for asynchronous response
    } else {
        console.error("Unknown message type:", message.type);
        sendResponse({ success: false, error: "Invalid message type" });
    }
});

// Helper: Identify if a URL is a Google search or service
function isGoogleUrl(url) {
    const isGoogle = /^https:\/\/www\.google\.[a-z.]+/.test(url);
    console.log(`Checking if URL is Google-related (${url}):`, isGoogle);
    return isGoogle;
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
            "https://www.bonappetit.com/recipe/barley-and-roasted-vegetable-soup?srsltid=AfmBOop_ksIiGrAhwsEts_8_j6I6yoPg0g3LGaFWmCiYq63c47JGd2Z_",
            "https://www.loveandlemons.com/brownies-recipe",
            "https://www.bbcgoodfood.com/recipes/beef-vegetable-casserole",
            "https://www.seriouseats.com/pasta-carbonara-sauce-recipe",
            "https://minimalistbaker.com/1-bowl-vegan-banana-oat-pancakes",
            "https://www.delish.com/cooking/recipe-ideas/a19695267/best-caesar-salad-recipe",
            "https://www.tasteofhome.com/recipes/apple-pie/?srsltid=AfmBOorBXZuMr6NggKL02mPU3DZDkDrQEvLsSwi7vdxkMhDf9hU_5XwT",
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
            "https://www.amazon.com/gp/video/storefront/ref=atv_hm_hom_legacy_redirect?contentId=IncludedwithPrime&contentType=merch&merchId=IncludedwithPrime",
            "https://ondisneyplus.disney.com/recent-releases",
            "https://www.apple.com/tv-pr",
            "https://www.justwatch.com",
            "https://www.shudder.com/collections/featured-collections/f3556f36d07487c80",
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

    // Flatten and shuffle the URLs for randomness
    const allUrls = contentTypes.flatMap((type) => safeContentMap[type] || []);
    const shuffledUrls = shuffleArray(allUrls).slice(0, count);

    console.log("Safe URLs after shuffling:", shuffledUrls);
    return shuffledUrls;
}

// Helper: Shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
