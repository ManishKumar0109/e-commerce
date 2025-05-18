const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    default: null,
  },
  isAdmin: {
    type: String,
    enum: ["yes", "no"],
    default: "no",
  },
  phone: {
    type: String,
    default: null,
    minlength: 10,
    maxlength: 10,
  },
  address: {
    type: String,
    minlength: 5,
    default: null,
  },
  cart: [
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
        type: "String",
        enum: ["XL", "M", "L", "XXL", "XXXL", null],
      },
    },
  ],
})

const User = mongoose.model("User", userSchema)

module.exports = User
