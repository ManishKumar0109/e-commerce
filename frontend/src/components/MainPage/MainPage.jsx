import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../../firebase/firebase.config"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../../redux/userSlice"
import Sidebar from "../../components/layout/Sidebar"
import MobileNav from "../../components/layout/MobileNav"
import Header from "../../components/layout/Header"

const MainPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)

  // Track screen width for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // One-time auth check
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
            const profileRes = await fetch(
              `${import.meta.env.VITE_API_URL}/user/getProfile`,
              {
                method: "GET",
                credentials: "include",
              }
            )

            const data = await profileRes.json()
            const { firstName, lastName } = data

            dispatch(
              setUser(`${firstName.toUpperCase()} ${lastName.toUpperCase()}`)
            )
          } else {
            await signOut(auth)
            if (location.pathname !== "/auth") navigate("/auth")
          }
        } catch {
          await signOut(auth)
          if (location.pathname !== "/auth") navigate("/auth")
        } finally {
          setLoading(false)
        }
      } else {
        if (location.pathname !== "/auth") navigate("/auth")
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [dispatch, navigate, location.pathname])

  if (loading) return <p className="text-center mt-10">Checking auth...</p>

  return (
    <div className="flex h-screen">
      {!isMobileView && <Sidebar />}
      <div className="flex flex-col flex-1">
        <Header />
        {isMobileView && <MobileNav />}
        {/* This will render nested routes */}
        <Outlet />
      </div>
    </div>
  )
}

export default MainPage
