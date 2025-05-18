import { useEffect, useState } from "react"
import { Navbar1, Navbar2 } from "./Navbar"
import { Outlet, useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase"
import { setUser } from "../../redux/userSlice"
import { useDispatch } from "react-redux"

async function setUserProfile(dispatch) {
  try {
    const raw = await fetch("http://localhost:3000/user/getProfile", {
      method: "GET",
      credentials: "include",
    })
    const data = await raw.json()
    const { firstName, lastName } = data
    dispatch(setUser(firstName.toUpperCase() + " " + lastName.toUpperCase()))
  } catch (error) {
    console.error("Failed to fetch user:", error)
  }
}

const MainPage = () => {
  const [ScreenSize, setScreenSize] = useState(window.innerWidth)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const firebasetoken = await firebaseUser.getIdToken()

          const res = await fetch("http://localhost:3000/user/verifytoken", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firebasetoken }),
            credentials: "include",
          })

          if (res.ok) {
            await setUserProfile(dispatch)
            setLoading(false)
          } else {
            await auth.signOut()
            navigate("/auth")
          }
        } catch (err) {
          console.error("Error verifying user:", err)
          await auth.signOut()
          navigate("/auth")
        }
      } else {
        navigate("/auth")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    function handleSize() {
      setScreenSize(window.innerWidth)
    }
    window.addEventListener("resize", handleSize)
    return () => window.removeEventListener("resize", handleSize)
  }, [])

  const isMobileView = ScreenSize < 1040

  if (loading) return <p>Checking auth...</p>

  return (
    <div className="h-screen w-screen bg-white relative overflow-hidden z-0">
      {isMobileView ? <Navbar2 /> : <Navbar1 />}
      <div className="absolute inset-0 h-screen lg:pt-[4.5%] pt-[44%] z-10 overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  )
}

export default MainPage
