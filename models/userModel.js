const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
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
      unique: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Hotel",
      },
    ],
    password: {
      type: String,
      required: [true, "password required"],
      minLength: [6, "The minimum number of characters in a password is 6"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    phone: Number,
    image: String,
    ResetCode: String,
    ResetCodeExpireAt: Date,
    ResetCodeVerified: Boolean,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.post("init", (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/users/${doc.image}`;
    doc.image = imageURL;
  }
});

module.exports = mongoose.model("User", userSchema);
