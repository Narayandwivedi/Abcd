const express = require("express");
const { getAllUsers, approveUser, setUserPassword } = require("../controllers/adminController");

const router = express.Router();

// All admin routes require authentication
router.get("/users", getAllUsers);
router.put("/users/:userId/approve",approveUser);
router.put("/users/:userId/set-password",setUserPassword);

module.exports = router;
