require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from the 'website' directory
app.use(express.static(path.join(__dirname, '../../website')));

app.use('/static', express.static(path.join(__dirname, 'public')));

// Redirect root URL to the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website'));
});

// Route for "How It Works" page
app.get('/howItWorks', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/howItWorks.html'));
});

// Route for "About Us" page
app.get('/aboutUs', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/aboutUs.html'));
});

// Route for "Button Demo" page
app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/demo.html'));
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../../website/404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});