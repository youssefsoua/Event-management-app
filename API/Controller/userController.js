const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");

const User = require("../Model/user");
const Verify = require("./VerifyToken");

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../Profile_image/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

// Get User profile
router.get("/:id", Verify, (req, res) => {
  console.log(req.user);
  const id = req.params.id;
  User.findById(id, (err, user) => {
    if (!err) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: err });
    }
  });
});

// Update User profile informations
router.patch("/:id", upload.single("avatar"), (req, res) => {
  const id = req.params.id;
  let updatedUser = Object.assign({}, req.body);
  if (typeof req.file !== "undefined") {
    updatedUser = Object.assign({}, req.body, { avatar: req.file.path });
  }

  User.findById(id, (err, user) => {
    if (!err) {
      user.set(updatedUser);

      user.save(saveErr => {
        if (!saveErr) {
          res.json({ updated: true });
        } else {
          res.status(400).json({ message: saveErr });
        }
      });
    } else {
      res.status(400).json({ message: err });
    }
  });
});

// Change password
router.patch("/:id/password", Verify,  (req, res) => {
  const id = req.params.id;
  console.log(id);
  User.findById(id, async (err, user) => {
      
      
    if (!err) {
        console.log(user);
            //password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        console.log(validPassword);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid Password.", error: true });
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
  User.findById(id, (err, user) => {
    if (!err) {
      user.set({ password: hashedPassword });

      user.save(saveErr => {
        if (!saveErr) {
          res.json({ passwordUpdated: true });
        } else {
          res.status(400).json({ message: saveErr, error: true });
        }
      });
    } else {
      res.status(400).json({ message: err, error: true });
    }
  });
  res.json({ message:"Password updated successfully "});
    }
  }
);
  
  

  


  //hash password
  
});

module.exports = router;
