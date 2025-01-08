require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express
const path = require('path');

console.log('PORT from .env:', process.env.PORT); // Debug line

const app = express();             // Create the Express app
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

// Serve site files from the website directory
app.use(express.static(path.join(__dirname, '../../website')));

// Define a basic route to test the server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});