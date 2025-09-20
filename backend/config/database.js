const mongoose = require('mongoose');


exports.connect = () => {
  mongoose.connect("mongodb+srv://atulsemwal77:Atul77@billing.saz1ib1.mongodb.net/?retryWrites=true&w=majority&appName=Billing", {
    dbName:"AddtoCart"
  })
    .then(() => console.log('Your application successfully connected to the database.'))
    .catch((err) => {
      console.log(err);
      console.log('Your application failed to connect to the database.');
      process.exit(1);
    })
}