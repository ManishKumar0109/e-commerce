import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Navbar1 = () => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between px-14  pb-2 pt-4 bg-gradient-to-b from-pink-500 to-white text-gray-700 w-full h-[10%] shadow-b-black/10  shadow-lg fixed top-0 z-50">
      {/* Logo & Company Name */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        {/* Icon in glassy box with pulse */}
        <div className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-2xl border-0 border-white/30 shadow-md ">
          <i className="fa-brands fa-studiovinari text-white text-4xl"></i>
        </div>

        {/* Brand Name */}
        <span className="text-2xl font-bold text-white tracking-wide font-[Poppins] drop-shadow-sm">
          Style<span className="text-yellow-200">Sprint</span>
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden lg:flex gap-6 text-sm font-semibold tracking-wide">
        <Link
          to="/products/null/null/male"
          className="flex flex-col items-center gap-1 hover:text-blue-400"
        >
          <i className="fas fa-male"></i> MEN
        </Link>
        <Link
          to="/products/null/null/female"
          className="flex items-center gap-1 hover:text-pink-400 flex-col"
        >
          <i className="fas fa-female"></i> WOMEN
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-green-400 flex-col"
        >
          <i className="fas fa-home"></i> HOME
        </Link>
        <Link
          to="/products/null/accessories/null"
          className="flex items-center gap-1 hover:text-purple-400 flex-col"
        >
          <i className="fas fa-magic"></i> BEAUTY
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-6 max-w-md">
        <input
          type="text"
          placeholder={`Search for products...`}
          value=""
          className="w-full px-4 py-2 rounded-full bg-white/10 border border-white placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => navigate("/products/null/null/null")}
        />
      </div>

      {/* Profile & Bag */}
      <div className="flex gap-6 text-sm font-semibold ">
        <Link
          to="/orders"
          className="flex items-center gap-1 hover:text-yellow-400 flex-col"
        >
          <i className="fas fa-box "></i>Orders
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-1 hover:text-yellow-400 flex-col "
        >
          <i className="fas fa-user"></i> Profile
        </Link>
        <Link
          to="/bag"
          className="flex items-center gap-1 hover:text-red-400 flex-col"
        >
          <i className="fas fa-shopping-bag"></i> Bag
        </Link>
      </div>
    </div>
  )
}

const Card = ({
  heading,
  description,
  image,
  customStyle = "h-full w-full object-cover rounded-r-lg",
  onClick,
}) => {
  return (
    <div
      className="w-[95%] h-[33%] flex rounded-lg shadow-2xl overflow-hidden bg-white"
      onClick={onClick}
    >
      <div className="h-full w-[50%] flex flex-col justify-center px-6 py-4">
        <h1 className="text-xl font-semibold text-black">{heading}</h1>
        <p className="text-sm text-gray-700 opacity-80">{description}</p>
      </div>
      <div className="h-full w-[50%] flex">
        <img src={`${image}`} alt="img" className={customStyle} />
      </div>
    </div>
  )
}

const SubNavbar = ({ setNavbar }) => {
  const navigate = useNavigate()
  return (
    <div className="absolute z-20 h-[screen] inset-0 bg-white flex flex-col items-center py-5 gap-5">
      <i
        className="fa-solid fa-arrow-left absolute top-8 left-7 scale-[1.8] cursor-pointer"
        onClick={() => setNavbar(false)}
      ></i>

      <h1 className="text-3xl text-black font-bold">Categories</h1>

      <Card
        heading={"Women"}
        description={"Shop Westernwear, Indianwear & more for her"}
        image={"/womanNav.jpg"}
        onClick={() => {
          navigate("/products/null/null/female")
          setNavbar(false)
        }}
      />
      <Card
        heading={"Men"}
        description={"Explore Shirts, T-Shirts, Bottomwear & more"}
        image={"/menNav.jpg"}
        onClick={() => {
          navigate("/products/null/null/male")
          setNavbar(false)
        }}
        customStyle={"h-full w-full object-cover object-top rounded-r-xl"}
      />
      <Card
        heading={"Skincare"}
        description={"Glow up with moisturizers, serums & facewash"}
        image={"/careNav.jpg"}
        onClick={() => {
          navigate("/products/null/accessories/null")
          setNavbar(false)
        }}
        customStyle={"h-full w-full object-cover rounded-r-xl"}
      />
      <Card
        heading={"Innerwear"}
        description={"Comfortable lingerie, boxers, briefs & more"}
        image={"/innerNav.jpg"}
        onClick={() => {
          setNavbar(false)
          navigate("/products/null/innerwear/female")
        }}
        customStyle={"h-full w-full object-cover object-top rounded-r-xl"}
      />
    </div>
  )
}

const Navbar2 = () => {
  const [Navbar, setNavbar] = useState(false)
  const navigate = useNavigate()
  return (
    <>
      <div className=" h-[20%] relative z-20 w-full flex flex-col items-center  bg-gradient-to-b from-pink-300 to-white text-gray-700">
        <div className="h-[55%]  w-full flex items-center justify-around   pt-2 ">
          <i
            className="fa-solid fa-bars text-gray-500 hover:text-white lg:scale-[2] scale-[1.5] transition  "
            onClick={() => {
              setNavbar(true)
            }}
          ></i>

          {/* Logo & Company Name */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <span className="text-2xl font-bold text-white tracking-wide font-[Poppins] drop-shadow-sm">
              Style<span className="text-yellow-200">Sprint</span>
            </span>
          </div>

          <div className="flex gap-6 text-sm font-semibold mt-3 ">
            <Link
              to="/orders"
              className="flex items-center gap-1 hover:text-yellow-400 flex-col"
            >
              <i className="fas fa-box "></i>Orders
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-1 hover:text-yellow-400 flex-col "
            >
              <i className="fas fa-user"></i> Profile
            </Link>
            <Link
              to="/bag"
              className="flex items-center gap-1 hover:text-red-400 flex-col"
            >
              <i className="fas fa-shopping-bag"></i> Bag
            </Link>
          </div>
        </div>

        <div
          className="h-[45%] w-full  flex justify-center items-center "
          onClick={() => navigate("/products/null/null/null")}
        >
          <input
            type="text"
            placeholder={`Search for products...`}
            value={""}
            className="w-[90%] px-4 py-2 rounded-sm bg-gray-200  placeholder-gray-500 tracking-wider font-semibold text-white focus:outline-none  "
          />
        </div>
      </div>
      {Navbar && <SubNavbar setNavbar={setNavbar} />}
    </>
  )
}

export { Navbar1, Navbar2 }
