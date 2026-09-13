const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/patient/:email', auth, async (req, res) => {
  if (!req.isDbConnected) return res.json({ data: [] });
  try {
    const A = require('../models/Appointment');
    res.json({ data: await A.find({ patientEmail: req.params.email }).sort({ createdAt: -1 }) });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.get('/doctor/:email', auth, async (req, res) => {
  if (!req.isDbConnected) return res.json({ data: [] });
  try {
    const A = require('../models/Appointment');
    res.json({ data: await A.find({ doctorEmail: req.params.email }).sort({ createdAt: -1 }) });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.get('/', auth, async (req, res) => {
  if (!req.isDbConnected) return res.json({ data: [] });
  try {
    const A = require('../models/Appointment');
    res.json({ data: await A.find().sort({ createdAt: -1 }) });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  if (!req.isDbConnected) return res.status(503).json({ message: 'DB not connected' });
  try {
    const A = require('../models/Appointment');
    const appt = new A(req.body);
    await appt.save();
    res.json(appt);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', auth, async (req, res) => {
  if (!req.isDbConnected) return res.status(503).json({ message: 'DB not connected' });
  try {
    const A = require('../models/Appointment');
    res.json(await A.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  if (!req.isDbConnected) return res.status(503).json({ message: 'DB not connected' });
  try {
    const A = require('../models/Appointment');
    await A.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
