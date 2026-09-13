const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: String,
  patientEmail: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorId: String,
  doctorEmail: { type: String, required: true },
  doctorName: { type: String, required: true },
  specialization: String,
  appointmentDate: String,
  timeSlot: String,
  reason: String,
  status: { type: String, enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
