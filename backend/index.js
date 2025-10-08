require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const app = express()
const PORT = process.env.PORT

// routes

const uploadRoute = require('./routes/uploadRoute')
const userRoute = require('./routes/userRoute')
const vendorRoute = require('./routes/vendorRoute')
const searchRoute = require('./routes/searchRoute')


app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/user',userRoute)
app.use('/api/vendor',vendorRoute)
app.use('/api/search',searchRoute)
app.use('/api/upload',uploadRoute)


// server listen
app.listen(PORT, ()=>{
    console.log(`server actiavated at port ${PORT}`);
    
})
