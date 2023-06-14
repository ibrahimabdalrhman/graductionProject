const Country = require('../models/countryModel');
const City = require('../models/cityModel');
const asyncHandler = require("express-async-handler");

exports.addCountry = asyncHandler(async (req, res) => {
  const country = await Country.create(req.body);
  res.status(200).json(country);
});

exports.addCity = asyncHandler(async (req, res) => {
  const city = await City.create(req.body);
  res.status(200).json(city);
});

exports.getCountry = asyncHandler(async (req, res) => {
  const countrys = await Country.find();
  res.status(200).json(countrys);
});

exports.getCity = asyncHandler(async (req, res) => {
  const citys = await City.find();
  res.status(200).json(citys);
});
