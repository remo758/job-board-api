const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../../config/keys");

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
          .then(user => {
            // Token
            const token = jwt.sign({ userId: user.id }, APP_SECRET);
            res.json({
              token: "Bearer " + token,
              user
            });
          })
          .catch(err => console.log(err));
  });
});

// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    // Check for user
    !user && res.status(400).json("User not found");

    // Check Password
    const valid = bcrypt.compareSync(password, user.password);
    !valid && res.status(400).json("Invalid password");

    // Token
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    res.json({
      token: "Bearer " + token,
      user
    });
  });
});

module.exports = router;
