import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Profile from "../models/profile.model.js";

// ===============================
// HELPER: AGE GROUP
// ===============================
const getAgeGroup = (age) => {
  if (!age) return null;
  if (age < 18) return "minor";
  if (age <= 60) return "adult";
  return "senior";
};

// ===============================
// EXTERNAL APIs (SAFE)
// ===============================
const getGender = async (name) => {
  try {
    const res = await axios.get(`https://api.genderize.io?name=${name}`);
    return res.data;
  } catch {
    throw new Error("Genderize");
  }
};

const getAge = async (name) => {
  try {
    const res = await axios.get(`https://api.agify.io?name=${name}`);
    return res.data;
  } catch {
    throw new Error("Agify");
  }
};

const getCountry = async (name) => {
  try {
    const res = await axios.get(`https://api.nationalize.io?name=${name}`);
    return res.data;
  } catch {
    throw new Error("Nationalize");
  }
};

// ===============================
// CREATE PROFILE
// ===============================
export const createProfile = async (req, res) => {
  try {
    const { name } = req.body;

    // 400: missing or empty
    if (!name || name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name"
      });
    }

    // 422: invalid (numeric)
    if (typeof name !== "string" || !isNaN(name)) {
      return res.status(422).json({
        status: "error",
        message: "Name must be a valid string"
      });
    }

    const normalized = name.toLowerCase();

    // Idempotency check
    const existing = await Profile.findOne({ name: normalized });

    if (existing) {
      return res.status(200).json({
        status: "success",
        data: existing
      });
    }

    // Call APIs
    const genderData = await getGender(normalized);
    const ageData = await getAge(normalized);
    const countryData = await getCountry(normalized);

    const topCountry = countryData.country?.sort(
      (a, b) => b.probability - a.probability
    )[0];

    // Create profile
    const profile = await Profile.create({
      id: uuidv4(),
      name: normalized,
      gender: genderData?.gender || null,
      gender_probability: genderData?.probability || null,
      sample_size: genderData?.count || null,
      age: ageData?.age || null,
      age_group: getAgeGroup(ageData?.age),
      country_id: topCountry?.country_id || null,
      country_probability: topCountry?.probability || null,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({
      status: "success",
      data: profile
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);

    if (["Genderize", "Agify", "Nationalize"].includes(err.message)) {
      return res.status(502).json({
        status: "error",
        message: `${err.message} API failed`
      });
    }

    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

// ===============================
// GET ALL PROFILES (WITH FILTERS)
// ===============================
export const getProfiles = async (req, res) => {
  try {
    const { gender, age_group, country_id } = req.query;

    let filter = {};

    if (gender) filter.gender = gender.toLowerCase();
    if (age_group) filter.age_group = age_group.toLowerCase();
    if (country_id) filter.country_id = country_id.toUpperCase();

    const profiles = await Profile.find(filter);

    return res.status(200).json({
      status: "success",
      data: profiles
    });

  } catch (err) {
    console.error("GET PROFILES ERROR:", err);

    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

// ===============================
// GET PROFILE BY ID
// ===============================
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOne({ id });

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      status: "success",
      data: profile
    });

  } catch (err) {
    console.error("GET BY ID ERROR:", err);

    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

// ===============================
// DELETE PROFILE
// ===============================
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOneAndDelete({ id });

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile deleted"
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);

    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};