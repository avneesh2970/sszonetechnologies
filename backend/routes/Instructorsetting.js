const express = require("express");
const { updateProfile, getProfile } = require("../controllers/instructorSettingController");
const authMiddleware = require("../middleware/instructor");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.post("/profile", authMiddleware, updateProfile);

module.exports = router;
