const express = require('express');
const { getDashboardStats, getVillageReports, getCropReports, getIncomeReports, getStockReports, getMonthlyReports } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin', 'crp'), getDashboardStats);
router.get('/villages', protect, authorize('admin', 'crp'), getVillageReports);
router.get('/crops', protect, authorize('admin', 'crp'), getCropReports);
router.get('/income', protect, authorize('admin', 'crp'), getIncomeReports);
router.get('/stock', protect, authorize('admin', 'crp'), getStockReports);
router.get('/monthly', protect, authorize('admin', 'crp'), getMonthlyReports);
router.get('/export/farmers', protect, authorize('admin'), require('../controllers/reportController').exportFarmersCSV);
router.get('/export/mahila-groups', protect, authorize('admin'), require('../controllers/reportController').exportMahilaGroupsCSV);

module.exports = router;
