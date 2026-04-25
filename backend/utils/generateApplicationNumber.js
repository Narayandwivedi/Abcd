const UserApplication = require('../models/UserApplication');
const VendorApplication = require('../models/VendorApplication');

const formatApplicationNumber = (prefix, sequenceNumber) =>
  `${prefix}${String(sequenceNumber).padStart(6, '0')}`;

const extractSequence = (appNumber = '') => {
  const match = String(appNumber).match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
};

const generateUserApplicationNumber = async () => {
  const lastApp = await UserApplication.findOne({}, { applicationNumber: 1 })
    .sort({ createdAt: -1 });
  
  const nextSeq = lastApp ? extractSequence(lastApp.applicationNumber) + 1 : 1;
  return formatApplicationNumber('AM', nextSeq);
};

const generateVendorApplicationNumber = async () => {
  const lastApp = await VendorApplication.findOne({}, { applicationNumber: 1 })
    .sort({ createdAt: -1 });
  
  const nextSeq = lastApp ? extractSequence(lastApp.applicationNumber) + 1 : 1;
  return formatApplicationNumber('AV', nextSeq);
};

module.exports = {
  generateUserApplicationNumber,
  generateVendorApplicationNumber
};
