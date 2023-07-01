const fs = require("fs");
const path = require('path');
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const {
  uploadMultipleImages,
} = require("../middlewares/uploadImageMiddleware");

const User = require("../models/userModel");

const mainFolderName = "uploads";
const nestedFolderName = "users";
const nestedFolderPath = `${mainFolderName}/${nestedFolderName}`;

exports.uploadProfileImage = uploadMultipleImages([
  {
    name: "image",
    maxCount: 1,
  },

]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  try {
    if (req.files && req.files.image) {
      const imageName = `user-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.files.image[0].buffer)
        .resize(400)
        .toFormat("jpeg")
        .toFile(`${nestedFolderPath}/${imageName}`);
      req.body.image = imageName;
    }
    next();
  } catch (err) {
    return next(new ApiError("Failed to resize images", 500));
  }
});


exports.getProfile = asyncHandler(async (req, res, next) => {
  res.status(200).json({status: "true", data: req.user });
});


exports.updateProfileImage = asyncHandler(async (req, res, next) => {

  const getlastImage = await User.findById(req.user._id.toString());
  if (getlastImage.image) {
    const modifiedImageUrl = getlastImage.image.replace(
      `${process.env.BASE_URL}/users/`,
      ""
    );

    const filePath = path.join("uploads", "users", modifiedImageUrl);
    fs.unlink(filePath, (err) => {

    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id.toString(),
    { image: req.body.image },
    { new: true }
  );
  res.status(201).json({status: "true",data:  user });
});


exports.removeProfileImage = asyncHandler(async (req, res, next) => {

  const getlastImage = await User.findById(req.user._id.toString());
  if (getlastImage.image) {
    const modifiedImageUrl = getlastImage.image.replace(
      `${process.env.BASE_URL}/users/`,
      ""
    );

    const filePath = path.join("uploads", "users", modifiedImageUrl);
    fs.unlink(filePath, (err) => { });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id.toString(),
    { image: null },
    { new: true }
  );
  
  res.status(201).json({ status: "true", data: user });
});


exports.updateCurrentUser = asyncHandler(async (req, res, next) => {

  const user = await User.findByIdAndUpdate(
    req.user._id.toString(),
    {
      email: req.body.email,
      name: req.body.name,
      phone:req.body.phone
    },
    { new: true }
  );

    res.status(201).json({status: "true", message: "User Updated successfully", user });

})
