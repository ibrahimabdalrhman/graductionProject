const { param, check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

exports.addContactValidator = [
  check("name")
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 2, max: 30 })
    .withMessage("name must be beltween [ 2 - 50 ] "),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalild email"),
  validationMiddleware,
];
