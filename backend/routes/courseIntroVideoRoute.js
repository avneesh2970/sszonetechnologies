// routes/courseIntroVideoRoute.js
const express = require("express");
const router = express.Router();
const { createIntroVideo, updateIntroVideo } = require("../controllers/courseIntroVideoController");

router.post("/create", createIntroVideo);
router.put("/introVideo/:videoId" , updateIntroVideo)

module.exports = router;
