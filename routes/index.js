const authRoute = require('../routes/authRoute');
const contactRoute = require('../routes/contactRoute');
const addressRoute = require("../routes/addressRoute");
const hotelsRoute = require("../routes/hotelsRoute");
const wishlistRoute = require("../routes/wishListRoute");
const bookRoom = require("../routes/bookRoomRoute");
const profileRoute = require("../routes/profileRoute");
const reservedRooms = require("../routes/reservedRoom");


const mountRoute = (app) => {

  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/contact", contactRoute);
  app.use("/api/v1/address", addressRoute);
  app.use("/api/v1/hotels", hotelsRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/profile", profileRoute);
  app.use("/api/v1/bookRoom", bookRoom);
  app.use("/api/v1/reservedRooms", reservedRooms);
}


module.exports = mountRoute;