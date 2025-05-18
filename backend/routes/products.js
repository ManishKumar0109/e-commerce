const express = require("express")
const Product = require("../DataBase/Schemas/Product")
const router = express.Router()
const CustomError = require("../utils/CustomError")
const Brand = require("../DataBase/Schemas/Brand")
const auth = require("../utils/authorization")
router.get("/products", auth, async (req, res, next) => {
  try {
    console.log(req.query)
    const { category, gender, brand } = req.query
    console.log(category, gender, brand)

    const queryObject = {}

    if (category && category !== "null") queryObject.category = category
    if (gender && gender !== "null") queryObject.gender = gender
    if (brand && brand !== "null") queryObject.brandName = brand
    const products = await Product.find(queryObject).lean() // 👉 lean here

    if (products.length === 0) {
      res.status(200).json({ Result: [] })
    }
    res.status(200).json({ Result: products })
  } catch (err) {
    console.log("hello", err.message)
    next(new CustomError(500, "Internal server Error"))
  }
})

router.put("/updateproduct/:productId", auth, async (req, res) => {
  try {
    const productId = req.params.productId
    const payload = req.body

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...payload },
      { new: true }
    )

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json({ result: updatedProduct })
  } catch (error) {
    console.log("gello", err.message)
    console.error("Error updating product:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

router.get("/productdetail", auth, async (req, res, next) => {
  try {
    const { id } = req.query
    console.log(id)
    const product = await Product.findById(id)
    if (!product) {
      res.status(200).json({ Result: [] })
    }
    res.status(200).json({ Result: product })
  } catch (err) {
    console.log("tello", err.message)
    next(new CustomError(500, "Internal server Error"))
  }
})

router.delete("/deleteproduct/:productId", auth, async (req, res) => {
  const { productId } = req.params

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId)

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found 😔" })
    }

    res.status(200).json({ message: "Product deleted successfully ✅" })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({ message: "Server error 💥" })
  }
})

module.exports = router

router.post("/addproducts", auth, async (req, res, next) => {
  const {
    name,
    stock,
    price,
    salePrice,
    images,
    tags,
    category,
    gender,
    description,
    brandName,
    brand,
  } = req.body

  if (
    !name ||
    !stock ||
    !price ||
    !salePrice ||
    !images ||
    !tags ||
    !gender ||
    !category ||
    !description ||
    !brandName ||
    !brand
  ) {
    console.log("not ok")
    next(new CustomError(400, "Invalid Details"))
  }
  console.log("data come")
  try {
    const check = await Product.findOne({ name, brand })
    const theBrand = await Brand.findById(brand)
    console.log("data come")
    if (check) {
      console.log(check)
      return res.status(400).json({ result: "Product already exists" })
    } else if (!theBrand) {
      console.log("data come3")
      return next(new CustomError(400, "Brand not exist"))
    }
    console.log("data come")
    const newProduct = new Product({
      name,
      stock,
      price,
      salePrice,
      images,
      tags,
      category,
      gender,
      description,
      brandName,
      brand,
    })
    const prod = await newProduct.save()
    console.log(theBrand)
    console.log("data come")

    res.status(200).json({ result: "successfully Product added" })
  } catch (err) {
    console.log(err.message)
    next(new CustomError(500, "Internal Server Error"))
  }
})
