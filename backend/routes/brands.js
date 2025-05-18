const Banner = require("../DataBase/Schemas/Banner")
const Brand = require("../DataBase/Schemas/Brand")
const CustomError = require("../utils/CustomError")
const auth = require("../utils/authorization")
const express = require("express")
const router = express.Router()

router.post("/addbrands", auth, async (req, res, next) => {
  console.log(req.body)
  const { name, description, images, isTopBrand } = req.body
  if (!name || !description || !images || !isTopBrand) {
    console.log(name, description, images, isTopBrand)
    return next(new CustomError(400, "Invalid Details"))
  }
  try {
    const check = await Brand.findOne({ name })
    if (check) {
      console.log("what tf")
      res.status(400).json({ result: "Brand already exists" })
      return
    }
    const newbrand = new Brand({ name, description, images, isTopBrand })
    await newbrand.save()
    res.status(200).json({ result: "successfully brand added" })
    return
  } catch (err) {
    console.log(err.message)
    next(new CustomError(500, "Internal Server Error"))
  }
})

router.delete("/deletebrand", auth, async (req, res, next) => {
  try {
    const { brandId } = req.body

    if (!brandId) {
      return res.status(400).json({ message: "Brand ID is required" })
    }

    const deletedBrand = await Brand.findByIdAndDelete(brandId)

    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" })
    }

    res.status(200).json({ message: "Brand deleted successfully" })
  } catch (err) {
    console.error(err)
    next(new Error("Internal Server Error"))
  }
})

router.delete("/deletebanner", auth, async (req, res, next) => {
  try {
    const { bannerId } = req.body

    if (!bannerId) {
      return res.status(400).json({ message: "Banner ID is required" })
    }

    const data = await Banner.findByIdAndDelete(bannerId)

    if (!data) {
      return res.status(404).json({ message: "Banner not found" })
    }

    res.status(200).json({ message: "Banner deleted successfully" })
  } catch (err) {
    console.error(err)
    next(new Error("Internal Server Error"))
  }
})

router.post("/addbanner", auth, async (req, res) => {
  const { title, image, location } = req.body

  if (!title || !image || !location) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    const newBanner = new Banner({ title, image, location })
    await newBanner.save()
    res.status(201).json({ message: "Banner created successfully" })
  } catch (error) {
    console.error("Error adding banner:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/getbanners", auth, async (req, res, next) => {
  try {
    const brands = await Banner.find().lean()
    res.status(200).json({ result: brands })
  } catch (err) {
    next(new Error("Internal Server Error"))
  }
})
router.get("/getbrands", auth, async (req, res, next) => {
  try {
    const brands = await Brand.find().lean()
    res.status(200).json({ result: brands })
  } catch (err) {
    next(new Error("Internal Server Error"))
  }
})

module.exports = router
