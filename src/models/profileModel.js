const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  country_id: String,
  age_group: String,
  gender_probability: Number,
  country_probability: Number,
});

module.exports = mongoose.model("Profile", profileSchema);