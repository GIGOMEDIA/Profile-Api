import Profile from "../models/profileModel.js";
import { buildQuery } from "../services/queryBuilder.js";
import { parseQuery } from "../utils/parser.js";

export const getProfiles = async (req, res) => {
  try {
    const { filter, sort, page, limit, skip } = buildQuery(req.query);

    const total = await Profile.countDocuments(filter);

    const profiles = await Profile.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: "success",
      page,
      limit,
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

    if (Object.keys(parsed).length === 0) {
      return res.status(422).json({
        status: "error",
        message: "Unable to interpret query"
      });
    }

    const queryData = buildQuery({ ...parsed, page, limit });

    const total = await Profile.countDocuments(queryData.filter);

    const profiles = await Profile.find(queryData.filter)
      .sort(queryData.sort)
      .skip(queryData.skip)
      .limit(queryData.limit);

    return res.status(200).json({
      status: "success",
      page: queryData.page,
      limit: queryData.limit,
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