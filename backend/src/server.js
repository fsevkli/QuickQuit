require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'website' directory
app.use(express.static(path.join(__dirname, '../../website')));

// Redirect root URL to /website/index
app.get('/', (req, res) => {
    res.redirect('/website/index');
});

// Serve specific routes for clean URLs
app.get('/website/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/index.html'));
});

app.get('/website/howItWorks', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/howItWorks.html'));
});

app.get('/website/aboutUs', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/aboutUs.html'));
});

// Catch-all route to handle 404 errors for unmatched paths
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});