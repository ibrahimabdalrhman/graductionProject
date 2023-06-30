const mongoose = require('mongoose');

const BookedFlightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('BookedFlight', BookedFlightSchema);