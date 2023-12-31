const mongoose = require('mongoose');

const imagecover =
  "https://res.cloudinary.com/dowfl0pfi/image/upload/v1688799809/images/1688799761614.jpg";
const image1 =
  "https://res.cloudinary.com/dowfl0pfi/image/upload/v1688803151/images/1688803100124.jpg";
const image2 =
  "https://res.cloudinary.com/dowfl0pfi/image/upload/v1688803131/images/1688803088352.jpg";
const image3 =
  "https://res.cloudinary.com/dowfl0pfi/image/upload/v1688803059/images/1688803046453.jpg";
const image4 =
  "https://res.cloudinary.com/dowfl0pfi/image/upload/v1688802972/images/1688802928798.jpg";



const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "too short"],
      maxLength: [150, "too long"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    availableRooms: {
      type: Number,
      required: [true, "available Rooms quantity required"],
    },
    reservedRooms: {
      type: Number,
      default: 0,
    },
    totalRooms: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "price required"],
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    images:
    {
      type: [String],
    default: [image1, image2, image3, image4]
    },
    imageCover: {
      type: String,
      default:imagecover
    },
    country: {
      type: String,
      required: [true, "Hotel must belongs to Country"],
      lowercase: [true, "country must be lowercase"],
    },
    city: 
      {
        type: String,
        required: [true, "Hotel must belongs to City"],
        lowercase: [true, "city must be lowercase"],
      },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal to 1"],
      max: [5, "Rating must be less or equal to 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    Basicfacilities: [
      {
        type: String,
        enum: [
          "wifi",
          "badService",
          "bathService",
          "safetyCovid19",
          "noPets",
          "securitySafe",
          "teaMaker",
          "airCondition",
          "parking",
          "swimmingPool",
          "gym",
        ],
      },
    ],
    room: {
      type: String,
    },
    meals: {
      type: String,
    },
    phone: Number,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);



hotelSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "hotel",
  localField: "_id",
});

// hotelSchema.post("init", (doc) => {
//   const images=[]
//   if (doc.images) {
//     doc.images.map((img) => {
//       const imageName = `${process.env.BASE_URL}/hotels/${img}`;
//       images.push(imageName);
//     });
//     doc.images=images;
//   }
// });

// hotelSchema.post("init", (doc) => {
//   if (doc.imageCover) {
//     const imageURL = `${process.env.BASE_URL}/hotels/${doc.imageCover}`;
//     doc.imageCover = imageURL;
//   }
// });

module.exports = mongoose.model("Hotel", hotelSchema);