const mongoose = require('mongoose');
const User = require('./User');

const farmerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  address: { type: String, default: '' },
  village: { type: String, required: true },
  taluka: { type: String, default: '' },
  district: { type: String, default: '' },
  pincode: { type: String, default: '' },
  mobile: { type: String, required: true },
  landArea: { type: String, default: '' },
  farmingType: { type: String, enum: ['organic', 'chemical', 'mixed', ''], default: '' },
  summerCrops: [{ type: String }],
  monsoonCrops: [{ type: String }],
  sellingMethod: { type: String, default: '' },
  annualIncome: { type: String, default: '' },
  distanceFromHighway: { type: String, default: '' },
  villagePopulation: { type: String, default: '' },
  farmingProblems: { type: String, default: '' },
  supportRequired: { type: String, default: '' },
  farmPhotos: [{ type: String }],
  productPhotos: [{ type: String }],
  status: { type: String, enum: ['draft', 'submitted', 'approved', 'rejected'], default: 'draft' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  isProfileComplete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Farmer', farmerSchema);
