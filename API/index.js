const express = require("express");
const bodyParser = require("body-parser");
var morgan = require("morgan");
var cors = require("cors");
const { mongoose } = require("./db");
const port = process.env.PORT || 3000;
//Import Routes
const auth = require("./Controller/Auth");
const user = require("./Controller/userController");
const event = require("./Controller/eventController");
const category = require("./Controller/categoryController");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/Profile_image", express.static("Profile_image"));
app.use("/Event_image", express.static("Event_image"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

//Route Middlewares

app.use("/api/user", auth);
app.use("/api/user", user);
app.use("/api/event", event);
app.use("/api/category", category);

app.use((req, res, next) => {
  var error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port, () => {
  console.log("server started at port " + port);
});
