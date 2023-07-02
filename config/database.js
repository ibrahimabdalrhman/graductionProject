const mongoose = require("mongoose");

const DB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected..."))
    .catch(err => console.log(err));
};

module.exports = DB;
