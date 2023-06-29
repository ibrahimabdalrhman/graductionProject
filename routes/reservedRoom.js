const express = require('express');
const router = express.Router();

const reservedRoomService = require('../services/reservedRooms');
const { auth } = require('../services/authService');

router.use(auth);
router.get("/", reservedRoomService.getReservedRoomsForLoggedUser);
router.get("/:hotelId", reservedRoomService.getReservedRoomsForHotel);


module.exports = router;