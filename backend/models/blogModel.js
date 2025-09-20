
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    author: { type: String, required: true },
    tags: [{ type: String }],
    content: { type: String },
    image: { type: String },
    category: String,
    language: String,
    dribbble: String,
    linkedin: String,
    facebook: String,
    twitter: String,
    review:  Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
