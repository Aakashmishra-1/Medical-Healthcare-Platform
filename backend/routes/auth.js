const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function makeToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
function userPayload(u) {
  return { id: u._id, username: u.name, email: u.email, role: u.role };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
  if (!req.isDbConnected) return res.status(503).json({ message: 'Database not connected. Please configure MongoDB Atlas in .env file.' });

  try {
    const User = require('../models/User');
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists with this email' });
    const user = new User({ name, email, password, role: role || 'patient' });
    await user.save();
    const token = makeToken(user);
    return res.json({ token, user: userPayload(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  if (!req.isDbConnected) return res.status(503).json({ message: 'Database not connected. Please configure MongoDB Atlas in .env file.' });

  try {
    const User = require('../models/User');
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    const token = makeToken(user);
    return res.json({ token, user: userPayload(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/admin-login  (separate admin endpoint)
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  if (!req.isDbConnected) return res.status(503).json({ message: 'Database not connected.' });

  try {
    const User = require('../models/User');
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) return res.status(400).json({ message: 'Admin account not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = makeToken(user);
    return res.json({ token, user: userPayload(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
