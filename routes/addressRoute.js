const express = require("express");
const router = express.Router();
const addressService = require("../services/addressService");
// const authValidation = require("../utils/validation/authValidation");

router.post('/add-country', addressService.addCountry);

router.post("/add-city", addressService.addCity);

router.get("/get-country", addressService.getCountry);

router.get("/get-city", addressService.getCity);



module.exports = router;