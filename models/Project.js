const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Profile Schema
const projectSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    required: true,
    max: 60
  },
  img: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

module.exports = Project = mongoose.model("project", projectSchema);
