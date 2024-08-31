require('dotenv').config();
const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Define available sectors
const sectors = ['economics', 'business', 'psr'];
let lastAssignedSectorIndex = -1;  // Initialize the sector counter

// User schema definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  assignedSector: { type: String, default: null },  // New users start with null (unredeemed ticket)
});

const User = mongoose.model('User', userSchema);

// User signup endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(400).send('Error creating user: ' + error.message);
  }
});

// User login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).send('Login successful');
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

// Ticket redemption status check endpoint
app.post('/check-redemption-status', async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }
    // Return the current sector assignment (if any)
    res.status(200).json({ sector: user.assignedSector });
  } catch (error) {
    console.error('Error checking redemption status:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

// Ticket redemption endpoint
app.post('/redeem', async (req, res) => {
  const { username } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send('User not found');
    }

    if (user.assignedSector) {
      // User already has an assigned sector (ticket already redeemed)
      return res.status(200).json({ sector: user.assignedSector });
    }

    // Round-robin logic to assign a sector
    lastAssignedSectorIndex = (lastAssignedSectorIndex + 1) % sectors.length;
    const assignedSector = sectors[lastAssignedSectorIndex];

    // Assign sector to user (ticket is now redeemed)
    user.assignedSector = assignedSector;
    await user.save();

    res.status(200).json({ sector: assignedSector });
  } catch (error) {
    console.error('Error during ticket redemption:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

// Location fetching endpoint (if needed)
app.post('/get-location', async (req, res) => {
  try {
    const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GOOGLE_MAPS_API_KEY}`);
    res.status(200).json(response.data.location);
  } catch (error) {
    console.error('Error fetching location:', error.message);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
