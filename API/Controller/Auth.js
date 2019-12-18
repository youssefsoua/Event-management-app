const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/user");

const { registerValidation } = require("../validation/authValidation");

// /api/user/register
router.post("/register", async (req, res) => {
  //validation

  const { error } = registerValidation(req.body);
  if (error)
    return res.status(400).json({
      message: error.details[0].message
        .replace(/\W/gi, " ")
        .replace(/\s+/g, " ")
        .substr(1)
    });

  //check if username exist

  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist)
    return res.status(400).json({ message: "Username already exist" });

  //check if email exist

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({ message: "Email already exist" });

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // create new user and save in database
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });
  user.save(saveErr => {
    if (!saveErr) {
      res.status(201).json({ registred: true });
    } else {
      res.status(400).json({ message: saveErr });
    }
  });
});

// /api/user/login
router.post("/login", async (req, res) => {
  //check if email exist

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "Invalid e-mail." });
  //password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid Password." });
  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "7d"
  });
  res.json({ token: token, isloggedIn: true });
});

//Refresh token

router.post("/refreshSession", async (req, res) => {
  const token = req.body.token;

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      const token = jwt.sign({ _id: decoded._id }, process.env.TOKEN_SECRET);
      res.json({ token: token, message: "token refreshed" });
    }
  });
});
module.exports = router;
