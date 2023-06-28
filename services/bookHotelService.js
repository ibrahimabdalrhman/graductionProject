const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const Hotel = require("../models/hotelsModel");
reservedRooms = require("../models/reservedRoomsModel");

exports.bookHotel = asyncHandler(async (req, res, next) => {
console.log("log 1");
  //1) get cart depend on cartId
  const hotel = await Hotel.findById(req.params.hotelId);
  if (!hotel) {
    return next(new ApiError("Hotel Not Found", 404));
  }
console.log("log 2");

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
    success_url: `${req.protocol}://${req.get("host")}/successfulbooking`,
    cancel_url: `${req.protocol}://${req.get("host")}/hotels/${req.params.hotelId}`,
    customer_email: req.user.email,
    client_reference_id: req.params.hotelId,
    metadata: req.body.info,
  });
  console.log("log 3");
  console.log(session.success_url);

  res.status(200).json({ status: "true", data: session });
});

exports.webhookCheckout = async (req, res) => {
  console.log("start........");
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("event:::::::::::::",event);
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("create order here.................");
    console.log("hoteltId : ", event.data.object.client_reference_id);

    const hotel = await Hotel.findById(event.data.object.client_reference_id);
    if (!hotel) {
      return next(new ApiError("Hotel Not Found", 404));
    }
    const user = await User.findOne({
      email: event.data.object.customer_email,
    });
    const reservedRooms = await reservedRooms.create({
      user: user._id,
      date: event.data.object.metadata,
      totalOrderPrice: event.data.object.amount_total / 100,
      paidAt: Date.now(),
    });
    if (reservedRooms) {
      const bulkOption = hotel.map((item) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { availableRooms: -1, reservedRooms: +1 } },
        },
      }));

      await Hotel.bulkWrite(bulkOption, {});
      //5)clear user cart
      // await Cart.findByIdAndDelete(event.data.object.client_reference_id);
    }
    console.log("order : ", order);
    res.status(200).json({status: "true", received: "success" });
  }
};
