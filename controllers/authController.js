const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup Controller
async function signup(req, res) {
    const { username, password } = req.body;
  
    try {
      console.log("Received signup request for username:", username);
  
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'User created' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }
  

// Login Controller
async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    // Generate a JWT token
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: '1h',
    // });

    // res.status(200).json({ message: 'Login successful', token });
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
}

// Get User Profile (optional)
// async function getProfile(req, res) {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) {
//       return res.status(404).send('User not found');
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).send('Error fetching user profile: ' + error.message);
//   }
// }

module.exports = {
  signup,
  login,
//   getProfile,  // Optional, only if you implement this in your routes
};


