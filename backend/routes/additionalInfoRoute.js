const express = require("express");
const router = express.Router();
const AdditionalInfo = require("../models/AdditionalInfoModel");

router.post("/", async (req, res) => {
  try {
    const info = new AdditionalInfo(req.body);
    await info.save();
    res.status(201).json(info);
  } catch (error) {
    res.status(500).json({ error: "Failed to save additional info" });
  }
});

router.get("/", async (req, res) => {
  try {
    const info = await AdditionalInfo.find();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: "Error fetching additional info" });
  }
});

module.exports = router;