const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6
  },
  email: {
    type: String,
    required: true,
    min: 6
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  inscription_date: {
    type: Date,
    default: Date.now
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  gender: {
    type: String
  },
  birth_date: {
    type: Date
  },
  country: {
    type: String
  },
  address: {
    type: String
  },
  phone_number: {
    type: String
  },
  avatar: {
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);
