const Profile = require("../models/profileModel");
const { parseQuery } = require("../utils/parser");
const { Parser } = require("json2csv");

// ==============================
// GET /api/v1/profiles
// ==============================
const getProfiles = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const cappedLimit = Math.min(limit, 50);
    const skip = (page - 1) * cappedLimit;

    let filter = {};

    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.age_group) filter.age_group = req.query.age_group;
    if (req.query.country_id) filter.country_id = req.query.country_id;

    if (req.query.min_age || req.query.max_age) {
      filter.age = {};
      if (req.query.min_age) filter.age.$gte = Number(req.query.min_age);
      if (req.query.max_age) filter.age.$lte = Number(req.query.max_age);
    }

    if (req.query.min_gender_probability) {
      filter.gender_probability = {
        $gte: Number(req.query.min_gender_probability),
      };
    }

    if (req.query.min_country_probability) {
      filter.country_probability = {
        $gte: Number(req.query.min_country_probability),
      };
    }

    let sort = {};
    if (req.query.sort_by) {
      sort[req.query.sort_by] = req.query.order === "desc" ? -1 : 1;
    }

    const total = await Profile.countDocuments(filter);

    const data = await Profile.find(filter)
      .select("-_id -__v")
      .sort(sort)
      .skip(skip)
      .limit(cappedLimit);

    return res.status(200).json({
      status: "success",
      page,
      limit: cappedLimit,
      total,
      data: Array.isArray(data) ? data : [],
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// ==============================
// GET /api/v1/profiles/search
// ==============================
const searchProfiles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing query",
      });
    }

    const parsed = parseQuery(q);

    if (Object.keys(parsed).length === 0) {
      return res.status(422).json({
        status: "error",
        message: "Unable to interpret query",
      });
    }

    let filter = {};

    if (parsed.gender) filter.gender = parsed.gender;
    if (parsed.age_group) filter.age_group = parsed.age_group;
    if (parsed.country_id) filter.country_id = parsed.country_id;

    if (parsed.min_age || parsed.max_age) {
      filter.age = {};
      if (parsed.min_age) filter.age.$gte = parsed.min_age;
      if (parsed.max_age) filter.age.$lte = parsed.max_age;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const cappedLimit = Math.min(limit, 50);
    const skip = (page - 1) * cappedLimit;

    const total = await Profile.countDocuments(filter);

    const data = await Profile.find(filter)
      .select("-_id -__v")
      .skip(skip)
      .limit(cappedLimit);

    return res.status(200).json({
      status: "success",
      page,
      limit: cappedLimit,
      total,
      data: Array.isArray(data) ? data : [],
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// ==============================
// GET /api/v1/profiles/export (ADMIN)
// ==============================
const exportProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().select("-_id -__v");

    const jsonData = profiles.map((p) => p.toObject());

    const fields = Object.keys(jsonData[0] || {});
    const parser = new Parser({ fields });

    const csv = parser.parse(jsonData);

    res.header("Content-Type", "text/csv");
    res.attachment("profiles.csv");

    return res.send(csv);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = {
  getProfiles,
  searchProfiles,
  exportProfiles,
};