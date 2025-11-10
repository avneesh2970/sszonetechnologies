
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    author: { type: String,  },
    tags: [{ type: String }],
    content: { type: String },
    image: { type: String },
    // category: String,
    // language: String,
    // dribbble: String,
    // linkedin: String,
    // facebook: String,
    // twitter: String,
    // review:  Number,
  },
  {
    timestamps: true,
  } 

  

);

// Delete image when blog is deleted
blogSchema.pre("findOneAndDelete", async function (next) {
  const blog = await this.model.findOne(this.getFilter());
  if (blog && blog.image) {
    const imagePath = path.join(process.cwd(), blog.image);
    fs.unlink(imagePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Error deleting image file:", err);
      }
    });
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
