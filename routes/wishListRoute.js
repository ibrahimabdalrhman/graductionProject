const express = require("express");

const router = express.Router();
const wishlistService = require("../services/wishListService");
const { auth } = require("../services/authService");
// const {
//   postWishlistValidator,
// } = require("../utils/validators/wishlistValidator");

router.use(auth);
router
  .route("/")
  .post(
    // postWishlistValidator,
    wishlistService.addHotelToWishlist)
  .get(wishlistService.getWishlist);

router.route("/:id").delete(wishlistService.removeHotelfromWishlist);

module.exports = router;
