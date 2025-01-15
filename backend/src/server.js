require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Cookie Parser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../website')));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Root route with cookie logic
app.get('/', (req, res) => {
    try {
        if (!req.cookies.firstVisit) {
            res.cookie('firstVisit', 'false', { maxAge: 1000 * 60 * 60 * 24 * 365 * 10, httpOnly: true });
            console.log('First-time visitor.');
            res.sendFile(path.join(__dirname, '../../website/welcome.html'));
        } else {
            console.log('Returning visitor.');
            res.sendFile(path.join(__dirname, '../../website/index.html'));
        }
    } catch (err) {
        console.error('Error handling cookies:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Additional routes
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
