const Contact = require('../models/contactModel');


exports.postContact =async (req,res,next) => {
  const contact =await Contact.create(req.body);
  res.status(201).json({
    status: "success",
    data:contact
  })
}

exports.getContacts =async (req,res,next) => {
  const contacts =await Contact.find();
  res.status(200).json({
    status: "success",
    data:contacts
  })
}