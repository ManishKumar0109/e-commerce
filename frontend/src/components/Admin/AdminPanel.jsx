import Header from "./Header"
import MainPage from "./MainPage"
import NavbarComponent from "./Navbar"

import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase"
import { setUser } from "../../redux/userSlice"
import { useDispatch } from "react-redux"

async function checkForAdmin(navigate, setLoading) {
  try {
    const raw = await fetch(`${import.meta.env.VITE_API_URL}/user/getProfile`, {
      method: "GET",
      credentials: "include",
    })

    if (!raw.ok) {
      navigate("/")
      return false
    }

    const data = await raw.json()
    const { isAdmin } = data

    if (!(String(isAdmin) === String("yes"))) {
      navigate("/")
      return false
    }

    setLoading(false)
    return true
  } catch (error) {
    console.error("Failed to check admin:", error)
    navigate("/")
    return false
  }
}

async function setUserProfile(dispatch) {
  try {
    const raw = await fetch(`${import.meta.env.VITE_API_URL}/user/getProfile`, {
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

const AdminPanel = () => {
  const [showNavbar, setShowNavbar] = useState(true)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const firebasetoken = await firebaseUser.getIdToken()

          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/user/verifytoken`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ firebasetoken }),
              credentials: "include",
            }
          )

          if (res.ok) {
            const isAdmin = await checkForAdmin(navigate, setLoading)
            if (!isAdmin) return
            await setUserProfile(dispatch)
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

  if (loading) return <p>Checking auth...</p>

  return (
    <div className="h-full w-full bg-transparent flex flex-col relative border-8 border-green-400 overflow-hidden">
      <Header prop={{ Navbar: showNavbar, setNavbar: setShowNavbar }} />
      <div className="w-full flex-grow flex flex-row">
        <NavbarComponent
          prop={{ Navbar: showNavbar, setNavbar: setShowNavbar }}
        />
        <MainPage prop={{ Navbar: showNavbar, setNavbar: setShowNavbar }} />
      </div>
    </div>
  )
}

export default AdminPanel
