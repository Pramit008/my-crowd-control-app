// server.js or app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('your_mongodb_connection_string', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String, // Placeholder for now, can be ignored
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.send({ message: 'User registered successfully' });
});

// Login route
app.post('/login', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        res.send({ message: 'Login successful', user });
    } else {
        res.status(400).send({ message: 'User not found' });
    }
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
