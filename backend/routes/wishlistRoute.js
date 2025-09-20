const express = require("express");
const Wishlist = require("../models/wishlistModel");
const User = require("../models/authModel");
const auth = require("../middleware/auth");

const router = express.Router();

// Add to wishlist
router.post("/add", auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    let existing = await Wishlist.findOne({
      user: req.user.id,
      course: courseId,
    });
    if (existing) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      course: courseId,
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { wishlist: wishlistItem._id },
    });

    res.status(201).json({ message: "Added to wishlist", wishlistItem });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to wishlist", error: err.message });
  }
});

// Get wishlist
router.get("/", auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id }).populate(
      "course"
    );
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

// Remove item
router.delete("/:id", auth, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!wishlistItem)
      return res.status(404).json({ message: "Item not found" });

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { wishlist: req.params.id },
    });

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
});

module.exports = router;
