const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/patient/:email', auth, async (req, res) => {
  if (!req.isDbConnected) return res.json({ records: [] });
  try {
    const M = require('../models/MedicalRecord');
    res.json({ records: await M.find({ patientEmail: req.params.email }).sort({ recordDate: -1 }) });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.get('/doctor/:email', auth, async (req, res) => {
  if (!req.isDbConnected) return res.json({ records: [] });
  try {
    const M = require('../models/MedicalRecord');
    res.json({ records: await M.find({ doctorEmail: req.params.email }).sort({ recordDate: -1 }) });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.get('/', auth, async (req, res) => {
  if (!req.isDbConnected) return res.json({ records: [] });
  try {
    const M = require('../models/MedicalRecord');
    res.json({ records: await M.find().sort({ recordDate: -1 }) });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  if (!req.isDbConnected) return res.status(503).json({ message: 'DB not connected' });
  try {
    const M = require('../models/MedicalRecord');
    const rec = new M(req.body);
    await rec.save();
    res.json(rec);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  if (!req.isDbConnected) return res.status(503).json({ message: 'DB not connected' });
  try {
    const M = require('../models/MedicalRecord');
    await M.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
