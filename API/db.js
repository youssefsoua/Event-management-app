const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.DB_Connect, { useNewUrlParser: true }, err => {
  if (!err) console.log("MongoDB connection succeeded.");
  else
    console.log(
      "error in MongoDB connection:" + JSON.stringify(err, undefined, 2)
    );
});
mongoose.set("useFindAndModify", false);

module.exports = mongoose;
