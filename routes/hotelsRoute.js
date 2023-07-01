const express = require('express');
const router = express.Router();

const hotelService = require('../services/hotelService');
const hotelValidation = require('../utils/validation/hotelsValidation');
const authService = require("../services/authService");
const reviewRoute = require('../routes/reviewRoute');

router.use('/:hotelId/review', reviewRoute);

router.post('/',
  authService.auth,
  // hotelService.uploadProductsImages,
  // hotelService.resizeImage,
  hotelValidation.addHotelValidator,
  hotelService.addHotel);

router.get('/', hotelService.getHotels);

router.get(
  "/:id",
  hotelValidation.getHotelValidator,
  hotelService.getHotelById
);

router.put(
  "/:id",
  authService.auth,

  hotelValidation.updateHotelValidator,
  hotelService.updateHotelById
);

router.delete(
  "/:id",
  authService.auth,
  hotelValidation.deleteHotelValidator,
  hotelService.deleteHotelById
);


module.exports = router;