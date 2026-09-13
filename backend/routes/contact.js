const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  if (!req.isDbConnected) return res.status(503).json({ message: 'DB not connected' });
  try {
    const C = require('../models/ContactMessage');
    res.json(await new C(req.body).save());
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.get('/', auth, async (req, res) => {
  if (!req.isDbConnected) return res.json({ data: [] });
  try {
    const C = require('../models/ContactMessage');
    res.json({ data: await C.find().sort({ createdAt: -1 }) });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id/mark-read', auth, async (req, res) => {
  if (!req.isDbConnected) return res.status(503).json({ message: 'DB not connected' });
  try {
    const C = require('../models/ContactMessage');
    res.json(await C.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true }));
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  if (!req.isDbConnected) return res.status(503).json({ message: 'DB not connected' });
  try {
    const C = require('../models/ContactMessage');
    await C.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
