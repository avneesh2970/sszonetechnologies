
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, },
    description: { type: String },
    regularPrice: { type: Number },
    discountPrice: { type: Number },
    categories: { type: String },
    thumbnail: { type: String },

    status: {
      type: String,
      enum: ["Published", "Pending", "Draft"],
      default: "Draft",
    },

    // 🔑 Link course → instructor
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    additionalInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdditionalInfo",
    },
     modules : [{
       type : mongoose.Schema.Types.ObjectId,
       ref :"Module"
     }],
     
    overview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Overview",
    },

    introVideo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseIntroVideo",
    },
    remarks : [
      {
      type : mongoose.Schema.Types.ObjectId,
      ref : "CourseRemark"
    }
  ],
  reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
