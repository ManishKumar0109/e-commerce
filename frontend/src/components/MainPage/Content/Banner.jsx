import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Banner = () => {
  const [banner, setbanner] = useState([])
  const [Index, setIndex] = useState(0)
  const navigate = useNavigate()
  useEffect(() => {
    let intervalId

    const fetchData = async () => {
      const raw = await fetch(`${import.meta.env.VITE_API_URL}/getBanners`, {
        method: "GET",
        credentials: "include",
      })
      const data = await raw.json()
      setbanner(data.result)

      // Start interval only AFTER banners are loaded
      intervalId = setInterval(() => {
        setIndex((prev) => (prev + 1) % data.result.length)
      }, 8000)
    }

    fetchData()

    return () => clearInterval(intervalId)
  }, [])

  if (banner.length === 0) return null // Optional loading state

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4">
      <div className="bg-transparent rounded-2xl overflow-hidden flex justify-center items-center">
        <img
          src={banner[Index].image}
          alt="img"
          className="lg:h-[450px] h-[170px]"
          onClick={() => navigate("/" + banner[Index].location)}
        />
      </div>
    </div>
  )
}

export default Banner

// className="w-full object-cover rounded-lg
//     max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[550px]"
