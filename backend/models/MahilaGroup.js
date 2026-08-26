const mongoose = require('mongoose');

const mahilaGroupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groupName: { type: String, required: true },
  address: { type: String, default: '' },
  village: { type: String, required: true },
  taluka: { type: String, default: '' },
  district: { type: String, default: '' },
  pincode: { type: String, default: '' },
  contactNumber: { type: String, required: true },
  members: [{ name: String, age: String, role: String, mobile: String }],
  productsManufactured: [{ type: String }],
  machinesAvailable: [{ name: String, quantity: String }],
  annualIncome: { type: String, default: '' },
  villagePopulation: { type: String, default: '' },
  landArea: { type: String, default: '' },
  sellingMethod: { type: String, default: '' },
  problems: { type: String, default: '' },
  supportNeeded: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  productImages: [{ type: String }],
  status: { type: String, enum: ['draft', 'submitted', 'approved', 'rejected'], default: 'draft' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  isProfileComplete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('MahilaGroup', mahilaGroupSchema);
