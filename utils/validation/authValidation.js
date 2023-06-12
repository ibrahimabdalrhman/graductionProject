const { param, check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const User = require('../../models/userModel');

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 3, max: 30 })
    .withMessage("name must be beltween [ 3 - 50 ] "),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalild email"),
  body("email")
    .custom(async(val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error("this email already exists"));
      }
      return true
    }),
    
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6, max: 50 })
    .withMessage("name must be beltween [ 6 - 50 ] "),
  // body("ConfirmPassword")
  //   .notEmpty()
  //   .withMessage("Confirm Password required")
  //   .custom((val, { req }) => {
  //     if (val !== req.body.password) {
  //       return Promise.reject(new Error("password confiration incorrect"));
  //     }
  //     return true;
  // })
  // ,

  validationMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalild email"),
  check("password")
    .notEmpty()
    .withMessage("password required"),

  validationMiddleware
];

exports.forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalild email"),
  validationMiddleware
];

exports.resetCodeValidator = [
  check("resetcode")
    .notEmpty()
    .withMessage("Reset Code required")
    .isLength({ min: 6, max: 6 })
    .withMessage("invalid reset code, please check your email"),
  validationMiddleware,
];

exports.resetPasswordValidator = [
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6, max: 50 })
    .withMessage("name must be beltween [ 6 - 50 ] "),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password required")
    .isLength({ min: 6, max: 50 })
    .withMessage("name must be beltween [ 6 - 50 ] "),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        return Promise.reject(new Error("password confiration incorrect"));
      }
      return true;
    }),
  validationMiddleware,
];