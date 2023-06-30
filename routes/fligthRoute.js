const express = require('express');
const router = express.Router();

const fligthService = require('../services/fligthService');
const { auth } = require('../services/authService');
router.get('/', fligthService.getAllFligth);
router.post('/', fligthService.createFligth);
router.post('/:fligthId/bookFligth',auth, fligthService.bookFligth);


module.exports = router;