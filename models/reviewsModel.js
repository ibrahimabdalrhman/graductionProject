const mongoose = require('mongoose');
const Hotel = require('../models/hotelsModel');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, "user must logged to add review"]
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: "Hotel",
    required: [true, "review must belong too hotel"]
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: [1, "Min rating value is 1.0"],
    max: [5, "Min rating value is 5.0"],
    requird: [true, "rating required"]
  }
});

reviewSchema.statics.clacAvgAndQuantity = async function (hotelId) {
  const results = await this.aggregate([
    {
      $match: { hotel: hotelId },
    },
    {
      $group: {
        _id: "hotel",
        avgRatings: { $avg: "$rating" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);
  if (results.length > 0) {
    await Hotel.findByIdAndUpdate(hotelId, {
      ratingsQuantity: results[0].ratingQuantity,
      ratingsAverage: results[0].avgRatings,
    });
  } else {
    await Hotel.findByIdAndUpdate(hotelId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.clacAvgAndQuantity(this.hotel);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name ",
    select: "image ",
  });
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
