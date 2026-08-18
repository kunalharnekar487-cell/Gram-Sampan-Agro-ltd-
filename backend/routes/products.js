const express = require('express');
const { createProduct, getMyProducts, getAllProducts, updateProduct, deleteProduct, approveProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('farmer', 'mahila'), createProduct);
router.get('/my', protect, authorize('farmer', 'mahila'), getMyProducts);
router.get('/', getAllProducts);
router.put('/:id', protect, authorize('farmer', 'mahila'), updateProduct);
router.delete('/:id', protect, authorize('farmer', 'mahila', 'admin'), deleteProduct);
router.put('/:id/approve', protect, authorize('admin', 'crp'), approveProduct);

module.exports = router;
