const mongoose = require("mongoose")

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  
},
 {timestamps : true}
);

module.exports = mongoose.model('Announcement', announcementSchema);


