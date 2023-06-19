const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

exports.addHotelToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.hotelId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Hotel added to your wishlist successfully",
    data: user.wishlist,
  });
});

exports.removeHotelfromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.id },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Hotel deleted from your wishlist successfully",
    data: user.wishlist,
  });
});

exports.getWishlist = asyncHandler(async (req, res, next) => {
  const documents = await User.findById(req.user._id).populate({
    path: "wishlist",
    select: "title price description ",
  });

  res.status(200).json({
    status: "success",
    data: documents.wishlist,
  });
});
