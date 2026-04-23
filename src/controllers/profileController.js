import Profile from "../models/profileModel.js";
import { parseQuery } from "../utils/parser.js";


// ==============================
// GET /api/profiles
// ==============================
export const getProfiles = async (req, res) => {
  try {
    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const cappedLimit = Math.min(limit, 50);
    const skip = (page - 1) * cappedLimit;

    // filters
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
        $gte: Number(req.query.min_gender_probability)
      };
    }

    if (req.query.min_country_probability) {
      filter.country_probability = {
        $gte: Number(req.query.min_country_probability)
      };
    }

    // sorting
    let sort = {};
    if (req.query.sort_by) {
      sort[req.query.sort_by] = req.query.order === "desc" ? -1 : 1;
    }

    // total count
    const total = await Profile.countDocuments(filter);

    // fetch data
    const data = await Profile.find(filter)
      .select("-_id -__v") // remove Mongo fields
      .sort(sort)
      .skip(skip)
      .limit(cappedLimit);

    // response (STRICT FORMAT)
    return res.status(200).json({
      status: "success",
      page: page,
      limit: cappedLimit,
      total: total,
      data: Array.isArray(data) ? data : []
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};


// ==============================
// GET /api/profiles/search
// ==============================
export const searchProfiles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing query"
      });
    }

    const parsed = parseQuery(q);

    if (Object.keys(parsed).length === 0) {
      return res.status(422).json({
        status: "error",
        message: "Unable to interpret query"
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

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const cappedLimit = Math.min(limit, 50);
    const skip = (page - 1) * cappedLimit;

    // total
    const total = await Profile.countDocuments(filter);

    // fetch data
    const data = await Profile.find(filter)
      .select("-_id -__v")
      .skip(skip)
      .limit(cappedLimit);

    return res.status(200).json({
      status: "success",
      page: page,
      limit: cappedLimit,
      total: total,
      data: Array.isArray(data) ? data : []
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};