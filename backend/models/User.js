const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  // Doctor-specific fields
  specialty:    { type: String, default: '' },
  description:  { type: String, default: '' },
  rating:       { type: Number, default: 4.8 },
  isVerified:   { type: Boolean, default: false },
  experience:   { type: Number, default: 0 },
  location:     { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
