const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  phone: { type: String },
  occupation: { type: String },
  displayName: { type: String },
  bio: { type: String },

  // ✅ Social linkss lJSLDKjfds
  facebook: { type: String },
  instagram: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  website: { type: String },
  github: { type: String },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {timestamps : true});

module.exports = mongoose.model("Settings", settingsSchema);
