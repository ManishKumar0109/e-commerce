import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const fetchCart = async (setProducts, navigate) => {
  try {
    const raw = await fetch(`${import.meta.env.VITE_API_URL}/getcart`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })

    if (raw.status === 200) {
      const data = await raw.json()
      if (data.result <= 0) {
        navigate("/bag")
      }
      setProducts(data.result) // expects array of cart items
    } else {
      console.error("Failed to fetch cart")
    }
  } catch (err) {
    console.error("Error fetching cart:", err)
  }
}

async function fetchProfile(navigate, setAddress) {
  try {
    const raw = await fetch(`${import.meta.env.VITE_API_URL}/user/getProfile`, {
      method: "GET",
      credentials: "include",
    })
    const data = await raw.json()
    if (!data.phone || !data.address) {
      alert("Your Profile is incomplete")
      navigate("/profile")
      return
    }
    setAddress(data.address)
  } catch (err) {
    console.error("Error fetching profile:", err)
  }
}

const BookOrder = () => {
  const [cartInfo, setCartInfo] = useState([])
  const [address, setAddress] = useState("")
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState("cod")

  useEffect(() => {
    fetchCart(setCartInfo, navigate)
    fetchProfile(navigate, setAddress)
  }, [])

  // price calculations
  const totalActualPrice = cartInfo.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const totalSalePrice = cartInfo.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  )
  const discount = totalActualPrice - totalSalePrice
  const finalPrice = totalSalePrice

  const handlePlaceOrder = async (
    cartItems,
    finalPrice,
    paymentMethod,
    address
  ) => {
    console.log("Placing order with payment method:", paymentMethod)

    const orderData = {
      product: cartItems.map((item) => item._id), // or item.productId if needed
      address,
      totalAmount: finalPrice,
      paymentMethod,
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/createorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      })

      const data = await res.json()

      // ✅ Check for 201 Created and presence of `result`
      if (data.result) {
        alert("✅ Order placed successfully!")
        console.log("🧾 New Order:", data.result)

        // Optional: clear cart or redirect
      } else {
        alert(data.message || "❌ Failed to place order.")
        console.warn("⚠️ Unexpected response:", data)
      }
    } catch (err) {
      console.error("❌ Network error placing order:", err)
      alert("An error occurred while placing the order.")
    }
  }

  return (
    <div className="h-[100%] w-full p-4 flex flex-col items-center bg-pink-50">
      <div className="w-full lg:w-[50%] border-4 border-pink-400 rounded-xl p-6 bg-white shadow-2xl">
        <h2 className="text-2xl font-bold text-pink-500 mb-6 text-center">
          Book Your Order
        </h2>

        {/* Product List */}
        <div className="space-y-4 mb-6 overflow-y-scroll">
          {cartInfo.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cartInfo.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.images?.[0] || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 line-through text-sm">
                    ₹{item.price}
                  </p>
                  <p className="text-pink-500 font-semibold">
                    ₹{item.salePrice}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Price Summary */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Actual Price:</span>
            <span>₹{totalActualPrice}</span>
          </div>
          <div className="flex justify-between text-pink-400 font-semibold">
            <span>Discount:</span>
            <span>- ₹{discount}</span>
          </div>
          <div className="flex justify-between text-pink-600 font-bold text-lg border-t pt-2">
            <span>Final Price:</span>
            <span>₹{finalPrice}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Select Payment Method
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => setPaymentMethod("cod")}
              className={`px-4 py-2 rounded-lg border ${
                paymentMethod === "cod"
                  ? "bg-pink-500 text-white"
                  : "bg-white text-pink-500 border-pink-400"
              }`}
            >
              Cash On Delivery
            </button>
            <button
              onClick={() => setPaymentMethod("online")}
              className={`px-4 py-2 rounded-lg border ${
                paymentMethod === "online"
                  ? "bg-pink-500 text-white"
                  : "bg-white text-pink-500 border-pink-400"
              }`}
            >
              Online Payment
            </button>
          </div>
        </div>

        {/* Book Order Button */}
        <button
          onClick={() => handlePlaceOrder(cartInfo, finalPrice, paymentMethod)}
          className="w-full bg-pink-500 hover:bg-pink-600 transition-all text-white font-bold py-3 rounded-xl"
        >
          Book Order
        </button>
      </div>
    </div>
  )
}

export default BookOrder
