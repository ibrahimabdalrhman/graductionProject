const express = require('express');
const router = express.Router();

const hotelService = require('../services/hotelService');

router.post('/',
  hotelService.uploadProductsImages,
  hotelService.resizeImage,
  hotelService.addHotel);

router.get('/', hotelService.getHotels);

router.get('/:id', hotelService.getHotelById);

router.put('/:id', hotelService.updateHotelById);

router.delete('/:id', hotelService.deleteHotelById);



module.exports = router;