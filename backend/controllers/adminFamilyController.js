const Family = require('../models/Family');

exports.getAllFamiliesAdmin = async (req, res) => {
  try {
    const families = await Family.find().sort({ createdAt: -1 });
    const total = families.length;
    const active = families.filter(f => f.isActive).length;
    const inactive = total - active;
    res.status(200).json({ success: true, data: families, total, active, inactive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFamilyByIdAdmin = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) return res.status(404).json({ success: false, message: 'Family not found' });
    res.status(200).json({ success: true, data: family });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFamilyAdmin = async (req, res) => {
  try {
    const family = await Family.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!family) return res.status(404).json({ success: false, message: 'Family not found' });
    res.status(200).json({ success: true, data: family });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteFamilyAdmin = async (req, res) => {
  try {
    const family = await Family.findByIdAndDelete(req.params.id);
    if (!family) return res.status(404).json({ success: false, message: 'Family not found' });
    res.status(200).json({ success: true, message: 'Family deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleFamilyStatus = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) return res.status(404).json({ success: false, message: 'Family not found' });
    family.isActive = !family.isActive;
    await family.save();
    res.status(200).json({ success: true, data: family });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
