const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone : {type: Number , required : true },
  password: { type: String, required: true },

  settings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Settings",
  },

  resetOTP : String,
  resetOTPExpire : Date,

  

  purchasedCourse: [{type: mongoose.Schema.Types.ObjectId, ref: "Purchase"}],

  itemPurchased: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
}, {timestamps : true});

module.exports = mongoose.model("User", userSchema);
