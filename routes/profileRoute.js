const express = require("express");
const router = express.Router();

const profileService = require('../services/profileService');
const { auth } = require("../services/authService");

router.use(auth);

router.get('/', profileService.getProfile);

router.put(
  "/profileImage",
  profileService.uploadProfileImage,
  profileService.resizeImage,
  profileService.updateProfileImage
  );
  
router.put("/updateProfile", profileService.updateCurrentUser);

router.delete("/profileImage", profileService.removeProfileImage);

module.exports = router;