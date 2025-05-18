const mongoose = require("mongoose")
const CustomError = require("../utils/CustomError")
const connection = async () => {
  try {
    await mongoose.connect(process.env.URI)
    console.log("✅ MongoDB connected successfully")
  } catch (error) {
    throw new CustomError(500, "Unable to connect to DataBase")
  }
}

module.exports = connection
