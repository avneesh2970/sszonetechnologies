const mongoose = require("mongoose");

const adminSettingSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true },
  phoneNumb: { type: String },
  skill: { type: String },
  displayNamePubliclyAs: { type: String },
  bio: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("AdminSetting", adminSettingSchema);
