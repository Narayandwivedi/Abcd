const mongoose = require('mongoose');
const Vendor = require('./backend/models/Vendor');
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

async function checkLastVendor() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
        
        const lastVendor = await Vendor.findOne().sort({ createdAt: -1 });
        if (lastVendor) {
            console.log('Last Vendor Business Name:', lastVendor.businessName);
            console.log('Last Vendor Address:', lastVendor.address);
        } else {
            console.log('No vendors found');
        }
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkLastVendor();
