const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Profile Schema
const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  username: {
    type: String,
    required: true,
    max: 40
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
