const Farmer = require('../models/Farmer');
const MahilaGroup = require('../models/MahilaGroup');
const Product = require('../models/Product');
const CRP = require('../models/CRP');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalFarmers, totalGroups, totalCRPs, totalProducts, approvals, productStats, lowStockProducts] = await Promise.all([
      Farmer.countDocuments(),
      MahilaGroup.countDocuments(),
      CRP.countDocuments(),
      Product.countDocuments(),
      Farmer.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $group: { _id: null, totalQuantity: { $sum: '$quantity' }, avgPrice: { $avg: '$price' } } },
      ]),
      Product.find({ quantity: { $lte: 10 }, status: 'available' }).select('name quantity unit').limit(5),
    ]);

    const villages = await Farmer.distinct('village');
    const approvalMap = {};
    approvals.forEach((a) => { approvalMap[a._id] = a.count; });

    const groupApprovals = await MahilaGroup.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    groupApprovals.forEach((a) => { approvalMap[a._id] = (approvalMap[a._id] || 0) + a.count; });

    const totalQuantity = productStats[0]?.totalQuantity || 0;
    const categorySummary = await Product.aggregate([
      { $group: { _id: '$category', totalProducts: { $sum: 1 }, totalQuantity: { $sum: '$quantity' }, avgPrice: { $avg: '$price' } } },
      { $sort: { totalQuantity: -1 } },
    ]);

    const pendingProducts = await Product.find({ isApproved: false })
      .populate('userId', 'name role')
      .sort({ createdAt: -1 })
      .limit(10);

    const products = await Product.find()
      .populate('userId', 'name role')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        totalFarmers,
        totalGroups,
        totalCRPs,
        totalProducts,
        totalQuantity,
        totalVillages: villages.filter(Boolean).length,
        approvals: {
          approved: (approvalMap.approved || 0),
          submitted: (approvalMap.submitted || 0),
          rejected: (approvalMap.rejected || 0),
          draft: (approvalMap.draft || 0),
        },
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        categorySummary,
        pendingProducts,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVillageReports = async (req, res) => {
  try {
    const [farmerVillages, groupVillages] = await Promise.all([
      Farmer.aggregate([
        { $group: { _id: '$village', totalFarmers: { $sum: 1 }, avgIncome: { $avg: { $toDouble: '$annualIncome' } } } },
        { $sort: { totalFarmers: -1 } },
        { $limit: 50 },
      ]),
      MahilaGroup.aggregate([
        { $group: { _id: '$village', totalGroups: { $sum: 1 }, totalMembers: { $sum: { $size: { $ifNull: ['$members', []] } } } } },
      ]),
    ]);

    const groupMap = {};
    groupVillages.forEach((g) => { groupMap[g._id] = g; });

    const merged = farmerVillages.map((f) => ({
      _id: f._id,
      totalFarmers: f.totalFarmers,
      totalGroups: groupMap[f._id]?.totalGroups || 0,
      totalMembers: groupMap[f._id]?.totalMembers || 0,
      avgIncome: Math.round(f.avgIncome || 0),
    }));

    res.json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCropReports = async (req, res) => {
  try {
    const [summerCrops, monsoonCrops] = await Promise.all([
      Farmer.aggregate([
        { $unwind: { path: '$summerCrops', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$summerCrops', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Farmer.aggregate([
        { $unwind: { path: '$monsoonCrops', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$monsoonCrops', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({ success: true, data: { summerCrops, monsoonCrops } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getIncomeReports = async (req, res) => {
  try {
    const incomeData = await Farmer.aggregate([
      { $match: { annualIncome: { $ne: '' } } },
      {
        $addFields: {
          incomeRange: {
            $switch: {
              branches: [
                { case: { $lt: [{ $toDouble: '$annualIncome' }, 50000] }, then: 'below_50000' },
                { case: { $lt: [{ $toDouble: '$annualIncome' }, 100000] }, then: '50000_100000' },
                { case: { $lt: [{ $toDouble: '$annualIncome' }, 200000] }, then: '100000_200000' },
                { case: { $lt: [{ $toDouble: '$annualIncome' }, 300000] }, then: '200000_300000' },
                { case: { $lt: [{ $toDouble: '$annualIncome' }, 500000] }, then: '300000_500000' },
              ],
              default: 'above_500000',
            },
          },
        },
      },
      { $group: { _id: '$incomeRange', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data: incomeData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStockReports = async (req, res) => {
  try {
    const stockData = await Product.aggregate([
      { $group: { _id: '$category', totalProducts: { $sum: 1 }, totalQuantity: { $sum: '$quantity' }, avgPrice: { $avg: '$price' } } },
      { $sort: { totalQuantity: -1 } },
    ]);

    res.json({ success: true, data: stockData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMonthlyReports = async (req, res) => {
  try {
    const [farmers, groups] = await Promise.all([
      Farmer.aggregate([
        { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      MahilaGroup.aggregate([
        { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({ success: true, data: { farmers, groups } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportFarmersCSV = async (req, res) => {
  try {
    const farmers = await Farmer.find().populate('userId', 'name email mobile').lean();

    const csvHeaders = ['Name', 'Mobile', 'Village', 'Taluka', 'District', 'Land Area', 'Farming Type', 'Annual Income', 'Status'];
    const csvRows = farmers.map((f) => [
      f.fullName, f.mobile, f.village, f.taluka, f.district, f.landArea,
      f.farmingType, f.annualIncome, f.status,
    ].map((v) => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','));

    const csv = [csvHeaders.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=farmers-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportMahilaGroupsCSV = async (req, res) => {
  try {
    const groups = await MahilaGroup.find().populate('userId', 'name email mobile').lean();

    const csvHeaders = ['Group Name', 'Contact', 'Village', 'Taluka', 'District', 'Members', 'Annual Income', 'Status'];
    const csvRows = groups.map((g) => [
      g.groupName, g.contactNumber, g.village, g.taluka, g.district,
      g.members?.length || 0, g.annualIncome, g.status,
    ].map((v) => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','));

    const csv = [csvHeaders.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=mahila-groups-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
