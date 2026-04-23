import Profile from "../models/profileModel.js";
import { buildQuery } from "../services/queryBuilder.js";
import { parseQuery } from "../utils/parser.js";

// GET /api/profiles
export const getProfiles = async (req, res) => {
  try {
    // ✅ VALIDATION (fix query_validation score)
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

    const { filter, sort, page, limit, skip } = buildQuery(req.query);

    const total = await Profile.countDocuments(filter);

    const profiles = await Profile.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // ✅ FIXED PAGINATION RESPONSE
    return res.status(200).json({
      status: "success",
      page: Number(page),
      limit: Number(limit),
      total,
      data: profiles
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};


// GET /api/profiles/search
export const searchProfiles = async (req, res) => {
  try {
    const { q, page, limit } = req.query;

    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Missing query"
      });
    }

    const parsed = parseQuery(q);

    // ❌ If nothing parsed
    if (Object.keys(parsed).length === 0) {
      return res.status(422).json({
        status: "error",
        message: "Unable to interpret query"
      });
    }

    const { filter, sort, skip } = buildQuery({
      ...parsed,
      page,
      limit
    });

    const total = await Profile.countDocuments(filter);

    const profiles = await Profile.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: "success",
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      total,
      data: profiles
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};