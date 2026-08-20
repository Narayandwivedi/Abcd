const AgraAlankaran = require('../models/AgraAlankaran');

const normalizeApplication = (data = {}) => {
  const allowed = [
    'awardCategory', 'applicantName', 'dob', 'age', 'fatherHusbandName',
    'fullAddress', 'mobileNo', 'email', 'achievementDesc', 'date', 'place',
  ];
  const cleaned = {};
  allowed.forEach((key) => {
    if (data[key] !== undefined) {
      cleaned[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
    }
  });
  return cleaned;
};

exports.getAllAgraAlankaran = async (req, res) => {
  try {
    const applications = await AgraAlankaran.find().sort({ createdAt: -1 });
    const total = applications.length;
    const pending = applications.filter((a) => a.status === 'pending').length;
    const approved = applications.filter((a) => a.status === 'approved').length;
    const rejected = applications.filter((a) => a.status === 'rejected').length;
    res.status(200).json({ success: true, data: applications, total, pending, approved, rejected });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAgraAlankaranById = async (req, res) => {
  try {
    const application = await AgraAlankaran.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAgraAlankaran = async (req, res) => {
  try {
    const application = await AgraAlankaran.findByIdAndUpdate(
      req.params.id,
      normalizeApplication(req.body),
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteAgraAlankaran = async (req, res) => {
  try {
    const application = await AgraAlankaran.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.setAgraAlankaranStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const application = await AgraAlankaran.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    application.status = status;
    application.rejectionReason = status === 'rejected' ? (rejectionReason || '') : undefined;
    await application.save();
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};