import { useEffect, useRef, useState } from "react"
import ProductCard from "./ProductCard"
import { useParams } from "react-router-dom"

const fetchProducts = async (parameter, setProducts, token) => {
  try {
    console.log(parameter)
    const raw = await fetch(
      `${import.meta.env.VITE_API_URL}/products?${parameter}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
    const data = await raw.json()
    console.log(data)
    setProducts(data.Result)
  } catch (err) {
    console.error(err.message)
  }
}

const Products = () => {
  const param = useParams()
  const { brand, category, gender } = param
  const filters = { brand, category, gender }
  const token = "random"
  const [products, setProducts] = useState([])
  const [sortBy, setSortBy] = useState("popularity")
  const [AllProducts, setAllProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const search = useRef(null)

  useEffect(() => {
    const parameter = new URLSearchParams(filters)
    const parameter2 = new URLSearchParams({
      brand: "null",
      category: "null",
      gender: "null",
    })
    fetchProducts(parameter2.toString(), setAllProducts, token)
    fetchProducts(parameter.toString(), setProducts, token)
  }, [brand, category, gender])

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "lowToHigh") return a.price - b.price
    if (sortBy === "highToLow") return b.price - a.price
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt)
    return 0
  })

  const sortedSearchResults = [...searchResults].sort((a, b) => {
    if (sortBy === "lowToHigh") return a.price - b.price
    if (sortBy === "highToLow") return b.price - a.price
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt)
    return 0
  })

  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase()
    if (value === "") {
      setSearchResults([]) // Clear search → show filtered normally
    } else {
      const filtered = AllProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(value) ||
          product.brandName.toLowerCase().includes(value)
      )
      setSearchResults(filtered)
    }
  }

  const productsToShow =
    searchResults.length > 0 || search.current?.value
      ? sortedSearchResults
      : sortedProducts

  return (
    <div className="flex-1 p-6 ">
      {/* Search Bar */}
      <div className="relative mb-6 lg:w-[70%] mx-auto w-[98%] ">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
        <input
          type="text"
          placeholder="Search products..."
          ref={search}
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-300 shadow focus:shadow-lg focus:outline-none transition-all text-base"
        />
      </div>

      {productsToShow.length === 0 ? (
        <div className="text-center p-6 text-gray-600">No Products Found</div>
      ) : (
        <>
          {/* Sort Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
            {[
              { key: "popularity", label: "Popularity" },
              { key: "lowToHigh", label: "Price: Low to High" },
              { key: "highToLow", label: "Price: High to Low" },
              { key: "newest", label: "Newest First" },
            ].map((sortOption) => (
              <button
                key={sortOption.key}
                onClick={() => setSortBy(sortOption.key)}
                className={`px-3 py-1 rounded-full border ${
                  sortBy === sortOption.key
                    ? "bg-black text-white"
                    : "text-gray-700"
                }`}
              >
                {sortOption.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ">
            {productsToShow.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Products
