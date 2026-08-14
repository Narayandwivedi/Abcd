const AgraMahakumbh2026 = require('../models/AgraMahakumbh2026');

const normalizeRegistration = (data = {}) => {
  const allowed = [
    'fullName', 'gender', 'mobileNo', 'dob', 'age', 'fatherName', 'address',
    'registrationType', 'registrationFee', 'utrNumber', 'travelMode',
    'travelDetail', 'arrivalDate', 'arrivalTime',
  ];
  const cleaned = {};
  allowed.forEach((key) => {
    if (data[key] !== undefined) {
      cleaned[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
    }
  });
  return cleaned;
};

exports.getAllAgraMahakumbh = async (req, res) => {
  try {
    const registrations = await AgraMahakumbh2026.find().sort({ createdAt: -1 });
    const total = registrations.length;
    const pending = registrations.filter((r) => r.status === 'pending').length;
    const approved = registrations.filter((r) => r.status === 'approved').length;
    const rejected = registrations.filter((r) => r.status === 'rejected').length;
    res.status(200).json({ success: true, data: registrations, total, pending, approved, rejected });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAgraMahakumbhById = async (req, res) => {
  try {
    const registration = await AgraMahakumbh2026.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.status(200).json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAgraMahakumbh = async (req, res) => {
  try {
    const registration = await AgraMahakumbh2026.findByIdAndUpdate(
      req.params.id,
      normalizeRegistration(req.body),
      { new: true, runValidators: true }
    );
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.status(200).json({ success: true, data: registration });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteAgraMahakumbh = async (req, res) => {
  try {
    const registration = await AgraMahakumbh2026.findByIdAndDelete(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.status(200).json({ success: true, message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.setAgraMahakumbhStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const registration = await AgraMahakumbh2026.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    registration.status = status;
    registration.rejectionReason = status === 'rejected' ? (rejectionReason || '') : undefined;
    await registration.save();
    res.status(200).json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};