const Contact = require('../models/contactModel');
const asyncHandler = require("express-async-handler");


exports.postContact =asyncHandler(async (req,res,next) => {
  const contact =await Contact.create(req.body);
  res.status(201).json({
    status: "true",
    data:contact
  })
})

exports.getContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find();
  res.status(200).json({
    status: "true",
    data: contacts
  })
});

exports.test = asyncHandler(async (req, res, next) => {
  const axios = require("axios");

  // Replace 'YOUR_ACCESS_KEY' with your AviationStack API key
  const accessKey = "a8b48bd8d76db2bb1394ed2efc6aab92";

  // Define the params object with the required parameters
  const params = {
    access_key: accessKey,
    // Add other parameters as needed
  };

  axios
    .get("https://api.aviationstack.com/v1/flights", { params })
    .then((response) => {
      // Rest of your code
    })
    .catch((error) => {
      console.log(error);
    });
});