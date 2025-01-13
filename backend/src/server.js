require('dotenv').config();
const express = require('express');
const path = require('path');
const { generateSafeContent } = require('../services/contentService');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'website' and 'public' directories
app.use(express.static(path.join(__dirname, '../../website')));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Serve quickquit.js dynamically
app.get('/static/js/quickquit.js', (req, res) => {
    const domains = req.query.domains ? req.query.domains.split(',') : [];
    const contentTypes = req.query.safeContent
        ? req.query.safeContent.split(',')
        : ['news'];

    const safeContent = contentTypes.flatMap((type) => generateSafeContent(type));

    const script = `
        (function() {
            const domains = ${JSON.stringify(domains)};
            const safeContent = ${JSON.stringify(safeContent)};
            const exitSite = "${req.query.exitSite || 'https://www.google.com'}";

            const button = document.createElement("button");
            button.textContent = "Get Me Out!";
            button.style.cssText = "position: fixed; bottom: 10px; right: 10px; background-color: red; color: white; border: none; padding: 10px 20px; font-size: 16px; z-index: 1000;";
            document.body.appendChild(button);

            button.addEventListener("click", () => {
                window.postMessage({ type: "QUICK_QUIT_CONFIG", data: { domains, safeContent, exitSite } }, "*");
            });

            console.log("Quick Quit loaded!");
        })();
    `;

    res.type('application/javascript').send(script);
});

// Catch-all route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});