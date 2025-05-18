import { useSelector } from "react-redux"

const Header = ({ prop }) => {
  const { Navbar, setNavbar } = prop
  const userName = useSelector((store) => store.user.userInfo)

  return (
    <div className="h-[13%] border-white border-4 flex justify-between items-center px-6 lg:px-10 relative bg-transparent">
      {/* Sidebar Toggle Button */}
      <i
        className="fa-solid fa-bars text-gray-200 hover:text-white lg:scale-[2] scale-[2.3] transition cursor-pointer"
        onClick={() => setNavbar(true)}
      ></i>

      {/* Center Title */}
      <h1 className="text-white font-mono font-extrabold tracking-widest text-2xl drop-shadow-md lg:block hidden">
        DASHBOARD
      </h1>

      {/* User Info Box */}
      <div className="border-2 border-white rounded-lg px-4 py-2 text-white font-semibold bg-gray-800/50 backdrop-blur-sm shadow-md">
        {userName || "Admin"}
      </div>
    </div>
  )
}

export default Header
