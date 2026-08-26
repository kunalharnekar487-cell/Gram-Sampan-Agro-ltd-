const MahilaGroup = require('../models/MahilaGroup');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    let group = await MahilaGroup.findOne({ userId: req.user.id });
    if (!group) {
      const user = await User.findById(req.user.id);
      group = await MahilaGroup.create({ userId: user._id, groupName: user.name, contactNumber: user.mobile, village: user.village || '' });
    }
    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const group = await MahilaGroup.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { ...req.body, isProfileComplete: true } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveDraft = async (req, res) => {
  try {
    const group = await MahilaGroup.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { ...req.body, status: 'draft' } },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: group, message: 'Draft saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitProfile = async (req, res) => {
  try {
    const group = await MahilaGroup.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { ...req.body, status: 'submitted', isProfileComplete: true } },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: group, message: 'Profile submitted for approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    const group = await MahilaGroup.findOne({ userId: req.user.id });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    const urls = (req.files || []).map(f => f.path);
    group.productImages = [...group.productImages, ...urls];
    await group.save();
    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const group = await MahilaGroup.findOne({ userId: req.user.id });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    const { url } = req.body;
    group.productImages = group.productImages.filter(p => p !== url);
    await group.save();
    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const { page = 1, limit = 10, village, taluka, district, status, search } = req.query;
    const query = {};
    if (village) query.village = village;
    if (taluka) query.taluka = taluka;
    if (district) query.district = district;
    if (status) query.status = status;
    if (search) query.groupName = { $regex: search, $options: 'i' };

    const total = await MahilaGroup.countDocuments(query);
    const groups = await MahilaGroup.find(query)
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: groups, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await MahilaGroup.findById(req.params.id).populate('userId', 'name email mobile');
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveGroup = async (req, res) => {
  try {
    const group = await MahilaGroup.findByIdAndUpdate(req.params.id, { status: 'approved', approvedBy: req.user.id, approvedAt: Date.now() }, { new: true });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, data: group, message: 'Group approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectGroup = async (req, res) => {
  try {
    const group = await MahilaGroup.findByIdAndUpdate(req.params.id, { status: 'rejected', approvedBy: req.user.id, approvedAt: Date.now() }, { new: true });
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, data: group, message: 'Group rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
