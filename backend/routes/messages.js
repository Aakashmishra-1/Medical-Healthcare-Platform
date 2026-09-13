const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/:otherEmail', auth, async (req, res) => {
  if (!req.isDbConnected) return res.json({ messages: [] });
  try {
    const Msg = require('../models/Message');
    const myEmail = req.query.myEmail;
    const other = req.params.otherEmail;
    res.json({ messages: await Msg.find({ $or: [{ senderEmail: myEmail, receiverEmail: other }, { senderEmail: other, receiverEmail: myEmail }] }).sort({ timestamp: 1 }) });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  if (!req.isDbConnected) return res.status(503).json({ message: 'DB not connected' });
  try {
    const Msg = require('../models/Message');
    res.json(await new Msg(req.body).save());
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
