const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/doctors  — public
router.get('/', async (req, res) => {
  if (!req.isDbConnected) return res.json([]);
  try {
    const User = require('../models/User');
    const doctors = await User.find({ role: 'doctor' }).select('-password').sort({ name: 1 });
    return res.json(doctors.map(d => ({
      _id: d._id,
      name: d.name,
      email: d.email,
      specialty: d.specialty || 'General Practitioner',
      rating: d.rating || 4.8,
      isVerified: d.isVerified || false,
      description: d.description || `${d.name} is a dedicated specialist providing quality healthcare.`
    })));
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
