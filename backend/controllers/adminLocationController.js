const Location = require('../models/Location');

exports.getAllLocationsAdmin = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    const total = locations.length;
    const active = locations.filter(s => s.isActive).length;
    const inactive = total - active;
    const approved = locations.filter(s => s.verificationStatus === 'approved').length;
    const rejected = locations.filter(s => s.verificationStatus === 'rejected').length;
    const pending = total - approved - rejected;
    res.status(200).json({ success: true, data: locations, total, active, inactive, approved, pending, rejected });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLocationByIdAdmin = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    res.status(200).json({ success: true, data: location });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLocationAdmin = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    res.status(200).json({ success: true, data: location });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteLocationAdmin = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    res.status(200).json({ success: true, message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleLocationStatus = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    location.isActive = !location.isActive;
    await location.save();
    res.status(200).json({ success: true, data: location });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.setLocationVerificationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    location.verificationStatus = status;
    await location.save();
    res.status(200).json({ success: true, data: location });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
