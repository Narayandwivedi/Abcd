const express = require('express');
const router = express.Router()

const {handleVendorRegister , handleVendorLogin} = require("../controllers/vendorController")

router.post('/register' , handleVendorRegister)
router.post('/login', handleVendorLogin)


module.exports = router