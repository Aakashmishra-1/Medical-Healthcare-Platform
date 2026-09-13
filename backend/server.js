const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://healthmedicare.netlify.app'
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
let isDbConnected = false;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    isDbConnected = true;
  })
  .catch(() => {
    console.log('⚠️ MongoDB not connected - running in DEMO mode');
    console.log('   Fix: Set your Atlas URI in backend/.env');
    console.log('   Free MongoDB: https://cloud.mongodb.com\n');
  });

app.use((req, res, next) => {
  req.isDbConnected = isDbConnected;
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/medical', require('./routes/medical'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/messages', require('./routes/messages'));

app.get('/', (req, res) => {
  res.json({
    status: 'Healthcare API Running',
    dbConnected: isDbConnected
  });
});

io.on('connection', (socket) => {

  socket.on('join_room', ({ email }) => {
    if (email) socket.join(email);
  });

  socket.on('send_direct_message', (msg) => {
    io.to(msg.receiverEmail).emit('receive_direct_message', msg);
    socket.emit('receive_direct_message', msg);
  });

  socket.on('new_appointment_booked', (appt) => {
    io.to(appt.doctorEmail).emit('new_appointment', appt);
  });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});