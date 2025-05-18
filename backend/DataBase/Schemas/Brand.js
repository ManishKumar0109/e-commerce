const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isTopBrand: {
    type: String,
    required: true,
    enum: ["yes", "no"],
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
})

const Brand = mongoose.model("Brand", brandSchema)

module.exports = Brand
