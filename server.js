require('dotenv').config();
const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// import routes
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const locationRoutes = require('./routes/locationRoutes');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connex
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// declare in its own model file ???
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model('User', userSchema);

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

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username, password });
//     if (user) {
//       res.status(200).send('Login successful');
//     } else {
//       res.status(400).send('Invalid credentials');
//     }
//   } catch (error) {
//     res.status(500).send('Server error: ' + error.message);
//   }
// });


// use routes
app.use('/auth', authRoutes);  // This would prefix all routes in authRoutes with '/auth'
app.use('/tickets', ticketRoutes); 
app.use('/location', locationRoutes);




// // app.post('/get-location', ...)
// app.post('/get-location', async (req, res) => {
//     try {
//       const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GOOGLE_MAPS_API_KEY}`);
//       res.status(200).json(response.data.location);
//     } catch (error) {
//       console.error('Error fetching location:', error.message);
//       res.status(500).json({ error: 'Failed to fetch location' });
//     }
//   });
  

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
