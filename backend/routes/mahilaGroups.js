const express = require('express');
const { getProfile, updateProfile, saveDraft, submitProfile, uploadImages, deleteImage, getGroups, getGroupById, approveGroup, rejectGroup } = require('../controllers/mahilaGroupController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/profile', protect, authorize('mahila', 'crp', 'admin'), getProfile);
router.put('/profile', protect, authorize('mahila'), updateProfile);
router.post('/draft', protect, authorize('mahila'), saveDraft);
router.post('/submit', protect, authorize('mahila'), submitProfile);
router.post('/upload-images', protect, authorize('mahila'), upload.array('images', 10), uploadImages);
router.delete('/delete-image', protect, authorize('mahila'), deleteImage);
router.get('/', protect, authorize('crp', 'admin'), getGroups);
router.get('/:id', protect, authorize('crp', 'admin'), getGroupById);
router.put('/:id/approve', protect, authorize('admin', 'crp'), approveGroup);
router.put('/:id/reject', protect, authorize('admin', 'crp'), rejectGroup);

module.exports = router;
