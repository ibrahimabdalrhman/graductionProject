const express = require("express");
const router = express.Router();

const placesServices = require("../services/places");

router.post("/add-restaurant", placesServices.addRestaurant);

router.get("/get-all-restaurant", placesServices.getRestaurants);

router.get("/details/:id", placesServices.getRestaurantById);

router.get("/:city", placesServices.getRestaurantByCity);

module.exports = router;
