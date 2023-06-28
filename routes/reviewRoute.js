const express = require('express');
const router = express.Router({ mergeParams: true });

const reviewService = require('../services/reviewService');
const { auth } = require('../services/authService');
const { postReviewValidator } = require("../utils/validation/reviewValidation");


router.post('/',auth,postReviewValidator,reviewService.addReview)
router.get('/',reviewService.getReviews)




module.exports=router