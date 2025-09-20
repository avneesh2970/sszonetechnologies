const express = require("express");
const Cart = require("../models/cartModel");
const User = require("../models/authModel");
const auth = require("../middleware/auth");

const router = express.Router();

// Add to cart
router.post("/add", auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if already exists
    let existing = await Cart.findOne({ user: req.user.id, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "Course already in cart" });
    }

    const cartItem = await Cart.create({ user: req.user.id, course: courseId });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { itemPurchased: cartItem._id },
    });

    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to cart", error: err.message });
  }
});

// Get cart items
router.get("/", auth, async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user.id }).populate({
      path: "course",
      populate: [
        { path: "instructor" },
        { path: "additionalInfo" },
        { path: "modules", populate: { path: "lessons" } },
        { path: "overview" },
        { path: "introVideo" },
        { path: "remarks" },
        {path : "reviews"}
      ],
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// empty the whole cart after successful payment,

router.delete("/clear", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Clearing cart for user:", userId);

    await Cart.deleteMany({ user: userId });
    await User.findByIdAndUpdate(userId, { $set: { itemPurchased: [] } });

    res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err.message, err.stack);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Remove item
router.delete("/:id", auth, async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!cartItem) return res.status(404).json({ message: "Item not found" });

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { itemPurchased: req.params.id },
    });

    res.json({ message: "Removed from cart" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to remove item this is for one item " + err });
  }
});

module.exports = router;
