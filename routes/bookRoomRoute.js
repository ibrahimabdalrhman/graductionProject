const express = require("express");

const router = express.Router();

const bookRoom = require('../services/bookHotelService');
const { auth } = require("../services/authService");


router.use(auth);

router
  .route("/:hotelId")
  .post(
    bookRoom.bookHotel
  );
//   .get(wishlistService.getWishlist);

// router.route("/:id").delete(wishlistService.removeHotelfromWishlist);

module.exports = router;
