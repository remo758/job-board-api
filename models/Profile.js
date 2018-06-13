const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Profile Schema
const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  links: {
    website: { type: String },
    linkedin: { type: String },
    github: { type: String }
  },
  location: {
    city: { type: String },
    state: { type: String },
    country: { type: String }
  }
});

module.exports = Profile = mongoose.model("profile", profileSchema);
