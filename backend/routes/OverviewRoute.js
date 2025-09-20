const express = require("express");
const router = express.Router();
const overviewController = require("../controllers/OverviewController");

// CRUD routes
router.post("/create", overviewController.createOverview);
router.get("/", overviewController.getAllOverviews);
router.get("/:id", overviewController.getOverviewById);
router.put("/:id", overviewController.updateOverview);
router.delete("/:id", overviewController.deleteOverview);

module.exports = router;
