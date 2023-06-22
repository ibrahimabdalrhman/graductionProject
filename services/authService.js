const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = createToken(user._id);
  res.status(201).json({
    status: "true",
    message: ` successfully signed up`,
    data: user,
    token: token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("email not found", 200));
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (match) {
    const token = createToken(user._id);
    return res.status(200).json({
      status: "true",
      message: `${user.name} logged in successfully`,
      user: user,
      token: token
    });
  }
  console.log(user);
  return next(new ApiError("password incorrect", 200));
});

exports.logout = asyncHandler(async (req, res, next) => {
  // Clear the token by setting it to an invalid value
  res.cookie("token", "invalid-token", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: "true"
    , message: "Logged out"
  });
});

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  //1) get email to send resetCode.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user with this Email", 404));
  }

  //2) if this email is exists, Generate random 6 numbers and save in DB .
  const resetCode = Math.floor(Math.random() * 900000) + 100000;
  const hash = crypto
    .createHash("sha256")
    .update(resetCode.toString()) // convert resetCode to string
    .digest("hex");
  // save resetCode into DB
  user.ResetCode = hash;
  //Add expiration time to reset code (10min)
  user.ResetCodeExpireAt = Date.now() + 10 * 60 * 1000;
  user.ResetCodeVerified = false;
  await user.save();

  //3) send resetCode to email.
  const message = `Dear ${user.name},

We have received a request to reset the password for your email account associated with this email address. To proceed with resetting your password, please use the following 6-digit verification code:

 ${resetCode}

Please enter this code on the password reset page to verify your identity and continue the password reset process. This code will expire in 10 minutes for security reasons, so be sure to use it before then.

If you did not make this request, please ignore this message.

If you have any questions or concerns, please contact our support team at  Travel Planner.

Thank you,

Travel Planner`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code",
      message,
    });
  } catch (err) {
    user.ResetCode = undefined;
    user.ResetCodeExpireAt = undefined;
    user.ResetCodeVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  return res.status(200).json({ status: "true", message: "Check Your Email" });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetcode) // convert resetCode to string
    .digest("hex");
  const user = await User.findOne({
    ResetCode: hashedResetCode,
    ResetCodeExpireAt: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid Reset Code", 401));
  }
  user.ResetCodeVerified = true;
  await user.save();

  return res.status(200).json({ status: "true" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user with this Email", 404));
  }
  if (!user.ResetCodeVerified) {
    return next(new ApiError("Reset Code not vertified", 400));
  }
  user.password = req.body.password;
  user.ResetCode = undefined;
  user.ResetCodeExpireAt = undefined;
  user.ResetCodeVerified = undefined;
  await user.save();
  const token = createToken(user._id);
  return res.status(200).json({
    status: "true",
    message: "you update Password successfully",
    token,
  });
});

exports.auth = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new ApiError("you must login to access this route ", 401));
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new ApiError("you must login to access this route ", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // Check whether the decoded userId is stored in the database.
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(new ApiError("you must login to access this route ", 401));
    }
    req.user = currentUser;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new ApiError("you must login to access this route ", 401));
    }
    next(err);
  }
});

