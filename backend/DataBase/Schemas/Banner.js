const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      default: "products/null/null/null",
    },
  },
  { timestamps: true }
) // adds createdAt and updatedAt automatically

const Banner = mongoose.model("Banner", bannerSchema)

module.exports = Banner
