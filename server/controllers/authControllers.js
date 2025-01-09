// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }
  if (user.role !== role) {
    return res.status(403).json({ message: 'Invalid role for this user.' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
};

const register = async (req, res) => {
  const { email, password, role, name, gender, dob, contactDetails } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const user = new User({ email, password, role, name, gender, dob, contactDetails });
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } });
};

module.exports = { login, register };