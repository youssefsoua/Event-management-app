const express = require("express");
const router = express.Router();
const Category = require("../Model/category");

// create an category
router.post("/", (req, res) => {
  const category = new Category({
    name: req.body.name
  });
  category.save((saveErr, savedcategory) => {
    if (!saveErr) {
      res.status(201).send({ data: savedcategory });
    } else {
      res.status(400).send(saveErr);
    }
  });
});
// Get all categories
router.get("/", (req, res) => {
  Category.find((err, category) => {
    if (!err) {
      res.status(200).send(category);
    } else {
      res.send(err);
    }
  });
});
// Get a specific category
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Category.findById(id, (err, category) => {
    if (!err) {
      res.status(200).send(category);
    } else {
      res.status(404).send(err);
    }
  });
});

// delete an category
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  Category.findById(id, (err, category) => {
    if (!err) {
      category.remove((categoryErr, removedCategory) => {
        if (!categoryErr) {
          res.send({ data: removedCategory });
        } else {
          res.send(categoryErr);
        }
      });
    }
  });
});

module.exports = router;
