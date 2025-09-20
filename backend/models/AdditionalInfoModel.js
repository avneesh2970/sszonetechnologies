const mongoose = require("mongoose");

const additionalInfoSchema = new mongoose.Schema({
  language: String,
  startDate: Date,
  requirements: String,
  description: String,
  duration: {
    hour: { type: Number, default: 0 },
    minute: { type: Number, default: 0 },
  },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model("AdditionalInfo", additionalInfoSchema);