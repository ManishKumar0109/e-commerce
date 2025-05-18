const express = require("express")
const connection = require("./DataBase/Connection")
const app = express()
const signupRouter = require("./routes/user")
const reviewRouter = require("./routes/review")
const productRouter = require("./routes/products")
const managebrandRouter = require("./routes/brands")
const cartRouter = require("./routes/cart")
const orderRouter = require("./routes/order")
const cors = require("cors")
const { credential } = require("firebase-admin")
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(cookieParser())
const corsconfig = {
  origin: "http://localhost:5173",
  credentials: true,
}

app.use(cors(corsconfig))

require("dotenv").config()

app.use("/user", signupRouter)
app.use("/", managebrandRouter)
app.use("/", productRouter)
app.use("/", cartRouter)
app.use("/", orderRouter)
app.use("/", reviewRouter)

app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  const msg = err.message || "Internal Server Error"
  console.log(status, msg)

  res.status(status).json({
    Error: {
      statusCode: status,
      ErrorMessage: msg,
    },
  })
})
const port = process.env.PORT || 4000
connection()
  .then(() => {
    app.listen(port, () => {
      console.log("🚀 Server running at http://localhost:3000")
    })
  })
  .catch((err) => {
    console.error("❌ Cannot connect to DB:", err)
    process.exit(1)
  })
