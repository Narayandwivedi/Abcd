const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Family member name is required'], trim: true },
    relation: { type: String, required: [true, 'Relation with family leader is required'], trim: true },
    mobile: { type: String, trim: true },
    age: { type: Number, min: [0, 'Age cannot be negative'], default: 0 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: [true, 'Gender is required'], trim: true },
    occupation: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const familySchema = new mongoose.Schema(
  {
    samaj: { type: mongoose.Schema.Types.ObjectId, ref: 'Samaj', default: null },
    leaderName: { type: String, required: [true, 'Family leader name is required'], trim: true },
    leaderMobile: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    members: { type: [familyMemberSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Family', familySchema);
