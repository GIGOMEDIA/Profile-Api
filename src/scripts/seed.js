import mongoose from "mongoose";
import fs from "fs";
import Profile from "../src/models/profileModel.js";

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const data = JSON.parse(
    fs.readFileSync("./profiles.json", "utf-8")
  );

  for (let profile of data) {
    await Profile.updateOne(
      { name: profile.name },
      { $set: profile },
      { upsert: true }
    );
  }

  console.log("Seeding complete");
  process.exit();
};

seed();