import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  totalActualPrice: 0,
  totalSalePrice: 0,
}

const calculateTotals = (state) => {
  state.totalActualPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  state.totalSalePrice = state.items.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  )
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload

      const cartItem = state.items.find(
        (el) =>
          String(el.productId) === String(item.productId) &&
          String(el.size) === String(item.size)
      )

      if (cartItem) {
        cartItem.quantity += item?.quantity || 1
      } else {
        state.items.push({
          ...item,
          quantity: item?.quantity || 1,
        })
      }

      calculateTotals(state)
    },

    removeToCart: (state, action) => {
      const item = action.payload

      const index = state.items.findIndex(
        (el) =>
          String(el.productId) === String(item.productId) &&
          String(el.size) === String(item.size)
      )

      if (index !== -1) {
        if (state.items[index].quantity > 1) {
          state.items[index].quantity -= 1
        } else {
          state.items.splice(index, 1)
        }
      }

      calculateTotals(state)
    },

    clearCart: (state) => {
      state.items = []
      state.totalActualPrice = 0
      state.totalSalePrice = 0
    },
  },
})

// Thunk function to save cart to backend
export const saveCartToBackend = () => async (dispatch, getState) => {
  const cartItems = getState().cart.items

  const cart = cartItems.map(({ productId, size, quantity }) => ({
    productId,
    size,
    quantity,
  }))

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/updatecart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send cookies if any
      body: JSON.stringify(cart),
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error("Failed to sync cart:", errorData)
      return
    }

    const data = await res.json()("Cart synced successfully:", data)
  } catch (error) {
    console.error("Error syncing cart:", error.message)
  }
}

export const { addToCart, removeToCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
