const Family = require('../models/Family');

const calcAge = (dob) => {
  if (!dob) return 0
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return 0
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1
  return age
}

const normalizeMembers = (members = []) =>
  members.map((m) => ({
    ...m,
    age: m.age != null && m.age !== '' ? Number(m.age) : calcAge(m.dob),
  }))

exports.createFamily = async (req, res) => {
  try {
    const family = await Family.create({ ...req.body, members: normalizeMembers(req.body.members) });
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
    const family = await Family.findByIdAndUpdate(req.params.id, { ...req.body, members: normalizeMembers(req.body.members) }, {
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
