// Generate safe content based on content type
const generateSafeContent = (contentType) => {
    const contentSources = {
        news: [
            'https://www.bbc.com/news',
            'https://www.cnn.com',
            'https://www.nytimes.com',
        ],
        recipes: [
            'https://www.allrecipes.com/',
            'https://www.foodnetwork.com/',
            'https://www.tasteofhome.com/',
        ],
        youtube: [
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
        ],
        weather: [
            'https://www.weather.com/',
            'https://www.accuweather.com/',
            'https://www.bbc.com/weather',
        ],
        sports: [
            'https://www.espn.com/',
            'https://www.sports.yahoo.com/',
            'https://www.foxsports.com/',
        ],
        shows: [
            'https://www.netflix.com/',
            'https://www.hulu.com/',
            'https://www.hbomax.com/',
        ],
        music: [
            'https://www.spotify.com/',
            'https://www.apple.com/music/',
            'https://www.soundcloud.com/',
        ],
    };

    return contentSources[contentType.toLowerCase()] || null;
};

module.exports = { generateSafeContent };