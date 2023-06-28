const Review = require('../models/reviewsModel');
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");


// www.teavelplanner.com/api/v1/hotel/:id/review
exports.addReview = asyncHandler(async (req, res, next) => {
  const review = await Review.create({
    user: req.user._id.toString(),
    hotel: req.body.hotel,
    comment: req.body.comment,
    rating: req.body.rating,
  });
  res.status(201).json({
    status: true,
    message: "Your Review added successfuly",
    data: review,
  });
});


exports.getReviews = asyncHandler(async (req, res, next) => {
  const review = await Review.find({hotel: req.params.hotelId});
  res.status(201).json({
    status: true,
    data: review,
  });
});



