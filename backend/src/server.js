require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// To read cookies
// app.use(cookieParser());

// Serve static assets from the 'website' directory
app.use(express.static(path.join(__dirname, '../../website')));
app.use('/static', express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//     // Check if the 'firstVisit' cookie exists
//     if (!req.cookies.firstVisit) {
//         // If no cookie, set the 'firstVisit' cookie to track future visits
//         res.cookie('firstVisit', 'false', { maxAge: 1000 * 60 * 60 * 24 * 365 * 10, httpOnly: true });
//         console.log('First-time visitor.');
//     } else {
//         console.log('Returning visitor.');
//         res.sendFile(path.join(__dirname, '../../website'));
//     }
// });

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

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../../website/404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});