const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
        minlength: 3,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
      },
    },
  ],
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
