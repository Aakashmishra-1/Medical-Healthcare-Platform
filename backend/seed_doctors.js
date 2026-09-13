/**
 * DOCTORS SEED FILE
 * ==================
 * Run this AFTER setting your MONGO_URI in .env to add 10 doctors to MongoDB.
 * Command: node seed_doctors.js
 *
 * Each doctor can login with their email and password: Doctor@1234
 * Admin can manage them via the Admin Dashboard.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  role: { type: String, default: 'doctor' },
  specialty: String, description: String, rating: Number,
  isVerified: Boolean, experience: Number, location: String,
  createdAt: { type: Date, default: Date.now }
});
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
const Doctor = mongoose.model('User', doctorSchema);

const doctors = [
  {
    name: 'Dr. Rajesh Koothrappali',
    email: 'rajesh.koothrappali@medicare.com',
    password: 'Doctor@1234',
    specialty: 'Cardiologist',
    description: 'Renowned cardiologist with 15+ years experience in diagnosing and treating heart diseases, arrhythmias, and hypertension.',
    rating: 4.9, isVerified: true, experience: 15, location: 'Downtown Medical Center'
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@medicare.com',
    password: 'Doctor@1234',
    specialty: 'Dermatologist',
    description: 'Expert dermatologist specializing in skin conditions, cosmetic procedures, and chronic skin diseases like eczema and psoriasis.',
    rating: 4.8, isVerified: true, experience: 10, location: 'West Plaza Clinic'
  },
  {
    name: 'Dr. Amit Patel',
    email: 'amit.patel@medicare.com',
    password: 'Doctor@1234',
    specialty: 'Neurologist',
    description: 'Leading neurologist treating migraines, epilepsy, Parkinsons, and stroke with evidence-based approaches.',
    rating: 4.9, isVerified: true, experience: 18, location: 'Neurology Institute'
  },
  {
    name: 'Dr. Anjali Gupta',
    email: 'anjali.gupta@medicare.com',
    password: 'Doctor@1234',
    specialty: 'Pediatrician',
    description: 'Compassionate pediatrician dedicated to child health from newborns to adolescents, including vaccinations and development.',
    rating: 5.0, isVerified: true, experience: 12, location: 'Childrens Health Center'
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@medicare.com',
    password: 'Doctor@1234',
    specialty: 'Orthopedic Surgeon',
    description: 'Expert in bone, joint, and spine surgery including knee replacements, fracture repair, and sports injury treatment.',
    rating: 4.7, isVerified: true, experience: 14, location: 'Orthopedic & Spine Center'
  },
  {
    name: 'Dr. Neha Kapoor',
    email: 'neha.kapoor@medicare.com',
    password: 'Doctor@1234',
    specialty: 'Gynecologist',
    description: 'Dedicated OB-GYN specializing in womens health, pregnancy care, fertility treatment, and minimally invasive surgery.',
    rating: 4.8, isVerified: true, experience: 11, location: 'Women\'s Health Clinic'
  },
  {
    name: 'Dr. Sanjay Verma',
    email: 'sanjay.verma@medicare.com',
    password: 'Doctor@1234',
    specialty: 'Oncologist',
    description: 'Cancer specialist with expertise in chemotherapy, immunotherapy, and targeted therapy for various types of cancer.',
    rating: 4.9, isVerified: true, experience: 20, location: 'Cancer Care Institute'
  },
  {
    name: 'Dr. Meera Reddy',
    email: 'meera.reddy@medicare.com',
    password: 'Doctor@1234',
    specialty: 'Psychiatrist',
    description: 'Board-certified psychiatrist treating depression, anxiety, PTSD, bipolar disorder, and other mental health conditions.',
    rating: 4.8, isVerified: true, experience: 9, location: 'Mind & Wellness Center'
  },
  {
    name: 'Dr. Arjun Nair',
    email: 'arjun.nair@medicare.com',
    password: 'Doctor@1234',
    specialty: 'General Surgeon',
    description: 'Experienced general surgeon specializing in laparoscopic surgeries, appendectomies, hernia repair, and abdominal procedures.',
    rating: 4.7, isVerified: true, experience: 16, location: 'City General Hospital'
  },
  {
    name: 'Dr. Kavita Malhotra',
    email: 'kavita.malhotra@medicare.com',
    password: 'Doctor@1234',
    specialty: 'ENT Specialist',
    description: 'Expert ENT surgeon treating ear infections, sinus disorders, tonsillitis, hearing loss, and thyroid conditions.',
    rating: 4.6, isVerified: true, experience: 13, location: 'ENT & Head Neck Center'
  }
];

async function seedDoctors() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!\n');

    let added = 0, skipped = 0;
    for (const d of doctors) {
      const exists = await Doctor.findOne({ email: d.email });
      if (exists) { console.log(`⏭  Skipped (already exists): ${d.name}`); skipped++; continue; }
      await new Doctor(d).save();
      console.log(`✅ Added: ${d.name} — ${d.specialty}`);
      added++;
    }

    console.log(`\n📊 Done! Added: ${added}, Skipped: ${skipped}`);
    console.log('🔑 All doctors password: Doctor@1234');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seedDoctors();
