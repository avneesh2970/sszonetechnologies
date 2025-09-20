const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    phone   : String,
    email   : String,
    subject : String,
    address : String,
    message : String,

},
{timestamps : true}
);

module.exports = mongoose.model("contactUS", contactSchema )