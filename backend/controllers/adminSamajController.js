const Samaj = require('../models/Samaj');

exports.getAllSamajAdmin = async (req, res) => {
  try {
    const samajList = await Samaj.find().sort({ createdAt: -1 });
    const total = samajList.length;
    const active = samajList.filter(s => s.isActive).length;
    const inactive = total - active;
    const approved = samajList.filter(s => s.verificationStatus === 'approved').length;
    const rejected = samajList.filter(s => s.verificationStatus === 'rejected').length;
    const pending = total - approved - rejected;
    res.status(200).json({ success: true, data: samajList, total, active, inactive, approved, pending, rejected });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSamajByIdAdmin = async (req, res) => {
  try {
    const samaj = await Samaj.findById(req.params.id);
    if (!samaj) return res.status(404).json({ success: false, message: 'Samaj not found' });
    res.status(200).json({ success: true, data: samaj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSamajAdmin = async (req, res) => {
  try {
    const samaj = await Samaj.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!samaj) return res.status(404).json({ success: false, message: 'Samaj not found' });
    res.status(200).json({ success: true, data: samaj });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteSamajAdmin = async (req, res) => {
  try {
    const samaj = await Samaj.findByIdAndDelete(req.params.id);
    if (!samaj) return res.status(404).json({ success: false, message: 'Samaj not found' });
    res.status(200).json({ success: true, message: 'Samaj deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleSamajStatus = async (req, res) => {
  try {
    const samaj = await Samaj.findById(req.params.id);
    if (!samaj) return res.status(404).json({ success: false, message: 'Samaj not found' });
    samaj.isActive = !samaj.isActive;
    await samaj.save();
    res.status(200).json({ success: true, data: samaj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.setSamajVerificationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }
    const samaj = await Samaj.findById(req.params.id);
    if (!samaj) return res.status(404).json({ success: false, message: 'Samaj not found' });
    samaj.verificationStatus = status;
    await samaj.save();
    res.status(200).json({ success: true, data: samaj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
