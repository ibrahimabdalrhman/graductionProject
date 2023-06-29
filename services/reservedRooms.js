const ReservedRoom = require("../models/reservedRoomsModel");
const ApiFeatures = require("../utils/apiFeatures");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

exports.getReservedRoomsForLoggedUser = asyncHandler(async (req, res, next) => {

  const reservedRooms = await ReservedRoom.find({
    user: req.user._id.toString(),
  });
  if (!reservedRooms) {
    return next(new ApiError("You did not make a reservation",400));
  }
  res.status(200).json({
    status: "true",
    data: reservedRooms
  });
});

exports.getReservedRoomsForHotel = asyncHandler(async (req, res, next) => {

  const reservedRooms = await ReservedRoom.find({ hotel: req.params.hotelId });
  if (!reservedRooms) {
    return next(new ApiError("This hotel has not been booked", 400));
  }
  res.status(200).json({
    status: "true",
    data: reservedRooms
  });
});
