const User = require('../models/User');

// @route GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
    res.json(users);
  } catch (err) {
    console.error('Get Users Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

module.exports = { getUsers };
