const express = require('express');
const { getLocation } = require('../controllers/locationController');

const router = express.Router();

// Route to get the user's location
router.post('/get-location', getLocation);

module.exports = router;
