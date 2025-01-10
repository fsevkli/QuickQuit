const express = require('express');
const router = express.Router();
const { generateSafeContent } = require('../services/contentService');

// POST route for configuring the button
router.post('/', (req, res) => {
    const { domains, contentType } = req.body;

    // Validate inputs
    if (!domains || !contentType) {
        return res.status(400).json({
            success: false,
            message: 'Both domains and content type are required!',
        });
    }

    // Split and clean domains
    const domainList = domains.split(',').map(domain => domain.trim());

    // Generate safe content based on contentType
    const safeContent = generateSafeContent(contentType);

    if (!safeContent) {
        return res.status(400).json({
            success: false,
            message: 'Invalid content type provided!',
        });
    }

    // Respond with configuration for the extension
    res.json({
        success: true,
        message: 'Configuration generated successfully!',
        data: {
            domains: domainList,
            safeContent,
        },
    });
});

module.exports = router;