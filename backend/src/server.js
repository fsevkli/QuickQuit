require('dotenv').config(); // Load environment variables
const express = require('express'); // Import Express
const path = require('path');

// Import routes
const configRoutes = require('../routes/configRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug log to verify static path
console.log('Serving static files from:', path.join(__dirname, '../../website'));

// Serve site files from the website directory
app.use(express.static(path.join(__dirname, '../../website')));

// Use routes
app.use('/api/config', configRoutes);

// Default route: Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../website/index.html'));
});

// Catch-all route for unknown paths (404 handling)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});