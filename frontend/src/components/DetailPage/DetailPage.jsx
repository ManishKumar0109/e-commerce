import { Navbar1, Navbar2 } from "../MainPage/Navbar"
import { useState, useEffect } from "react"
import ProductDetail from "./ProductDetail"

const DetailPage = () => {
  const [ScreenSize, setScreenSize] = useState(window.innerWidth)
  useEffect(() => {
    function handleSize() {
      setScreenSize(window.innerWidth)
    }
    window.addEventListener("resize", handleSize)
    return () => window.removeEventListener("resize", handleSize)
  }, [])
  const isMobileView = ScreenSize < 1040("detailpage")
  return (
    <div className="h-screen w-screen bg-white  relative z-0  overflow-y-auto scroll-smooth">
      {isMobileView ? <Navbar2 /> : <Navbar1 />}
      <div className="lg:pt-[4.7%] h-full ">
        <ProductDetail />
      </div>
    </div>
  )
}

export default DetailPage
