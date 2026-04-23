import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { v7 as uuidv7 } from "uuid";
import Profile from "../models/profileModel.js";

const countries = [
  { id: "NG", name: "Nigeria" },
  { id: "KE", name: "Kenya" },
  { id: "AO", name: "Angola" }
];

const genders = ["male", "female"];
const ageGroups = ["child", "teenager", "adult", "senior"];

const getAgeGroup = (age) => {
  if (age <= 12) return "child";
  if (age <= 19) return "teenager";
  if (age <= 59) return "adult";
  return "senior";
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    await Profile.deleteMany();

    const data = [];

    for (let i = 0; i < 2026; i++) {
      const age = Math.floor(Math.random() * 80) + 1;
      const gender = genders[Math.floor(Math.random() * 2)];
      const country = countries[Math.floor(Math.random() * countries.length)];

      data.push({
        id: uuidv7(),
        name: `user_${i}`,
        gender: gender,
        gender_probability: Math.random().toFixed(2),
        age: age,
        age_group: getAgeGroup(age),
        country_id: country.id,
        country_name: country.name,
        country_probability: Math.random().toFixed(2),
        created_at: new Date()
      });
    }

    await Profile.insertMany(data);

    console.log(`✅ Seeded ${data.length} profiles`);
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();