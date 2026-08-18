const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  mobile: { type: String, required: [true, 'Mobile number is required'], unique: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { type: String, enum: ['admin', 'crp', 'farmer', 'mahila'], default: 'farmer' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpire: Date,
  refreshToken: String,
  lastLogin: Date,
  profileImage: { type: String, default: '' },
  address: { type: String, default: '' },
  village: { type: String, default: '' },
  taluka: { type: String, default: '' },
  district: { type: String, default: '' },
  pincode: { type: String, default: '' },
}, { timestamps: true, discriminatorKey: 'role' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  return require('jsonwebtoken').sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = mongoose.model('User', userSchema);
