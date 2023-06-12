const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user name required"],
      trim: true,
      minLength: [3, "The minimum number of characters in a name is 3"],
    },
    email: {
      type: String,
      required: [true, "email required"],
    },
    message: String,
    
  },
  { timestamps: true }
);



module.exports = mongoose.model("Contact", contactSchema);
