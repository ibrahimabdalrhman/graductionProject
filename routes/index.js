const authRoute = require('../routes/authRoute');
const contactRoute = require('../routes/contactRoute');


const mountRoute = (app) => {

  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/contact", contactRoute);
}


module.exports = mountRoute;