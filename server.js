const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const cors = require("cors");
const getUserId = require("./controllers/auth");
const signup = require("./controllers/signup");
const login = require("./controllers/login");
const { postProject, updateProject } = require("./controllers/project");
const {
  getProfile,
  postProfile,
  profile,
  profiles
} = require("./controllers/profile");

// Load Models
const User = require("./models/User");
const Profile = require("./models/Profile");
const Project = require("./models/Project");

const app = express();

app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
const db = process.env.DB;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const APP_SECRET = process.env.APP_SECRET;
app.post("/signup", signup(User, bcrypt, jwt, APP_SECRET, Joi));
app.post("/login", login(User, bcrypt, jwt, APP_SECRET, Joi));
app.get("/profile", getProfile(Profile, jwt, APP_SECRET, getUserId));
app.post("/profile", postProfile(Profile, jwt, APP_SECRET, getUserId, Joi));
app.get("/user/:username", profile(Profile));
app.get("/profile/all", profiles(Profile));

app.post("/project", postProject(Project, jwt, APP_SECRET, getUserId, Joi));
app.post(
  "/project/:id",
  updateProject(Project, jwt, APP_SECRET, getUserId, Joi)
);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
