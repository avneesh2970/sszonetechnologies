// razorpay_routes

const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Purchase = require("../models/PurchaseModel");
const auth = require("../middleware/auth");

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order API
// router.post("/create-order", auth, async (req, res) => {
//   try {
//     const { amount, cartItems } = req.body; // frontend sends amount & cart items
//     console.log("cartItems" + cartItems);
//     const userId = req.user.id; // ✅ get userId from auth middleware

//     const options = {
//       amount: amount * 100, // amount in paise
//       currency: "INR",
//       receipt: "receipt_" + Date.now(),
//     };

//     const order = await razorpay.orders.create(options);

//     // Save purchase in MongoDB
//     const newPurchase = await Purchase.create({
//       user: userId,
//       product: cartItems.map((item) => item.course._id), // array of course IDs
//       amount,
//       status: "created",
//       currency: "INR",
//       razorpay: { orderId: order.id },
//       receipt: options.receipt,
//     });

//     res.status(200).json({ success: true, order, purchaseId: newPurchase._id });
//   } catch (error) {
//     console.log("error", error);

//     res.status(500).json({ success: false, message: error.message });
//   }
// });
// Create order API
router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount, cartItems } = req.body;
    const userId = req.user.id;

    // ✅ Check if user already owns all courses in cart
    const alreadyOwned = await Purchase.find({
      user: userId,
      status: "paid",
      product: { $in: cartItems.map((item) => item.course._id) },
    }).lean();

    if (alreadyOwned.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already purchased one or more of these courses.",
        ownedCourses: alreadyOwned.flatMap((p) => p.product),
      });
    }

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    const newPurchase = await Purchase.create({
      user: userId,
      product: cartItems.map((item) => item.course._id),
      amount,
      status: "created",
      currency: "INR",
      razorpay: { orderId: order.id },
      receipt: options.receipt,
    });

    res.status(200).json({ success: true, order, purchaseId: newPurchase._id });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify payment signature API
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      purchaseId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await Purchase.findByIdAndUpdate(purchaseId, {
        status: "paid",
        "razorpay.paymentId": razorpay_payment_id,
        "razorpay.signature": razorpay_signature,
      });
      return res
        .status(200)
        .json({ success: true, message: "Payment verified & updated" });
    } else {
      await Purchase.findByIdAndUpdate(purchaseId, { status: "failed" });
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// checkout button status paid or checkout
router.get("/is-paid/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const paid = await Purchase.exists({
      user: req.user.id,
      status: "paid",
      product: courseId,
    });

    res.json({ success: true, paid: !!paid });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Based on user
router.get("/my-purchases", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const purchases = await Purchase.find({ user: userId, status: "paid" })
      .populate({
        path: "product",
        populate: [
          {
            path: "instructor",
            populate: {
              path: "profile",
              model: "InstructorProfile",
              select:
                "skill bio firstName lastName userName displayNamePubliclyAs",
            },
          },
          { path: "additionalInfo" },
          { path: "overview" },
          { path: "introVideo" },
          {
            path: "modules",
            populate: [
              { path: "lessons" },
              { path: "quizzes" },
              { path: "assignments" }, // ✅ add this line
            ],
          },
          {
            path: "reviews",
            populate: { path: "userId" },
          },
        ],
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/all-purchases", async (req, res) => {
  try {
    const allPurchase = await Purchase.find()
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .populate("product");

    res.status(200).json({ success: true, allPurchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    // Aggregate purchases by month
    const monthlyEnrollments = await Purchase.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // get month from createdAt
          count: { $sum: 1 }, // count number of purchases
        },
      },
      {
        $sort: { _id: 1 }, // sort by month ascending
      },
    ]);
    // http://localhost:3999/api/payment/all

    // Optionally, populate user and product info if needed
    const allPurchase = await Purchase.find()
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .populate("product");

    res.status(200).json({
      success: true,
      allPurchase,
      monthlyEnrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
