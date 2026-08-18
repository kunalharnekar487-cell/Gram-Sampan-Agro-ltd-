const User = require('../models/User');
const Farmer = require('../models/Farmer');
const MahilaGroup = require('../models/MahilaGroup');
const CRP = require('../models/CRP');
const { generateOTP } = require('../utils/helpers');
const { sendOTPEmail, sendWelcomeEmail, sendForgotPasswordOTPEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

const regOTPStore = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of regOTPStore) {
    if (val.expiresAt < now) regOTPStore.delete(key);
  }
}, 60000);

const createTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  res.status(statusCode).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role } });
};

exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, role, village, taluka, district } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (exists) return res.status(400).json({ success: false, message: 'User already exists with this email or mobile' });

    const user = await User.create({ name, email, mobile, password, role, village, taluka, district, isVerified: true });

    if (role === 'farmer') {
      await Farmer.create({ userId: user._id, fullName: name, mobile, village, taluka, district });
    } else if (role === 'mahila') {
      await MahilaGroup.create({ userId: user._id, groupName: name, contactNumber: mobile, village, taluka, district });
    } else if (role === 'crp') {
      await CRP.create({ userId: user._id, fullName: name, mobile, village, taluka, district });
    }

    createTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendRegistrationOTP = async (req, res) => {
  try {
    const { name, email, mobile, role, village, taluka, district } = req.body;
    if (!email && !mobile) return res.status(400).json({ success: false, message: 'Email or mobile is required' });

    const exists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (exists) return res.status(400).json({ success: false, message: 'User already exists with this email or mobile' });

    const otp = generateOTP();
    const key = email || mobile;

    regOTPStore.set(key, {
      data: { name, email, mobile, role, village, taluka, district },
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    let emailSent = false;
    let emailError = null;
    if (email && process.env.SMTP_EMAIL) {
      try {
        await sendOTPEmail(email, otp, name);
        emailSent = true;
        console.log(`OTP email sent to ${email}: ${otp}`);
      } catch (err) {
        emailError = err.message;
        console.error('Email send failed:', err.message);
      }
    }

    res.json({
      success: true,
      message: emailSent ? 'OTP sent successfully' : (emailError ? `OTP created but email failed: ${emailError}` : 'OTP created (email not configured)'),
      sentTo: email || mobile,
      emailSent,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, mobile, otp, password } = req.body;
    const key = email || mobile;

    const stored = regOTPStore.get(key);
    if (!stored) return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
    if (Date.now() > stored.expiresAt) {
      regOTPStore.delete(key);
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }
    if (stored.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    const { data } = stored;
    regOTPStore.delete(key);

    const user = await User.create({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      password,
      role: data.role,
      village: data.village || '',
      taluka: data.taluka || '',
      district: data.district || '',
      isVerified: true,
    });

    if (data.role === 'farmer') {
      await Farmer.create({ userId: user._id, fullName: data.name, mobile: data.mobile, village: data.village || '', taluka: data.taluka || '', district: data.district || '' });
    } else if (data.role === 'mahila') {
      await MahilaGroup.create({ userId: user._id, groupName: data.name, contactNumber: data.mobile, village: data.village || '', taluka: data.taluka || '', district: data.district || '' });
    } else if (data.role === 'crp') {
      await CRP.create({ userId: user._id, fullName: data.name, mobile: data.mobile, village: data.village || '', taluka: data.taluka || '', district: data.district || '' });
    }

    if (data.email && process.env.SMTP_EMAIL) {
      sendWelcomeEmail(data.email, data.name).catch(() => {});
    }

    createTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { mobile, email, password } = req.body;
    if ((!mobile && !email) || !password) return res.status(400).json({ success: false, message: 'Please provide mobile/email and password' });

    const query = mobile ? { mobile } : { email };
    const user = await User.findOne(query).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    createTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;
    if (user.role === 'farmer') profile = await Farmer.findOne({ userId: user._id });
    else if (user.role === 'mahila') profile = await MahilaGroup.findOne({ userId: user._id });
    else if (user.role === 'crp') profile = await CRP.findOne({ userId: user._id });

    res.json({ success: true, data: { user, profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await User.findOne({
      mobile,
      otp,
      otpExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    createTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { mobile, email } = req.body;
    if (!mobile && !email) return res.status(400).json({ success: false, message: 'Mobile or email is required' });

    const query = mobile ? { mobile } : { email };
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const sentTo = mobile || email;
    if (email && process.env.SMTP_EMAIL) {
      sendForgotPasswordOTPEmail(email, otp, user.name).catch(() => {});
    }

    res.json({ success: true, message: 'OTP sent for password reset', sentTo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { mobile, email, otp, password } = req.body;
    const query = mobile ? { mobile } : { email };
    const user = await User.findOne({
      ...query,
      otp,
      otpExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    user.password = password;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    const { currentPassword, newPassword } = req.body;

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    createTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'address', 'village', 'taluka', 'district', 'pincode', 'profileImage'];
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });

    if (req.user.role === 'farmer') {
      await Farmer.findOneAndUpdate({ userId: req.user.id }, { $set: { fullName: updates.name, address: updates.address, village: updates.village, taluka: updates.taluka, district: updates.district, pincode: updates.pincode } });
    } else if (req.user.role === 'mahila') {
      await MahilaGroup.findOneAndUpdate({ userId: req.user.id }, { $set: { groupName: updates.name, address: updates.address, village: updates.village, taluka: updates.taluka, district: updates.district, pincode: updates.pincode } });
    } else if (req.user.role === 'crp') {
      await CRP.findOneAndUpdate({ userId: req.user.id }, { $set: { fullName: updates.name, address: updates.address, village: updates.village, taluka: updates.taluka, district: updates.district, pincode: updates.pincode } });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
