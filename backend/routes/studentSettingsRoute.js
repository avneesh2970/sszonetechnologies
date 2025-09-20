const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getMySettings, upsertSettings } = require("../controllers/studentSettingsController");


// Get logged-in user's settings
router.get("/me", auth, getMySettings);

// Create or update settings
router.post("/", auth, upsertSettings);

module.exports = router;
