import { createSlice } from "@reduxjs/toolkit"

// Initial state for user slice
const initialState = {
  userInfo: null, // user object (e.g., { name, email, uid, etc. })
}

const userSlice = createSlice({
  name: "user", // name of this slice in the store
  initialState,
  reducers: {
    // Set user info and login state
    setUser: (state, action) => {
      state.userInfo = action.payload
    },

    // Logout user
    logoutUser: (state) => {
      state.userInfo = null
    },
  },
})

// Export actions to be used in components
export const { setUser, logoutUser } = userSlice.actions

// Export reducer to use in store
export default userSlice.reducer
