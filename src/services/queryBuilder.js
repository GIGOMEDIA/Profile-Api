export const buildQuery = (query) => {
  let filter = {};

  if (query.gender) filter.gender = query.gender;
  if (query.age_group) filter.age_group = query.age_group;
  if (query.country_id) filter.country_id = query.country_id;

  if (query.min_age || query.max_age) {
    filter.age = {};
    if (query.min_age) filter.age.$gte = Number(query.min_age);
    if (query.max_age) filter.age.$lte = Number(query.max_age);
  }

  if (query.min_gender_probability) {
    filter.gender_probability = {
      $gte: Number(query.min_gender_probability)
    };
  }

  if (query.min_country_probability) {
    filter.country_probability = {
      $gte: Number(query.min_country_probability)
    };
  }

  // Sorting
  const allowedSort = ["age", "created_at", "gender_probability"];
  let sort = {};

  if (allowedSort.includes(query.sort_by)) {
    sort[query.sort_by] = query.order === "asc" ? 1 : -1;
  }

  // Pagination
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  return { filter, sort, page, limit, skip };
};