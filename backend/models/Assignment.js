// const mongoose = require("mongoose");

// const assignmentSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true }, // Assignment title
//     summary: { type: String }, // Short description/summary

//     questions: [
//       {
//         questionText: { type: String, required: true },
        
//       },
//     ],

//     moduleId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Module",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Assignment", assignmentSchema);

// models/Assignment.js

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    pdfUrl: { type: String },
    pdfPublicId: { type: String },
    submittedAt: { type: Date },
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String,  },
    summary: String,
    questions: [
       {
         questionText: { type: String,  },
        
       },
     ],
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
