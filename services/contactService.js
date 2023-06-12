const Contact = require('../models/contactModel');
const asyncHandler = require("express-async-handler");


exports.postContact =asyncHandler(async (req,res,next) => {
  const contact =await Contact.create(req.body);
  res.status(201).json({
    status: "success",
    data:contact
  })
})

exports.getContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find();
  res.status(200).json({
    status: "success",
    data: contacts
  })
});