const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      lowercase: true,
      required: true,
    },
    address: String,
    description: String,
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema);
