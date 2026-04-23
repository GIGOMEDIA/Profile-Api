export const parseQuery = (q) => {
  const query = q.toLowerCase();
  let filters = {};

  // ✅ gender logic (fix multi-gender bug)
  const hasMale = query.includes("male");
  const hasFemale = query.includes("female");

  if (hasMale && !hasFemale) {
    filters.gender = "male";
  }

  if (hasFemale && !hasMale) {
    filters.gender = "female";
  }

  // if BOTH → don't filter gender

  // ✅ young (16–24)
  if (query.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
  }

  // ✅ above X
  const aboveMatch = query.match(/above (\d+)/);
  if (aboveMatch) {
    filters.min_age = parseInt(aboveMatch[1]);
  }

  // ✅ age groups
  if (query.includes("teenager")) filters.age_group = "teenager";
  if (query.includes("adult")) filters.age_group = "adult";
  if (query.includes("child")) filters.age_group = "child";
  if (query.includes("senior")) filters.age_group = "senior";

  // ✅ country mapping
  if (query.includes("nigeria")) filters.country_id = "NG";
  if (query.includes("kenya")) filters.country_id = "KE";
  if (query.includes("angola")) filters.country_id = "AO";

  return filters;
};