require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'website' directory
app.use(express.static(path.join(__dirname, '../../website')));

// Serve static files from the 'public' directory
app.use('/static', express.static(path.join(__dirname, 'public')));

// Catch-all route to serve index.html for the main site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});