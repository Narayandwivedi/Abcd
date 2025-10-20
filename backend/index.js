require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const { connectToDb } = require('./utils/mongodb');

const app = express()
const PORT = process.env.PORT

// routes

const authRoute = require('./routes/authRoute')
const vendorAuthRoute = require('./routes/vendorAuthRoute')
const vendorRoute = require('./routes/vendorRoute')
const adminVendorRoute = require('./routes/adminVendorRoute')
const adminRoute = require('./routes/adminRoute')
const uploadRoute = require('./routes/uploadRoute')
const searchRoute = require('./routes/searchRoute')

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://abcdvyapar.com',
    'https://www.abcdvyapar.com',
    'https://api.abcdvyapar.com' , // Backend domain for admin/vendor panels
     'https://vendor.abcdvyapar.com'
  ],
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoute)
app.use('/api/vendor-auth',vendorAuthRoute)
app.use('/api/vendor',vendorRoute)
app.use('/api/admin/vendor',adminVendorRoute)
app.use('/api/admin',adminRoute)
app.use('/api/search',searchRoute)
app.use('/api/upload',uploadRoute)


// server listen - only after DB connection
connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server activated at port ${PORT}`);
    });
});
