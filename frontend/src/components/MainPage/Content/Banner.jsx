import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Banner = () => {
  const [banner, setBanner] = useState([])
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let intervalId

    const fetchData = async () => {
      try {
        const raw = await fetch(`${import.meta.env.VITE_API_URL}/getBanners`, {
          method: "GET",
          credentials: "include",
        })
        const data = await raw.json()
        setBanner(data.result)

        // Start interval only after banners are loaded
        intervalId = setInterval(() => {
          setIndex((prev) => (prev + 1) % data.result.length)
        }, 8000)
      } catch (error) {
        // Handle fetch error if necessary
      }
    }

    fetchData()

    return () => clearInterval(intervalId)
  }, [])

  if (banner.length === 0) return null

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4">
      <div className="bg-transparent rounded-2xl overflow-hidden flex justify-center items-center">
        <img
          src={banner[index]?.image}
          alt="Banner"
          className="lg:h-[450px] h-[170px]"
          onClick={() => {
            if (banner[index]?.location) {
              navigate("/" + banner[index].location)
            }
          }}
        />
      </div>
    </div>
  )
}

export default Banner
