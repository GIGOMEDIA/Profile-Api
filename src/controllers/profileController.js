import Profile from "../models/profileModel.js";
import { parseQuery } from "../utils/parser.js";


// ==============================
// GET /api/profiles
// ==============================
export const getProfiles = async (req, res) => {
  try {
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // filters
    let filter = {};

    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.age_group) filter.age_group = req.query.age_group;
    if (req.query.country_id) filter.country_id = req.query.country_id;

    if (req.query.min_age || req.query.max_age) {
      filter.age = {};
      if (req.query.min_age) filter.age.$gte = parseInt(req.query.min_age);
      if (req.query.max_age) filter.age.$lte = parseInt(req.query.max_age);
    }

    if (req.query.min_gender_probability) {
      filter.gender_probability = {
        $gte: parseFloat(req.query.min_gender_probability)
      };
    }

    if (req.query.min_country_probability) {
      filter.country_probability = {
        $gte: parseFloat(req.query.min_country_probability)
      };
    }

    // sorting
    let sort = {};
    if (req.query.sort_by) {
      sort[req.query.sort_by] = req.query.order === "desc" ? -1 : 1;
    }

    // total
    const total = await Profile.countDocuments(filter);

    // data
    const data = await Profile.find(filter)
      .select("-_id -__v") // IMPORTANT
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // response
    return res.status(200).json({
      status: "success",
      page,
      limit,
      total,
      data
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
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // total
    const total = await Profile.countDocuments(filter);

    // data
    const data = await Profile.find(filter)
      .select("-_id -__v")
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: "success",
      page,
      limit,
      total,
      data
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};
