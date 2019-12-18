const express = require("express");
const router = express.Router();
const multer = require("multer");
const Event = require("../Model/event");
const Verify = require("./VerifyToken");
const { eventValidation } = require("../validation/eventValidation");

//Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../Event_image/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
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

// Create an event
router.post("/", Verify, upload.single("image"), (req, res) => {
  const { error } = eventValidation(req.body);
  if (error)
    return res.status(400).json({
      message: error.details[0].message
        .replace(/\W/gi, " ")
        .replace(/\s+/g, " ")
        .substr(1)
    });
  let response = Object.assign({ owner: req.user }, req.body);
  if (typeof req.file !== "undefined") {
    response = Object.assign({ owner: req.user }, req.body, {
      image: req.file.path
    });
  }

  const event = new Event(response);
  event.save((saveErr, savedEvent) => {
    if (!saveErr) {
      res.status(201).json({ savedEvent });
    } else {
      res.status(400).json({ message: saveErr });
    }
  });
});
// Get all events
router.get("/", (req, res) => {
  Event.find((err, event) => {
    if (!err) {
      res.status(200).json(event);
    } else {
      res.json({ message: err });
    }
  });
});
// Get a specific event
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Event.findById(id, (err, event) => {
    if (!err) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: err });
    }
  });
});

// update an event.
router.patch("/:id", Verify, upload.single("image"), (req, res) => {
  const { error } = eventValidation(req.body);
  if (error)
    return res.status(400).json({
      message: error.details[0].message
        .replace(/\W/gi, " ")
        .replace(/\s+/g, " ")
        .substr(1)
    });
  const id = req.params.id;

  let updatedEvent = Object.assign({}, req.body);
  if (typeof req.file !== "undefined") {
    updatedEvent = Object.assign({}, req.body, { image: req.file.path });
  }
  Event.findById(id, (err, event) => {
    if (!err) {
      event.set(updatedEvent);

      event.save(saveErr => {
        if (!saveErr) {
          res.json({ updatedEvent: true });
        } else {
          res.status(400).json({ message: saveErr });
        }
      });
    } else {
      res.status(400).json({ message: err });
    }
  });
});

// Delete an event
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Event.findById(id, (err, event) => {
    if (!err) {
      event.remove(eventErr => {
        if (!eventErr) {
          res.json({ deletedEvent: true });
        } else {
          res.json({ message: eventErr });
        }
      });
    } else {
      res.status(400).json({ message: err });
    }
  });
});

// Get all user subscriptions.
router.get("/subscription/:id", (req, res) => {
  Event.find({ subscribers: req.params.id }).exec((err, event) => {
    if (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          message: "No event found"
        });
      }
      return res.status(500).json({
        message: "Error retrieving Event with given user Id " + req.params.id
      });
    }

    res.json(event);
  });
});

// Get all events created by a user.
router.get("/user/:id", (req, res) => {
  Event.find({ owner: req.params.id }).exec((err, event) => {
    if (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          message: "No event found"
        });
      }
      return res.status(500).json({
        message: "Error retrieving Event with given user Id " + req.params.id
      });
    }

    res.json(event);
  });
});

// Subscribe/Unsubscribe to event
router.patch("/:id/sub", Verify, (req, res) => {
  const id = req.params.id;
  Event.findById(id, (err, event) => {
    if (!err) {
      if (event.subscribers.includes(req.user._id)) {
        event.subscribers.pull(req.user);
        event.save(saveErr => {
          if (!saveErr) {
            res.json({ subscribed: false });
          } else {
            res.status(400).json({ message: saveErr });
          }
        });
      } else {
        event.subscribers.push(req.user);
        event.save(saveErr => {
          if (!saveErr) {
            res.json({ subscribed: true });
          } else {
            res.status(400).json({ message: saveErr });
          }
        });
      }
    } else {
      res.status(400).json({ message: err });
    }
  });
});

module.exports = router;
