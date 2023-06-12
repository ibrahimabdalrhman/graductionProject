const express = require('express');
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const DB = require('./config/database');
const mountRoute = require('./routes');
const errorMiddleware=require('./middlewares/errorMiddleware');
const ApiError=require('./utils/apiError');

const app = express();
DB();
app.use(express.json());
mountRoute(app);
//404 error if not found page
app.all('*', (req, res, next) => {
    next(new ApiError(`can't find this page ${req.url}`,404));
});

//Global error middleware
app.use(errorMiddleware);


const port = process.env.PORT;
console.log(`Node Enviroment : ${process.env.NODE_ENV}`);

app.listen(port, () => {
  console.log(`Server Running on port ${port}...`);
});