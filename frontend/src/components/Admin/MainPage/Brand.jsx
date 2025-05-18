import React, { useState, useEffect } from "react"

const Brand = () => {
  const [brands, setBrands] = useState([])
  const [banners, setBanners] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isBannerView, setIsBannerView] = useState(false)
  const brandsPerPage = 5

  useEffect(() => {
    fetchBanners()
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/getbrands`,
        {
          method: "GET",
          credentials: "include",
        }
      )
      const data = await response.json()
      setBrands(data.result)
    } catch (err) {
      console.error("Error fetching brands:", err)
    }
  }

  const fetchBanners = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/getbanners`,
        {
          method: "GET",
          credentials: "include",
        }
      )
      const data = await response.json()
      setBanners(data.result)
    } catch (err) {
      console.error("Error fetching banners:", err)
    }
  }

  const handleDelete = async (brandId) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/deletebrand`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ brandId }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Brand deleted successfully ✅")
        fetchBrands()
      } else {
        alert(data.message || "Failed to delete brand 😑")
      }
    } catch (err) {
      console.error("Error deleting brand:", err)
      alert("Error deleting brand ❌")
    }
  }

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/deletebanner`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bannerId }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Banner deleted successfully ✅")
        fetchBanners()
      } else {
        alert(data.message || "Failed to delete banner 😑")
      }
    } catch (err) {
      console.error("Error deleting banner:", err)
      alert("Error deleting banner ❌")
    }
  }

  const indexOfLastBrand = currentPage * brandsPerPage
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand)
  const totalPages = Math.ceil(brands.length / brandsPerPage)

  return (
    <div className="p-2 sm:p-4 h-[87%] w-full overflow-auto text-white bg-gray-950">
      {/* Toggle Buttons */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <button
          className={`${
            !isBannerView ? "bg-blue-600" : "bg-blue-500"
          } text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base`}
          onClick={() => setIsBannerView(false)}
        >
          Brands
        </button>
        <button
          className={`${
            isBannerView ? "bg-blue-600" : "bg-blue-500"
          } text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base`}
          onClick={() => setIsBannerView(true)}
        >
          Banners
        </button>
      </div>

      {!isBannerView ? (
        <>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Manage Brands</h1>
          <p className="mb-2 text-sm sm:text-base">
            Manage your product brands here.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full table-auto bg-slate-800 shadow-lg rounded-md border-2 border-blue-500 text-sm sm:text-base">
              <thead className="bg-gray-100 text-black">
                <tr>
                  <th className="px-2 py-2 text-center">Name</th>
                  <th className="px-2 py-2 text-center">Top Brand</th>
                  <th className="px-2 py-2 text-center">Description</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBrands.map((brand) => (
                  <tr key={brand._id} className="border-b hover:bg-gray-600">
                    <td className="px-2 py-2 text-center">{brand.name}</td>
                    <td className="px-2 py-2 text-center">
                      {brand.isTopBrand ? "Yes" : "No"}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {brand.description}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base transition"
                        onClick={() => handleDelete(brand._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-2 sm:gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition text-sm sm:text-base"
            >
              Previous
            </button>

            <span className="text-white text-sm sm:text-lg">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition text-sm sm:text-base"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Manage Banners</h1>
          <p className="mb-2 text-sm sm:text-base">
            Manage your homepage banners here.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full table-auto bg-slate-800 shadow-lg rounded-md border-2 border-blue-500 text-sm sm:text-base">
              <thead className="bg-gray-100 text-black">
                <tr>
                  <th className="px-2 py-2 text-center">Title</th>
                  <th className="px-2 py-2 text-center">Image</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner._id} className="border-b hover:bg-gray-600">
                    <td className="px-2 py-2 text-center">{banner.title}</td>
                    <td className="px-2 py-2 text-center">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="h-16 mx-auto rounded"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base transition"
                        onClick={() => handleDeleteBanner(banner._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Brand
