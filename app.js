const express = require('express');
const path=require('path')
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
// const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const DB = require('./config/database');
const mountRoute = require('./routes');
const errorMiddleware=require('./middlewares/errorMiddleware');
const ApiError=require('./utils/apiError');

const app = express();
DB();
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json({ limit: "20kb" }));
app.use(mongoSanitize());

app.use(xss());

//enable others domans to access your api
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

mountRoute(app);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

//404 error if not found page
app.all('*', (req, res, next) => {
    next(new ApiError(`can't find this page ${req.url}`,404));
});

//Global error middleware
app.use(errorMiddleware);


const port = process.env.PORT||3000;
console.log(`Node Enviroment : ${process.env.NODE_ENV}`);

app.listen(port, () => {
  console.log(`Server Running on port ${port}...`);
});


// handle rejection errors outside  express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection : ${err.name} | ${err.message}`);
  app.close(() => {
    console.error("shutting down ... ");
    process.exit(1);
  });
});