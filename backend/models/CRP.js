const mongoose = require('mongoose');

const crpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  address: { type: String, default: '' },
  village: { type: String, required: true },
  taluka: { type: String, default: '' },
  district: { type: String, default: '' },
  pincode: { type: String, default: '' },
  mobile: { type: String, required: true },
  assignedVillages: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('CRP', crpSchema);
