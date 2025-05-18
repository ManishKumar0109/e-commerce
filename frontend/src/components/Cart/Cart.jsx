import { useDispatch, useSelector } from "react-redux"
import {
  saveCartToBackend,
  addToCart,
  removeToCart,
  clearCart,
} from "../../redux/cartSlice"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

// const handlePlaceOrder = async () => {
//   try {
//     const res = await fetch("http://localhost:3000/createorder", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({
//         product: cartInfo.map((item) => item._id), // sending array of product IDs
//         address: "Default Address Here", // replace or collect from user
//         totalAmount: finalPrice,
//         paymentMethod,
//       }),
//     })

//     const data = await res.json()

//     if (res.status === 201) {
//       alert("Order placed successfully!")
//     } else {
//       alert(data.message || "Failed to place order.")
//     }
//   } catch (err) {
//     console.error("Error placing order:", err)
//     alert("An error occurred while placing order.")
//   }
// }

// const saveCartToBackend = async () => {
//   const cartItems = useSelector((state) => state.cart.items)
//   const cart = cartItems.map((el) => ({
//     productId: el.productId,
//     size: el.size,
//     quantity: el.quantity,
//   }))
//   try {
//     const res = await fetch("http://localhost:3000/updatecart", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify(cart),
//     })
//     const data = await res.json()
//     return data
//   } catch (error) {
//     throw error
//   }
// }

const Card = ({ name, salePrice, image, size, quantity, productId }) => {
  const dispatch = useDispatch()
  const handleDecrement = () => {
    dispatch(removeToCart({ productId, size }))
    if (quantity <= 1) {
      dispatch(saveCartToBackend())
    }
  }

  const handleIncrement = () => {
    dispatch(addToCart({ productId, size }))
  }

  return (
    <div className="flex w-full border-b p-4 hover:bg-green-50 transition duration-300">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 object-cover rounded-xl border shadow-sm"
      />
      <div className="flex flex-col ml-4 flex-1">
        <h2 className="font-semibold text-lg mb-1">{name}</h2>
        <div className="flex items-center space-x-2">
          <p className="text-green-600 font-bold text-lg">
            ${salePrice.toFixed(2)}
          </p>
        </div>
        {size && (
          <span className="text-sm text-gray-500 mt-1">Size: {size}</span>
        )}
      </div>
      <div className="flex items-center w-[25%] pr-1">
        <div className="w-full border-2 border-black rounded-lg flex justify-evenly items-center font-semibold text-xl py-1">
          <i
            className="fa-solid fa-minus cursor-pointer hover:scale-125 hover:text-red-400"
            onClick={handleDecrement}
          ></i>
          {quantity}
          <i
            className="fa-solid fa-plus cursor-pointer hover:scale-125 hover:text-emerald-400"
            onClick={handleIncrement}
          ></i>
        </div>
      </div>
    </div>
  )
}

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    items: cartItems,
    totalActualPrice,
    totalSalePrice,
  } = useSelector((store) => store.cart)

  const handleCheckout = async () => {
    try {
      dispatch(saveCartToBackend())
    } catch (error) {
      alert("Error saving cart!")
    }
  }

  const handleRefresh = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getcart`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      const data = await res.json()
      dispatch(clearCart())
      if (data.result.length > 0) {
        data.result.forEach((item) => {
          item.quantity
          const cartObj = {
            name: item.name,
            description: item.description,
            salePrice: item.salePrice,
            price: item.price,
            productId: item._id,
            size: item.size || "",
            image: item.images[0],
            quantity: item.quantity,
          }
          dispatch(addToCart(cartObj))
        })
      }
    } catch (error) {}
  }

  // useEffect(() => {
  //   if (items.length > 0) {
  //     saveCartToBackend()
  //   }
  // }, [cartItems])

  const discount = totalActualPrice - totalSalePrice

  return (
    <div className="lg:h-[90vh] h-[85vh] w-full flex justify-center items-center bg-gray-100">
      <div className="border-2 border-gray-300 rounded-xl shadow-xl bg-white lg:w-[40%] w-[98%] lg:h-[95%] h-[90%] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="font-bold text-3xl text-green-700 tracking-widest">
            Cart <i className="fa-solid fa-cart-shopping"></i>
          </h1>

          <button
            onClick={handleRefresh}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-transform duration-300 ease-in-out transform hover:rotate-90 scale-110 hover:scale-125"
            aria-label="Refresh"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <Card
                key={index}
                productId={item.productId}
                name={item.name}
                salePrice={item.salePrice}
                image={item.image}
                size={item.size}
                quantity={item.quantity}
                price={item.price}
                cartItems={cartItems}
              />
            ))
          ) : (
            <div className="text-center mt-10 text-xl font-semibold text-gray-500">
              Your cart is empty 🛒
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="px-6 py-4 border-t text-lg space-y-2">
            <div className="flex justify-between">
              <span>Total (Original)</span>
              <span>${totalActualPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-green-700">
              <span>Total (Sale)</span>
              <span>${totalSalePrice.toFixed(2)}</span>
            </div>
          </div>
        )}
        {cartItems.length > 0 && (
          <button
            onClick={() => {
              handleCheckout(), navigate("/bookorder")
            }}
            className="rounded-t-3xl text-white bg-blue-700 text-2xl py-3 cursor-pointer hover:bg-blue-800 transition"
          >
            Go to checkout
          </button>
        )}
      </div>
    </div>
  )
}

export default Cart
