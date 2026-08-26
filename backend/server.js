const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmers');
const mahilaGroupRoutes = require('./routes/mahilaGroups');
const productRoutes = require('./routes/products');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const chatbotRoutes = require('./routes/chatbot');

const app = express();

connectDB();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) callback(null, true);
  else callback(new Error('Not allowed by CORS'));
}, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { success: false, message: 'Too many requests' } });
app.use('/api/auth', limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/mahila-groups', mahilaGroupRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Gram Sampan Agro Ltd API is running', timestamp: new Date().toISOString() });
});

app.get('/api/smtp-status', (req, res) => {
  res.json({
    emailService: process.env.BREVO_API_KEY ? 'Brevo HTTP API' : 'not configured',
    brevoApiKey: process.env.BREVO_API_KEY ? '****configured****' : 'not set',
    fromEmail: process.env.FROM_EMAIL || 'not set',
    fromName: process.env.FROM_NAME || 'not set',
  });
});

app.post('/api/test-email', async (req, res) => {
  const { sendEmail } = require('./utils/email');
  const { to } = req.body;
  if (!to) return res.status(400).json({ success: false, message: 'Email address required in body: {"to":"email@example.com"}' });
  try {
    const info = await sendEmail({
      email: to,
      subject: 'Test Email - Gram Sampan Agro Ltd',
      html: '<h1 style="color:#2E7D32">Email is working!</h1><p>Your SMTP configuration is correct.</p>',
    });
    res.json({ success: true, message: 'Test email sent', messageId: info.messageId });
  } catch (error) {
    console.error('Test email failed:', error.message);
    res.status(500).json({ success: false, message: 'Email failed: ' + error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
