const jwt = require("jsonwebtoken")
const User = require("../DataBase/Schemas/User")
const CustomError = require("../utils/CustomError")

const auth = async (req, res, next) => {
  try {
    const { token: jwttoken } = req.cookies
    if (!jwttoken) {
      console.log("popo")
      return next(new CustomError(401, "No token provided"))
    }
    const decoded = jwt.verify(jwttoken, "thisis200seCREtKEy")
    const user = await User.findById(decoded.uid)
    if (!user) return next(new CustomError(401, "User not found"))
    req.user = user
    next()
  } catch (err) {
    console.log("pookie")
    console.error("Auth Middleware Error:", err.message)
    return res.status(401).json({ message: "Unauthorized" })
  }
}

module.exports = auth
