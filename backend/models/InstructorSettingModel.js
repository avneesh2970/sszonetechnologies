const mongoose = require("mongoose");

const instructorProfileSchema = new mongoose.Schema({
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor", required: true },
   name: { type: String }, 
  userName: { type: String,  },
  phoneNumber: { type: String, },
  skill: { type: String, },
  displayNamePubliclyAs: { type : String},
  bio: { type: String, },

  // ✅ Social linkss lJSLDKjfds
  facebook: { type: String },
  instagram: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  website: { type: String },
  github: { type: String },


}, { timestamps: true });

module.exports = mongoose.model("InstructorProfile", instructorProfileSchema);
