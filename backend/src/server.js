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

app.use(cookieParser());

app.get('/', (req, res) => {
  // Check if the user has the 'firstVisit' cookie
  if (!req.cookies.firstVisit) {
    // If no cookie, it's their first visit, so set the cookie
    res.cookie('firstVisit', 'false', { maxAge: 1000 * 60 * 60 * 24 * 365 * 10, httpOnly: true });
    res.send('Welcome! This is your first visit.');
  } else {
    // If the cookie exists, it's not their first visit
    res.send('Welcome back!');
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});