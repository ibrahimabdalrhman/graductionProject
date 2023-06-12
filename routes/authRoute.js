const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const authValidation = require('../utils/validation/authValidation');


router.post("/signup",
  authValidation.signupValidator,
  authService.signup);

router.post("/login",
  authValidation.loginValidator,
  authService.login);

router.get("/logout",
authService.logout);

router.post(
  "/forget-password",
  authValidation.forgetPasswordValidator,
  authService.forgetPassword
);

router.post(
  "/resetcode",
  authValidation.resetCodeValidator,
  authService.verifyResetCode
);

router.post(
  "/reset-password",
  authValidation.resetPasswordValidator,
  authService.resetPassword
);



module.exports = router;