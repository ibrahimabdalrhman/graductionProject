const { param, check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const Hotel = require("../../models/hotelsModel");

exports.postWishlistValidator = [
  check("hotelId")
    .notEmpty()
    .withMessage("hotel id required")
    .isMongoId()
    .withMessage("invalied hotel id"),
  body("hotelId").custom((val) => {
    return Hotel.findById(val).then((hotel) => {
      if (!hotel) {
        return Promise.reject(new Error(`hotel not found`));
      }
      return true;
    });
  }),
  validationMiddleware,
];
