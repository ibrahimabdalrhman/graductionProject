const Hotel = require('../models/hotelsModel');
const ApiFeatures = require('../utils/apiFeatures');
const asyncHandler = require("express-async-handler");
const ApiError=require('../utils/apiError')

exports.addHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.create(req.body);
  res.status(201).json({
    status: "success",
    data: hotel
  })
});

exports.getHotels = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }
  const page = req.query.page || 1;
  const apiFeatures = new ApiFeatures(Hotel.find(filter), req.query)
    .paginate()
    .sort()
    .search("hotels")
    .filter()
    .fields();

  const doc = await apiFeatures.mongooseQuery;
  res.status(200).json({
    results: doc.length,
    page: page,
    data: doc,
  });
});

exports.getHotelById = asyncHandler(async (req, res,next) => {
  const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return next(new ApiError(`No hotel for this id ${req.params.id}`, 404));
    }
  res.status(200).json({
    status: "success",
    data: hotel
  })
});

exports.updateHotelById = asyncHandler(async (req, res,next) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!hotel) {
    return next(new ApiError(`No hotel for this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: hotel
  })
});

exports.deleteHotelById = asyncHandler(async (req, res,next) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);
  if (!hotel) {
    return next(new ApiError(`No hotel for this id ${req.params.id}`, 404));
  }
  res.status(202).json({
    status: "success",
    data: hotel
  })
});


