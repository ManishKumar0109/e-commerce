import React, { useState } from "react"

const Banner = () => {
  const [bannerData, setBannerData] = useState({
    title: "",
    image: "",
    location: "",
  })

  const handleAddBanner = async () => {
    if (!bannerData.title || !bannerData.image || !bannerData.location) {
      alert("Fill all fields first, silly 😘")
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addbanner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bannerData),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Banner added successfully 🎉")
        setBannerData({ title: "", image: "", location: "" })
      } else {
        alert(data.message || "Failed to add banner 😩")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong 😭")
    }
  }

  return (
    <div className="h-[87%] w-full bg-gray-950 flex justify-center items-start p-6 overflow-y-scroll text-white">
      <div className="w-full max-w-3xl bg-gray-900 border border-blue-500 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-400">
          Manage Banner
        </h1>

        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={bannerData.title}
              onChange={(e) =>
                setBannerData({ ...bannerData, title: e.target.value })
              }
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <textarea
              rows="3"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.png"
              value={bannerData.image}
              onChange={(e) =>
                setBannerData({ ...bannerData, image: e.target.value })
              }
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={bannerData.location}
              onChange={(e) =>
                setBannerData({ ...bannerData, location: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleAddBanner}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition duration-200"
            >
              Add Banner
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
