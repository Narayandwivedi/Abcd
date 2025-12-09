require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const path = require('path');
const { connectToDb } = require('./utils/mongodb');
const { scheduleBackupJobs } = require('./jobs/dataBackup');

const app = express()
const PORT = process.env.PORT

// Trust proxy - Required for rate limiting behind proxies/load balancers
// This allows Express to read the real client IP from X-Forwarded-For header
app.set('trust proxy', 1);

// routes

const authRoute = require('./routes/authRoute')
const vendorAuthRoute = require('./routes/vendorAuthRoute')
const vendorRoute = require('./routes/vendorRoute')
const adminVendorRoute = require('./routes/adminVendorRoute')
const vendorCertificateRoute = require('./routes/vendorCertificateRoute')
const adminRoute = require('./routes/adminRoute')
const uploadRoute = require('./routes/uploadRoute')
const searchRoute = require('./routes/searchRoute')
const subAdminRoute = require('./routes/subAdminRoute')
const adminSubAdminRoute = require('./routes/adminSubAdminRoute')
const buyLeadRoute = require('./routes/buyLeadRoute')
const sellLeadRoute = require('./routes/sellLeadRoute')
const exportRoute = require('./routes/exportRoute')
const cityRoute = require('./routes/cityRoute')
const categoryRoute = require('./routes/categoryRoute')
const adRoute = require('./routes/adRoute')
const blogRoute = require('./routes/blogRoute')
const chatRoute = require('./routes/chatRoute')
const userChatRoute = require('./routes/userChatRoute')

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://abcdvyapar.com',
    'https://www.abcdvyapar.com',
    'https://api.abcdvyapar.com' , // Backend domain for admin/vendor panels
     'https://vendor.abcdvyapar.com',
     'https://adm.abcdvyapar.com',
     'https://subadm.abcdvyapar.com'
  ],
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads folder
app.use('/upload', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',authRoute)
app.use('/api/vendor-auth',vendorAuthRoute)
app.use('/api/vendor',vendorRoute)
app.use('/api/admin',adminVendorRoute)
app.use('/api/admin/vendor-certificates',vendorCertificateRoute)
app.use('/api/admin',adminRoute)
app.use('/api/admin',adminSubAdminRoute)
app.use('/api/subadmin',subAdminRoute)
app.use('/api/search',searchRoute)
app.use('/api/upload',uploadRoute)
app.use('/api/buy-lead',buyLeadRoute)
app.use('/api/sell-lead',sellLeadRoute)
app.use('/api/admin/export',exportRoute)
app.use('/api/cities',cityRoute)
app.use('/api/categories',categoryRoute)
app.use('/api/ads',adRoute)
app.use('/api/blogs',blogRoute)
app.use('/api/chats',chatRoute)
app.use('/api/user/chat',userChatRoute)


// server listen - only after DB connection
connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server activated at port ${PORT}`);
    });

    // Schedule automated backup jobs
    scheduleBackupJobs();
    console.log('✅ Automated backup jobs initialized');
});
