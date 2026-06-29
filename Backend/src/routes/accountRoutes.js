const express = require("express");
const router = express.Router();
const { getAccountDetails } = require("../controllers/accountController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAccountDetails);

module.exports = router;
