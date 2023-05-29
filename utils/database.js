// utils/databse.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://BETA:iDJlGOu9W7svL52t@cluster0.k4mmtlz.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Success: Connected to MongoDB");
  } catch (err) {
    console.log("Failure: Uoconnected to MongoDB");
    throw new Error();
  }
};

module.exports = connectDB;
