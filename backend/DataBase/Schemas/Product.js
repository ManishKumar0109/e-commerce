const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      min: 0,
      required: true,
    },
    tags: [{ type: String }],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    sold: {
      type: Number,
      min: 0,
      default: 0,
    },
    images: [{ type: String }],
    salePrice: {
      type: Number,
      min: 0,
      required: true,
    },
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    category: {
      type: String,
      enum: ["footwear", "upper", "bottom", "accessories", "innerwear"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    brandName: {
      type: "String",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  {
    timestamps: true, // 💖 Correctly here
  }
)

const Product = mongoose.model("Product", productSchema)

module.exports = Product
