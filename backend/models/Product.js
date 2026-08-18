const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userRole: { type: String, enum: ['farmer', 'mahila'], required: true },
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'grains', 'spices', 'pickles', 'papad', 'masala', 'handmade', 'organic', 'other'],
    required: true,
  },
  description: { type: String, default: '' },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  images: [{ type: String }],
  village: { type: String, default: '' },
  status: { type: String, enum: ['available', 'out_of_stock', 'discontinued'], default: 'available' },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
