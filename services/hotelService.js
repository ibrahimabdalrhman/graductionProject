const Hotel = require('../models/hotelsModel');
const ApiFeatures = require('../utils/apiFeatures');
const asyncHandler = require("express-async-handler");
const ApiError = require('../utils/apiError');
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const {  uploadMultipleImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductsImages = uploadMultipleImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 4,
  },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.imageCover) {
    const imagesCovername = `hotel-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(200)
      .toFormat("jpeg")
      .toFile(`uploads/hotels/${imagesCovername}`);
    req.body.imageCover = imagesCovername;
  }

  if (req.files && req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `hotel-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(200)
          .toFormat("jpeg")
          .toFile(`uploads/hotels/${imageName}`);
        req.body.images.push(imageName);
      })
    );
  }
  next();
});


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


