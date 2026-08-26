const Farmer = require('../models/Farmer');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    let farmer = await Farmer.findOne({ userId: req.user.id });
    if (!farmer) {
      const user = await User.findById(req.user.id);
      farmer = await Farmer.create({ userId: user._id, fullName: user.name, mobile: user.mobile, village: user.village || '' });
    }
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body, isProfileComplete: true },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveDraft = async (req, res) => {
  try {
    const farmer = await Farmer.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { ...req.body, status: 'draft' } },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: farmer, message: 'Draft saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { ...req.body, status: 'submitted', isProfileComplete: true } },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: farmer, message: 'Profile submitted for approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadPhotos = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user.id });
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });

    const files = req.files || [];
    const urls = files.map(f => `uploads/${f.filename}`);

    if (req.body.type === 'farm') {
      farmer.farmPhotos = [...farmer.farmPhotos, ...urls];
    } else {
      farmer.productPhotos = [...farmer.productPhotos, ...urls];
    }
    await farmer.save();

    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user.id });
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    const { type, url } = req.body;
    if (type === 'farm') {
      farmer.farmPhotos = farmer.farmPhotos.filter(p => p !== url);
    } else {
      farmer.productPhotos = farmer.productPhotos.filter(p => p !== url);
    }
    await farmer.save();
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user.id });
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    if (!req.files || !req.files.length) return res.status(400).json({ success: false, message: 'No file uploaded' });
    farmer.profilePhoto = `uploads/${req.files[0].filename}`;
    await farmer.save();
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFarmers = async (req, res) => {
  try {
    const { page = 1, limit = 10, village, taluka, district, status, search } = req.query;
    const query = {};
    if (village) query.village = village;
    if (taluka) query.taluka = taluka;
    if (district) query.district = district;
    if (status) query.status = status;
    if (search) query.fullName = { $regex: search, $options: 'i' };

    const total = await Farmer.countDocuments(query);
    const farmers = await Farmer.find(query)
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: farmers,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id).populate('userId', 'name email mobile');
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.user.id, approvedAt: Date.now() },
      { new: true }
    );
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: farmer, message: 'Farmer approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', approvedBy: req.user.id, approvedAt: Date.now() },
      { new: true }
    );
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: farmer, message: 'Farmer rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
