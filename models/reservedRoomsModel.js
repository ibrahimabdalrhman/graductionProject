const mongoose = require('mongoose');

const reservedRoomsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    from: {
      type: Date,
    },
    to: {
      type: Date,
    }
  },
  totalOrderPrice: {
    type: Number,
  },
  paidAt: Date,

}, { timestamps: true }
);

module.exports = mongoose.model("ReservedRoom", reservedRoomsSchema);