require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express
const path = require('path');

console.log('PORT from .env:', process.env.PORT); // Debug line

const app = express();             // Create the Express app
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

// Middleware to parse JSON and URL-encoded data (for API requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve site files from the website directory
app.use(express.static(path.join(__dirname, '../../website')));

// Default route: Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/index.html'));
});

// Example API route for GET requests
app.get('/api/data', (req, res) => {
    res.json({
        success: true,
        message: 'This is a response from the /api/data endpoint',
        data: {
            example: 'You can customize this response',
        },
    });
});

// Example API route for POST requests
app.post('/api/submit', (req, res) => {
    const { name, email } = req.body; // Extract data from the request body
    if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required!' });
    }
    res.json({
        success: true,
        message: `Received data for ${name} (${email})`,
    });
});

// Catch-all route for unknown paths (e.g., 404 handling)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});