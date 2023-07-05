const mongoose = require("mongoose");

const reservedRoomsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: true,
    },
    data: {
      type: Object, // Define the type as an object
    },
    totalOrderPrice: {
      type: Number,
    },
    paidAt: Date,
    additionalInfo: {
      type: mongoose.Schema.Types.Mixed, // Store an object with any number of key-value pairs
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReservedRoom", reservedRoomsSchema);
