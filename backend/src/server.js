require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'website' directory
app.use(express.static(path.join(__dirname, '../../website')));

// Serve static files from the 'public' directory
app.use('/static', express.static(path.join(__dirname, 'public')));

// Specific routes to remove .html extensions
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/index.html'));
});

app.get('/howItWorks', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/howItWorks.html'));
});

app.get('/aboutUs', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/aboutUs.html'));
});

// Redirect root to /index for cleaner URL
app.get('/', (req, res) => {
    res.redirect('/index');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});