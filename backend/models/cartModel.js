const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  quantity: { type: Number, default: 1 }, // Optional if you want multiple seats
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
