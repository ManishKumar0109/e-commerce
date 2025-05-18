const express = require("express")
const User = require("../DataBase/Schemas/User")
const Order = require("../DataBase/Schemas/Order")
const valsignup = require("../utils/ValidateSignUp")
const CustomError = require("../utils/CustomError")
const admin = require("../firebase-setup/firebaseInit")
const router = express.Router()
const jwt = require("jsonwebtoken")
const auth = require("../utils/authorization")
const Product = require("../DataBase/Schemas/Product")

router.post("/verifytoken", async (req, res, next) => {
  const { firebasetoken } = req.body
  try {
    const decodedtoken = await admin.auth().verifyIdToken(firebasetoken)
    const emailId = decodedtoken.email
    const user = await User.findOne({ emailId })
    if (!user) {
      console.log(firebasetoken, "is firebase token", decodedtoken)
      return next(new CustomError(400, "User Not found"))
    }

    const jwttoken = jwt.sign(
      { uid: user._id.toString() },
      "thisis200seCREtKEy",
      { expiresIn: "6d" }
    )
    console.log(jwttoken)
    res.cookie("token", jwttoken, {
      httpOnly: true,
      secure: true, // Must be true for SameSite=None to work
      sameSite: "none", // Allow cookie across different domains
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({ result: "user logged in" })
  } catch (err) {
    next(new CustomError(400, "Not a valid User"))
  }
})

router.post("/signup", async (req, res, next) => {
  const { emailId, password, firstName, lastName } = req.body

  try {
    const validation = valsignup(emailId, password, firstName, lastName)
    if (validation !== true) {
      return next(new CustomError(400, validation))
    }

    const existingUser = await User.findOne({ emailId: emailId })
    if (existingUser) {
      return next(new CustomError(400, "User already exists"))
    }

    const newUser = new User({ emailId, firstName, lastName })
    await newUser.save()

    await admin.auth().createUser({
      email: emailId,
      password: password,
    })

    res.json({ status: 200, message: "User successfully registered" })
  } catch (err) {
    console.log(err.message)
    if (err.code === 400) {
      return next(
        new CustomError(
          400,
          "Duplicate email ID. Please use a different email."
        )
      )
    }

    next(new CustomError(500, "Internal server error"))
  }
})

router.get("/getProfile", auth, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).select(
      "firstName lastName address phone emailId isAdmin"
    )
    if (!user) return res.status(404).json({ message: "User not found" })

    const result = {
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phone: user.phone,
      emailId: user.emailId,
      isAdmin: user.isAdmin,
    }

    res.status(200).json(result)
  } catch (err) {
    console.error("Error in /getProfile:", err)
    res.status(500).json({ message: "Server error" })
  }
})
router.put("/updateProfile", auth, async (req, res) => {
  try {
    const { phone, address } = req.body

    if (!phone || !address) {
      return res.status(400).json({ message: "Phone and address are required" })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { phone, address },
      { new: true, runValidators: true }
    ).select("firstName lastName address phone emailId")

    if (!user) return res.status(404).json({ message: "User not found" })

    res.status(200).json(user)
  } catch (err) {
    console.error("Error updating profile:", err)
    res.status(500).json({ message: "Server error" })
  }
})
router.post("/logout", auth, (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
  res.status(200).json({ message: "Logged out" })
})

router.get("/getcustomers", auth, async (req, res, next) => {
  try {
    const data = await User.find().lean()
    res.status(200).json({ result: data })
  } catch (error) {
    next(error)
  }
})

router.get("/getstats", auth, async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ])

    const totalRevenue = revenueResult[0]?.totalRevenue || 0

    const data = {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
    }

    const product = await Product.find()
      .sort({ stock: 1 })
      .limit(4)
      .select("name stock _id")

    const product2 = await Product.find()
      .sort({ sold: -1 })
      .limit(4)
      .select("name sold _id")

    data.lowStock = product
    data.mostSell = product2

    res.status(200).json({ result: data })
  } catch (err) {
    console.log(err.message)
    next(err) // or use: res.status(500).json({ error: "Something went wrong" });
  }
})

module.exports = router
