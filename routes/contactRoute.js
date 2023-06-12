const express = require('express');
const router = express.Router();
const contactService = require('../services/contactService');
const contactValidation = require('../utils/validation/contactValidation');

router.post(
  "/",
  contactValidation.addContactValidator,
  contactService.postContact
);
router.get("/all",contactService.getContacts)



module.exports = router;