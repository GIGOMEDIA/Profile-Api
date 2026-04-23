export const parseQuery = (q) => {
  const query = q.toLowerCase();
  let filters = {};

  const hasMale = /\bmale\b/.test(query);
  const hasFemale = /\bfemale\b/.test(query);

  // gender
  if (hasMale && !hasFemale) filters.gender = "male";
  if (hasFemale && !hasMale) filters.gender = "female";

  // young → 16–24
  if (query.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
  }

  // above X
  const above = query.match(/above (\d+)/);
  if (above) {
    filters.min_age = parseInt(above[1]);
  }

  // age groups
  if (query.includes("teenager")) filters.age_group = "teenager";
  if (query.includes("adult")) filters.age_group = "adult";
  if (query.includes("child")) filters.age_group = "child";
  if (query.includes("senior")) filters.age_group = "senior";

  // countries
  if (query.includes("nigeria")) filters.country_id = "NG";
  if (query.includes("kenya")) filters.country_id = "KE";
  if (query.includes("angola")) filters.country_id = "AO";

  return filters;
};
