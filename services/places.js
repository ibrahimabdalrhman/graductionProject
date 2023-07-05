const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sharp = require("sharp");
const Place = require('../models/placesModel');
const Restaurant = require("../models/RestaurantModel");
const cloudinary = require("../utils/cloudinary");


exports.addPlaces = asyncHandler(async (req, res, next) => {
  let imagesArr = [];

  if (req.files.images) {
    const imagesFiles = req.files.images;

    await Promise.all(
      imagesFiles.map(async (element) => {
        const image = element;
        const uploadRes = await cloudinary.uploader.upload(image.tempFilePath, {
          public_id: `${Date.now()}`,
          resource_type: "auto",
          folder: "places",
        });
        imagesArr.push(uploadRes.url);

        if (!uploadRes) {
          return next(new ApiError("Error in uploading image", 500));
        }
        fs.unlinkSync(image.tempFilePath);
      })
    );


    const place = await Place.create({
      name: req.body.name,
      city: req.body.city,
      description: req.body.description,
      address: req.body.address,
      images: imagesArr,
    });

    res.status(201).json({
      status: "true",
      message: "Create new product successfully",
      data: place,
    });
  } else {
    const place = await Place.create({
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
    });

    res.status(201).json({
      status: "true",
      message: "Create new product successfully",
      data: place,
    });
  }
});


exports.addRestaurant = asyncHandler(async (req, res, next) => {
  let imagesArr = [];

  if (req.files.images) {
    const imagesFiles = req.files.images;

    await Promise.all(
      imagesFiles.map(async (element) => {
        const image = element;
        const uploadRes = await cloudinary.uploader.upload(image.tempFilePath, {
          public_id: `${Date.now()}`,
          resource_type: "auto",
          folder: "restaurants",
        });
        imagesArr.push(uploadRes.url);

        if (!uploadRes) {
          return next(new ApiError("Error in uploading image", 500));
        }
        fs.unlinkSync(image.tempFilePath);

      })
    );

    const restaurant = await Restaurant.create({
      name: req.body.name,
      city: req.body.city,
      description: req.body.description,
      address: req.body.address,
      images: imagesArr,
    });

    res.status(201).json({
      status: "true",
      message: "Create new product successfully",
      restaurant,
    });
  } else {
    const restaurant = await Restaurant.create({
      name: req.body.name,
      city: req.body.city,
      description: req.body.description,
      address: req.body.address,
    });

    res.status(201).json({
      status: "true",
      message: "Create new product successfully",
      restaurant,
    });
  }
});


exports.getPlaces = asyncHandler(async (req, res, next) => {
  const places = await Place.find();
  res.status(201).json({ status: true, places });
});


exports.getRestaurants = asyncHandler(async (req, res, next) => {
  const places = await Restaurant.find();
  res.status(201).json({ status: true, places });
});


exports.getPlaceById = asyncHandler(async (req, res, next) => {
  const places = await Place.findById(req.params.id);
  res.status(201).json({ status: true, places });
});


exports.getRestaurantById = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.status(201).json({ status: true, restaurant });
});

exports.getPlacesByCity = asyncHandler(async (req, res, next) => {
  const places = await Place.find({city: req.params.city });
  res.status(201).json({ status: true, places });
});

exports.getRestaurantByCity = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.find({ city: req.params.city });
  res.status(201).json({ status: true, restaurant });
});





