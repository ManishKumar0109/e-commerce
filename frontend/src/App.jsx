import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"

function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#17153B] to-[#5841db] overflow-hidden">
      <Outlet />
    </div>
  )
}

export default App
