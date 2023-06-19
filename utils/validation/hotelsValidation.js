const { param, check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const User = require("../../models/userModel");

exports.addHotelValidator = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Hotel Name required"),
  check("description")
    .notEmpty()
    .withMessage("Hotel description is required")
    .isLength({ min: 20 })
    .withMessage("min length 20 in description"),
  check("totalRooms")
    .notEmpty()
    .withMessage("available Rooms numbers is required")
    .isNumeric()
    .withMessage("available Rooms must be a number"),
  check("reservedRooms")
    .notEmpty()
    .withMessage("reserved Rooms numbers is required")
    .isNumeric()
    .withMessage("reserved Rooms must be a number"),
  check("availableRooms")
    .notEmpty()
    .withMessage("reserved Rooms numbers is required")
    .isNumeric()
    .withMessage("reserved Rooms must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Hotel price is required")
    .isNumeric()
    .withMessage("Hotel price must be a number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Hotel priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validationMiddleware,
];

exports.getHotelValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validationMiddleware,
];

exports.deleteHotelValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validationMiddleware,
];

exports.updateHotelValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID formate"),
  check("name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .optional(),
  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("min length 20 in description"),
  check("totalrooms")
    .optional()
    .isNumeric()
    .withMessage("available Rooms must be a number"),
  check("reservedRooms")
    .optional()
    .isNumeric()
    .withMessage("reserved Rooms must be a number"),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Hotel price must be a number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Hotel priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validationMiddleware,
];
