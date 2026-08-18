const express = require('express');
const { register, login, getMe, sendOTP, verifyOTP, forgotPassword, resetPassword, updatePassword, updateProfile, sendRegistrationOTP, verifyRegistrationOTP } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/register/send-otp', sendRegistrationOTP);
router.post('/register/verify', verifyRegistrationOTP);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/update-password', protect, updatePassword);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
