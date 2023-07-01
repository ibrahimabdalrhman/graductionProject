const stripe = require("stripe")(process.env.STRIPE_SECRET_FLIGTH);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const Fligth = require("../models/fligthModel");
const BookedFligth = require('../models/BookedFlightModel');
const User=require('../models/userModel')

exports.getAllFligth = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const apiFeatures = new ApiFeatures(Fligth.find(), req.query)
    .paginate()
    .sort()
    .search("fligths")
    .filter()
    .fields();

  const doc = await apiFeatures.mongooseQuery;
  res.status(200).json({
    results: doc.length,
    page: page,
    data: doc,
  });
});

exports.createFligth = asyncHandler(async (req, res, next) => {
  const fligth = await Fligth.create(req.body);
  res.status(201).json({
    status: "true",
    data: fligth,
  });
});

exports.bookFligth = asyncHandler(async (req, res, next) => {
  //1) get cart depend on cartId
  const fligth = await Fligth.findById(req.params.fligthId);
  if (!fligth) {
    return next(new ApiError("Fligth Not Found", 404));
  }
  //2)get order price depend on total price of cart
  const totalOrderPrice = fligth.price;

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
    cancel_url: `${req.protocol}://${req.get("host")}/fligths`,
    customer_email: req.user.email,
    client_reference_id: req.params.fligthId,
    metadata: req.body.info,
  });

  res.status(200).json({ status: "true", data: session });
});

exports.webhookCheckoutFligt = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
console.log("webhook work....")
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_FLIGTH
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  console.log("webhook work.... EVENT : ",event);

  if (event.type === "checkout.session.completed") {
    console.log("create fligth here..");
    const fligth = await Fligth.findById(event.data.object.client_reference_id);
    if (!fligth) {
      return next(new ApiError("Fligth Not Found", 404));
    }
    console.log("webhook work.... EVENT : ", fligth);

    const user = await User.findOne({
      email: event.data.object.customer_email,
    });
    const bookedFligth = await BookedFligth.create({
      user: user._id,
      totalPrice: event.data.object.amount_total / 100,
    });
      console.log("webhook work.... EVENT : ", bookedFligth);

    res.status(200).json({
      status: "true",
      message: "You reserved room successfuly",
      data: bookedFligth,
    });
  }
});
