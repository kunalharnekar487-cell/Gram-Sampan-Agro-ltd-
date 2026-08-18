const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: '' },
  forRole: { type: String, enum: ['admin', 'crp', 'farmer', 'mahila', 'all'], default: 'all' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
