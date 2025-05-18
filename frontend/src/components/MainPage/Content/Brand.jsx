import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Brand = () => {
  const [brands, setBrands] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function getData() {
      try {
        const raw = await fetch(`${import.meta.env.VITE_API_URL}/getbrands`, {
          method: "GET",
          credentials: "include",
        })
        const data = await raw.json()
        setBrands(data.result || [])
      } catch (error) {
        console.error("Error fetching brands:", error)
      }
    }

    getData()
  }, [])

  if (brands.length) return null

  return (
    <div className="w-full lg:min-h-[60vh] lg:h-[30%] h-[70%] lg:px-0 px-4">
      <h1 className="font-semibold text-gray-400 text-xl mb-4">
        Shop By Brands
      </h1>
      <div className="w-full h-[90%] flex gap-8 overflow-x-scroll hide-scrollbar">
        {brands.map((el, index) => (
          <img
            src={el.images[0]}
            alt={el.name}
            key={index}
            className="cursor-pointer"
            onClick={() => navigate(`/products/${el.name}/null/null`)}
          />
        ))}
      </div>
    </div>
  )
}

export default Brand
