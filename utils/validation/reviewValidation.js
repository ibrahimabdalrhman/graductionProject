const { param, check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const Review = require("../../models/reviewsModel");

exports.postReviewValidator = [
  check("comment").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 to 5")
    .custom((val, { req }) => {
      req.body.user = req.user._id;
      return true;
    }),
  check("hotel")
    .notEmpty()
    .withMessage(" hotel required")
    .isMongoId()
    .withMessage("invalied hotel id")
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        user: req.body.user,
        hotel: req.body.hotel,
      });
      if (review) {
        return Promise.reject(new Error("You already create review before"));
      }
    })
    .custom((val, { req }) => {
      req.body.user = req.user._id;
      return true;
    }),
  validationMiddleware,
];
