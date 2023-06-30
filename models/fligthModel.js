const mongoose=require('mongoose');

const fligthSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    lowercase: true
  },
  
  to: {
    type: String,
    required: true,
    lowercase: true
  },
  
  firstAitport: {
    type: String,
    required: true,
    lowercase: true
  },

  secondAitport: {
    type: String,
    required: true,
    lowercase: true
  },
  price: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
  
}
  , { timestamps: true }
);

module.exports = mongoose.model('Flight', fligthSchema);