const Family = require('../models/Family');

exports.createFamily = async (req, res) => {
  try {
    const family = await Family.create(req.body);
    res.status(201).json({ success: true, data: family });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllFamilies = async (req, res) => {
  try {
    const families = await Family.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: families });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFamilyById = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ success: false, message: 'Family not found' });
    }
    res.status(200).json({ success: true, data: family });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFamily = async (req, res) => {
  try {
    const family = await Family.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!family) {
      return res.status(404).json({ success: false, message: 'Family not found' });
    }
    res.status(200).json({ success: true, data: family });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteFamily = async (req, res) => {
  try {
    const family = await Family.findByIdAndDelete(req.params.id);
    if (!family) {
      return res.status(404).json({ success: false, message: 'Family not found' });
    }
    res.status(200).json({ success: true, message: 'Family deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
