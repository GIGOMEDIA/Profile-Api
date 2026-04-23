import Profile from "../models/profileModel.js";
import { buildQuery } from "../services/queryBuilder.js";
import { parseQuery } from "../utils/parser.js";


// ==============================
// GET /api/profiles
// ==============================
export const getProfiles = async (req, res) => {
  try {
    // ✅ VALIDATION
    const allowedSort = ["age", "created_at", "gender_probability"];
    const allowedOrder = ["asc", "desc"];

    if (req.query.sort_by && !allowedSort.includes(req.query.sort_by)) {
      return res.status(422).json({
        status: "error",
        message: "Invalid query parameters"
      });
    }

    if (req.query.order && !allowedOrder.includes(req.query.order)) {
      return res.status(422).json({
        status: "error",
        message: "Invalid query parameters"
      });
    }

    // ✅ BUILD QUERY
    const { filter, sort, page, limit, skip } = buildQuery(req.query);

    // ✅ TOTAL COUNT
    const total = await Profile.countDocuments(filter);

    // ✅ FETCH DATA
    const data = await Profile.find(filter)
      .select("-_id -__v") // 🔥 remove Mongo fields
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // ✅ STRICT RESPONSE FORMAT
    return res.status(200).json({
      status: "success",
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      total,
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

    // ❌ Missing query
    if (!q || q.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing query"
      });
    }

    // ✅ PARSE QUERY
    const parsed = parseQuery(q);

    // ❌ Cannot interpret
    if (Object.keys(parsed).length === 0) {
      return res.status(422).json({
        status: "error",
        message: "Unable to interpret query"
      });
    }

    // ✅ MANUAL FILTER BUILD (DO NOT use buildQuery here)
    let filter = {};

    if (parsed.gender) {
      filter.gender = parsed.gender;
    }

    if (parsed.age_group) {
      filter.age_group = parsed.age_group;
    }

    if (parsed.country_id) {
      filter.country_id = parsed.country_id;
    }

    if (parsed.min_age || parsed.max_age) {
      filter.age = {};
      if (parsed.min_age) filter.age.$gte = parsed.min_age;
      if (parsed.max_age) filter.age.$lte = parsed.max_age;
    }

    // ✅ PAGINATION
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // ✅ TOTAL
    const total = await Profile.countDocuments(filter);

    // ✅ FETCH DATA
    const data = await Profile.find(filter)
      .select("-_id -__v") // 🔥 critical
      .skip(skip)
      .limit(limit);

    // ✅ RESPONSE
    return res.status(200).json({
      status: "success",
      page,
      limit,
      total,
      data: Array.isArray(data) ? data : []
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};