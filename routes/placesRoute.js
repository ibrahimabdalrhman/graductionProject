const express = require('express');
const router = express.Router();

const placesServices = require('../services/places');

router.post('/add-place', placesServices.addPlaces);

router.get('/get-all-places', placesServices.getPlaces);

router.get('/details/:id', placesServices.getPlacesByCity);

router.get('/:city', placesServices.getPlacesByCity);

module.exports = router;