const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");

// Load User
const User = require("../../models/User");

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).then(user => {
    user
      ? res.status(400).json("Email already exists")
      : new User({
          name,
          email,
          password: bcrypt.hashSync(password)
        })
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
  });
});

module.exports = router;
