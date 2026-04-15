import { v7 as uuidv7 } from "uuid";
import Profile from "../models/profile.model.js";
import { getAgeGroup } from "../utils/ageGroup.js";
import {
  getGender,
  getAge,
  getCountry
} from "../services/externalApis.js";

// CREATE PROFILE
export const createProfile = async (req, res) => {
  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name"
      });
    }

    const normalized = name.toLowerCase();

    // Check duplicate
    const existing =
      await Profile.findOne({ name: normalized });

    if (existing) {
      return res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: existing
      });
    }

    // Call APIs
    const genderData =
      await getGender(normalized);

    const ageData =
      await getAge(normalized);

    const countryData =
      await getCountry(normalized);

    // Pick highest probability country
    const topCountry =
      countryData.country.sort(
        (a, b) =>
          b.probability - a.probability
      )[0];

    // Create profile
    const profile =
      await Profile.create({

        id: uuidv7(),

        name: normalized,

        gender: genderData.gender,

        gender_probability:
          genderData.probability,

        sample_size:
          genderData.count,

        age: ageData.age,

        age_group:
          getAgeGroup(ageData.age),

        country_id:
          topCountry.country_id,

        country_probability:
          topCountry.probability,

        created_at:
          new Date().toISOString()

      });

    res.status(201).json({
      status: "success",
      data: profile
    });

  } catch (err) {

    console.error("FULL ERROR:", err);

    if (
      ["Genderize", "Agify", "Nationalize"]
      .includes(err.message)
    ) {

      return res.status(502).json({
        status: "error",
        message:
          `${err.message} returned an invalid response`
      });

    }

    res.status(500).json({
      status: "error",
      message: "Server error"
    });

  }
};

// GET ONE
export const getProfile = async (req, res) => {

  const profile =
    await Profile.findOne({
      id: req.params.id
    });

  if (!profile) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found"
    });
  }

  res.json({
    status: "success",
    data: profile
  });

};

// GET ALL
export const getProfiles = async (req, res) => {

  const filter = {};

  if (req.query.gender) {
    filter.gender =
      req.query.gender.toLowerCase();
  }

  if (req.query.country_id) {
    filter.country_id =
      req.query.country_id.toUpperCase();
  }

  if (req.query.age_group) {
    filter.age_group =
      req.query.age_group.toLowerCase();
  }

  const profiles =
    await Profile.find(filter);

  res.json({
    status: "success",
    count: profiles.length,
    data: profiles
  });

};

// DELETE
export const deleteProfile = async (req, res) => {

  const deleted =
    await Profile.findOneAndDelete({
      id: req.params.id
    });

  if (!deleted) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found"
    });
  }

  res.status(204).send();

};