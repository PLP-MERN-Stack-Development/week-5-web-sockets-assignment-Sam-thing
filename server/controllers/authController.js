const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @route POST /api/register
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    const token = generateToken(user._id);
    const userData = { id: user._id, username: user.username, email: user.email };

    res.status(201).json({ token, user: userData });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// @route POST /api/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    const userData = { id: user._id, username: user.username, email: user.email };

    res.status(200).json({ token, user: userData });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { registerUser, loginUser };
