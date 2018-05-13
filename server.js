const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const users = require("./routes/api/users");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const { db } = require("./config/keys");

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Use Routes
app.use("/api/users", users);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server is runing on port ${port}`));
