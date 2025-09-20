const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: [ { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }],
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "paid", "failed", "refunded"], default: "created" },
    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    receipt: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
