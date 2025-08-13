const express = require('express');
const router = express.Router();
const { getAllFunding } = require('../models/funding');


// GET All funding sources
router.get('/', async (_, response) => {
    try { 
        response.json(await getAllFunding()); 
    } catch { 
        response.status(500).json({ error: 'Failed to load funding sources'}); 
    }
});

module.exports = router;