const axios = require('axios');

// Fetch the user's location
async function getLocation(req, res) {
  try {
    const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GOOGLE_MAPS_API_KEY}`);
    res.status(200).json(response.data.location);
  } catch (error) {
    console.error('Error fetching location:', error.message);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
}

module.exports = {
  getLocation
};
