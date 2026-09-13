const mongoose = require('mongoose');

const medSchema = new mongoose.Schema({
  patientEmail: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorEmail: { type: String, required: true },
  recordType: { type: String, default: 'General' },
  diagnosis: { type: String, required: true },
  treatment: String,
  medications: [{ name: String, dosage: String, frequency: String, duration: String }],
  recordDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', medSchema);
