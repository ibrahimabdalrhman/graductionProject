const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: mongoose.Schema.ObjectId,
      ref: "Country",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("City", citySchema);