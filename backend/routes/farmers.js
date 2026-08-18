const express = require('express');
const { getProfile, updateProfile, saveDraft, submitProfile, uploadPhotos, getFarmers, getFarmerById, approveFarmer, rejectFarmer } = require('../controllers/farmerController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/profile', protect, authorize('farmer', 'crp', 'admin'), getProfile);
router.put('/profile', protect, authorize('farmer'), updateProfile);
router.post('/draft', protect, authorize('farmer'), saveDraft);
router.post('/submit', protect, authorize('farmer'), submitProfile);
router.post('/upload-photos', protect, authorize('farmer'), upload.array('photos', 10), uploadPhotos);
router.get('/', protect, authorize('crp', 'admin'), getFarmers);
router.get('/:id', protect, authorize('crp', 'admin'), getFarmerById);
router.put('/:id/approve', protect, authorize('admin', 'crp'), approveFarmer);
router.put('/:id/reject', protect, authorize('admin', 'crp'), rejectFarmer);

module.exports = router;
