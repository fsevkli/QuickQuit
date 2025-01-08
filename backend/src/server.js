require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express

const app = express();             // Create the Express app
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

// Define a basic route to test the server
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});