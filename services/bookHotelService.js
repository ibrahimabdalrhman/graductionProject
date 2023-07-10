const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const { Buffer } = require("buffer");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const Hotel = require("../models/hotelsModel");
const ReservedRoom = require("../models/reservedRoomsModel");
const { log } = require("console");

exports.bookHotel = asyncHandler(async (req, res, next) => {
  //1) get cart depend on cartId
  const hotel = await Hotel.findById(req.params.hotelId);
  if (!hotel) {
    return next(new ApiError("Hotel Not Found", 404));
  }
  //2)get order price depend on total price of cart
  const totalOrderPrice = hotel.priceAfterDiscount
    ? hotel.priceAfterDiscount
    : hotel.price;
  
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/success`,
    cancel_url: `${req.protocol}://${req.get("host")}/hotels/${
      req.params.hotelId
    }`,
    customer_email: req.user.email,
    client_reference_id: req.params.hotelId,
    metadata: req.body.info,
  });

  res.status(200).json({ status: "true", data: session });
});

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  if (event.type === "checkout.session.completed") {
    console.log("create order here..");
    const hotel = await Hotel.findById(event.data.object.client_reference_id);
    if (!hotel) {
      return next(new ApiError("Hotel Not Found", 404));
    }
    const user = await User.findOne({
      email: event.data.object.customer_email,
    });
    const reservedRoom = await ReservedRoom.create({
      user: user._id,
      hotel: hotel._id,
      date: event.data.object.metadata,
      totalOrderPrice: event.data.object.amount_total / 100,
      paidAt: Date.now(),
    });
    if (reservedRoom) {
      console.log("========hotel 1 ==========");
      console.log(hotel.availableRooms);
      console.log(hotel.reservedRooms);
      const newHotel = await Hotel.findByIdAndUpdate(
        {_id:event.data.object.client_reference_id.toString()}, // Match the document with the specified hotelId
        { $inc: { availableRooms: -1, reservedRooms: 1 } }, // Update the fields
        { new: true } // Return the updated document
      );
    }
    console.log(
    "id String :",
      event.data.object.client_reference_id.toString()
    );
    console.log(
      "id :",
      event.data.object.client_reference_id
    );
    console.log("========hotel 2 ==========");
    console.log(newHotel.availableRooms);
    console.log(newHotel.reservedRooms);
    res
      .status(200)
      .json({
        status: "true",
        message: "You reserved room successfuly",
        data: reservedRoom,
      });
  }
});
