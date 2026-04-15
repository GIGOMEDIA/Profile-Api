import axios from "axios";

export const getGender = async (name) => {

  const res =
    await axios.get(
      `https://api.genderize.io?name=${name}`
    );

  if (
    !res.data.gender ||
    res.data.count === 0
  ) {
    throw new Error("Genderize");
  }

  return res.data;
};

export const getAge = async (name) => {

  const res =
    await axios.get(
      `https://api.agify.io?name=${name}`
    );

  if (
    res.data.age === null
  ) {
    throw new Error("Agify");
  }

  return res.data;
};

export const getCountry = async (name) => {

  const res =
    await axios.get(
      `https://api.nationalize.io?name=${name}`
    );

  if (
    !res.data.country ||
    res.data.country.length === 0
  ) {
    throw new Error("Nationalize");
  }

  return res.data;
};