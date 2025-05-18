const express = require("express")
const User = require("../DataBase/Schemas/User")
const Product = require("../DataBase/Schemas/Product")
const auth = require("../utils/authorization")
const router = express.Router()

class CustomError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}
router.put("/updatecart", auth, async (req, res, next) => {
  try {
    const cartList = req.body

    const idList = cartList.map((el) => el.productId)
    const products = await Product.find({ _id: { $in: idList } }, "_id")
    const productIds = products.map((product) => product._id.toString())

    const user = await User.findById(req.user._id) // 🟢 FIXED LINE

    const updatedCart = cartList.map((el) => {
      if (el.size === "null" || el.size === "" || !el) {
        el.size = null
      }
      return el
    })

    const finalCart = updatedCart.filter((el) => {
      return (
        productIds.includes(el.productId) &&
        el.quantity > 0 &&
        ["XL", "L", "M", "XXL", "XXXL", null].includes(el.size)
      )
    })

    user.cart = finalCart

    await user.save()
    console.log("cart updated")
    res.status(200).json({ result: "Cart Updated" })
  } catch (error) {
    next(new CustomError(500, "Failed to update cart"))
  }
})

router.get("/getcart", auth, async (req, res, next) => {
  if (req.user.cart.length === 0) {
    res.status(200).json({ result: [] })
  } else {
    try {
      const userCart = await User.findById(req.user._id)
        .populate("cart.productId")
        .select("cart -_id")
        .lean() //it still give a object

      const final = userCart.cart.map((el) => ({
        ...el.productId,
        size: el.size,
        quantity: el.quantity,
      }))
      res.status(200).json({ result: final })
    } catch (error) {
      // Instead of sending a response directly, pass the error to next
      next(new CustomError(500, "Failed to fetch cart"))
    }
  }
})

module.exports = router
