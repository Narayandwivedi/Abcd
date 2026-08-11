const Samaj = require('../models/Samaj');

const lower = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v);

const normalizeAddress = (data = {}) => ({
  ...data,
  block: lower(data.block),
  villageOrCity: lower(data.villageOrCity),
  city: lower(data.city),
});

exports.createSamaj = async (req, res) => {
  try {
    const samaj = await Samaj.create(normalizeAddress(req.body));
    res.status(201).json({ success: true, data: samaj });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllSamaj = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.verificationStatus = req.query.status;
    const samajList = await Samaj.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: samajList });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSamajById = async (req, res) => {
  try {
    const samaj = await Samaj.findById(req.params.id);
    if (!samaj) {
      return res.status(404).json({ success: false, message: 'Samaj not found' });
    }
    res.status(200).json({ success: true, data: samaj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSamaj = async (req, res) => {
  try {
    const samaj = await Samaj.findByIdAndUpdate(req.params.id, normalizeAddress(req.body), {
      new: true,
      runValidators: true,
    });
    if (!samaj) {
      return res.status(404).json({ success: false, message: 'Samaj not found' });
    }
    res.status(200).json({ success: true, data: samaj });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteSamaj = async (req, res) => {
  try {
    const samaj = await Samaj.findByIdAndDelete(req.params.id);
    if (!samaj) {
      return res.status(404).json({ success: false, message: 'Samaj not found' });
    }
    res.status(200).json({ success: true, message: 'Samaj deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
