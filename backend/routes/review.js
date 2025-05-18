const express = require("express")

const Review = require("../DataBase/Schemas/Review")
const auth = require("../utils/authorization")
const router = express.Router()

router.post("/addreview", auth, async (req, res, next) => {
  try {
    const userId = req.user._id
    const { productId, text, rating } = req.body

    let rev = await Review.findOne({ productId })

    if (!rev) {
      rev = new Review({ productId, reviews: [] })
    }

    rev.reviews.push({ text, rating, userId })
    await rev.save()
    console.log("review added")
    res
      .status(201)
      .json({ success: true, message: "Review added successfully" })
  } catch (err) {
    console.log(err.message)
    next(err)
  }
})

router.get("/reviews/:productId", auth, async (req, res, next) => {
  try {
    const reviews = await Review.findOne({ productId: req.params.productId })
      .populate("reviews.userId", "firstName") // only get name from User model
      .lean()
    console.log(reviews)

    if (!reviews) return res.status(404).json({ message: "No reviews found" })

    res.status(200).json({ result: reviews.reviews }) // send array of review objects
  } catch (err) {
    next(err)
  }
})

module.exports = router
