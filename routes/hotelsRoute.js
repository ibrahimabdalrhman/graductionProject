const express = require('express');
const router = express.Router();

const hotelService = require('../services/hotelService');
const hotelValidation = require('../utils/validation/hotelsValidation');

router.post('/',
  hotelService.uploadProductsImages,
  hotelService.resizeImage,
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
  hotelValidation.updateHotelValidator,
  hotelService.updateHotelById
);

router.delete(
  "/:id",
  hotelValidation.deleteHotelValidator,
  hotelService.deleteHotelById
);


module.exports = router;