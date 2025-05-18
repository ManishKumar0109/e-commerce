import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
const Section = ({ heading, options }) => {
  const location = useLocation()
  const leading = location.pathname.split("/").pop()

  return (
    <section className="mb-8">
      <h2 className="text-gray-200 text-xl font-semibold mb-2 uppercase">
        {heading}
      </h2>
      <nav className="flex flex-col space-y-2">
        {options.map((el, index) => (
          <Link
            to={`/admin/${el.replace(" ", "")}`}
            className={`${
              leading.toUpperCase() === el.replace(" ", "").toUpperCase()
                ? "bg-white/30"
                : console.log(leading, el)
            } text-gray-300 text-lg hover:text-white transition text-center  lg:text-left px-4  rounded-sm lg:py-0.5 py-1`}
            key={index + el}
          >
            {el}
          </Link>
        ))}
      </nav>
    </section>
  )
}

const Navbar = (obj) => {
  const { prop } = obj
  const { Navbar, setNavbar } = prop
  const userName = useSelector((store) => store.user.userInfo)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  const isMobileView = windowWidth < 1020

  let s = "lg:-left-[20%] -left-[100%]"

  if (Navbar === true) {
    s = "left-0"
  }

  return (
    <div
      className={`h-screen lg:w-[18%]  w-full bg-[#5841db] absolute z-20 top-0  ${s} transition-[left] duration-300 ease-in-out`}
      onClick={() => {
        isMobileView && setNavbar(false)
      }}
    >
      <div className="h-[15%] flex items-center justify-center border-b  shadow-lg">
        <i className="fa-brands fa-studiovinari text-4xl text-red-400 mr-3 animate-pulse drop-shadow-lg"></i>
        <h1 className="text-white text-3xl font-extrabold tracking-wide drop-shadow-md mr-2">
          StyleSprint
        </h1>
      </div>

      <div className="h-[85%] overflow-y-auto py-6 px-4 hide-scrollbar">
        <Section heading={"Menu"} options={["Dashboard", "Orders", ""]} />
        <Section
          heading={"Management"}
          options={[
            "Products",
            "Customers",
            "Manage Banner",
            "Brand",
            "Add Brand",
            "Add Product",
          ]}
        />
        {/* <Section heading={"Others"} options={["Transactions"]} /> */}

        <div className="mt-auto">
          <div className="bg-pink-400 text-white rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{userName || "Admin"}</p>
              <p className="text-xs">Seller</p>
            </div>
          </div>
        </div>
        <div className="h-[10%] w-full mt-4  flex justify-center items-center ">
          <div
            className="h-full border-y-2 border-gray-400 mt-2 w-[70%] flex justify-center items-center text-white font-bold text-2xl tracking-widest cursor-pointer "
            onClick={() => setNavbar(false)}
          >
            CLOSE
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
