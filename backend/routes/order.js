const express = require("express")

const Order = require("../DataBase/Schemas/Order")
const auth = require("../utils/authorization")
const router = express.Router()
const Product = require("../DataBase/Schemas/Product")
const User = require("../DataBase/Schemas/User") // Update the path as needed
router.post("/createorder", auth, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).select("cart address")

    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const { totalAmount, paymentMethod } = req.body
    if (!paymentMethod || !["cod", "online"].includes(paymentMethod)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing payment method" })
    }

    const shippingAddress = req.body.address || user.address
    if (!shippingAddress) {
      return res.status(400).json({ message: "Address is required" })
    }

    // Loop through cart items and update stock & sold
    for (const item of user.cart) {
      const product = await Product.findById(item.productId)
      if (!product)
        return res.status(404).json({ message: "Product not found" })

      if (item.quantity > product.stock) {
        return res
          .status(406) //if status is 406 then items are more the stock
          .json({ message: `Not enough stock for ${product.name}` })
      }

      product.stock -= item.quantity
      product.sold += item.quantity
      await product.save()
    }

    // Create order
    const newOrder = new Order({
      user: userId,
      product: user.cart,
      address: shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "not done" : "done",
    })

    await newOrder.save()

    // Empty cart
    user.cart = []
    await user.save()

    res.status(201).json({ result: newOrder })
    console.log("things are done")
  } catch (err) {
    console.error("Create order error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/getorder", auth, async (req, res) => {
  try {
    const userId = req.user.id

    const orders = await Order.find({ user: userId })
      .populate("product.productId", "name category ") // populate productId inside product array
      .sort({ date: -1 })

    res.json({ orders })
  } catch (err) {
    console.error("Error fetching orders:", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

router.put("/updateorder", auth, async (req, res) => {
  try {
    const { orderId, status } = req.body

    if (!["pending", "shipped", "delivered", "canceled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Optionally ensure the user has permission to update the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    order.status = status
    await order.save()

    res.json({ message: "Status updated successfully" })
  } catch (err) {
    console.error("Failed to update order status:", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
