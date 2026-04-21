import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, unique: true },
  gender: String,
  gender_probability: Number,
  age: Number,
  age_group: String,
  country_id: String,
  country_name: String,
  country_probability: Number,
  created_at: {
    type: Date,
    default: () => new Date()
  }
});

export default mongoose.model("Profile", profileSchema);