const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        min: 1,
      },
      size: {
        type: String,
      },
    },
  ],
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "canceled"],
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "online"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["done", "not done"],
    default: "not done",
  },
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order
