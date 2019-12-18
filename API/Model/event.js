const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  subscribers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  category: [
    {
      type: String,
      required: true
    }
  ],
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    max: 30
  },
  image: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  event_date: {
    type: Date,
    required: true
  },
  creation_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Event", eventSchema);
