require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from the 'website' directory
app.use(express.static(path.join(__dirname, '../../website')));

app.use('/static', express.static(path.join(__dirname, 'public')));

// Route for "How It Works" page
app.get('/howItWorks', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/howItWorks.html'));
});

app.get('/aboutUs', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/aboutUs.html'));
});

app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/demo.html'));
});

app.get('/privacyPolicy', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/privacyPolicy.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../../website/404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});