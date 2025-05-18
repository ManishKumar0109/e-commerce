import { Outlet } from "react-router-dom"

const MainPage = (obj) => {
  const { prop } = obj
  const { Navbar, setNavbar } = prop

  return (
    <div
      className={`h-screen border-black  border-4  absolute transition-all duration-300 ease-in-out ${
        Navbar ? "lg:w-[82%] lg:left-[18%]" : "w-full left-0"
      }`}
    >
      <Outlet />
    </div>
  )
}

export default MainPage
