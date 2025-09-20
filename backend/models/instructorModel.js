// const mongoose = require("mongoose");

// const instructorSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// module.exports = mongoose.model("Instructor", instructorSchema)

const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Optional: keep track of courses
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  profile : {type : mongoose.Schema.Types.ObjectId , ref : "InstructorProfile"}
}, { timestamps: true });

module.exports = mongoose.model("Instructor", InstructorSchema);
