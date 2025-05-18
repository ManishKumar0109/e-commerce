import React, { useState, useEffect } from "react"
import EditProduct from "./EditProduct"

const Products = () => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 5
  const [editProfile, setEditProfile] = useState(false)
  const [editProfileID, setEditProfileID] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        credentials: "include",
      })
      const data = await response.json()
      setProducts(data.Result)
    } catch (err) {
      console.error("Error fetching products:", err)
    }
  }

  const handleEdit = (productId) => {
    setEditProfile(true)
    setEditProfileID(productId)
  }

  const handleBackToProducts = () => {
    setEditProfile(false)
    setEditProfileID("")
    fetchProducts() // refresh products after editing
  }

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/deleteproduct/${productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      )

      const data = await res.json()

      if (res.ok) {
        alert("Product deleted successfully ✅")
        fetchProducts()
      } else {
        alert(data.message || "Failed to delete product 😑")
      }
    } catch (err) {
      console.error("Error deleting product:", err)
      alert("Error deleting product ❌")
    }
  }

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )
  const totalPages = Math.ceil(products.length / productsPerPage)

  return (
    <div className="p-4 h-[87%] w-full overflow-auto text-white bg-gray-950">
      {/* Conditionally render either Products Table OR EditProduct */}
      {!editProfile ? (
        <>
          <h1 className="text-2xl font-bold mb-2 text-white">Products</h1>
          <p className="mb-2 text-white">Manage your product inventory here.</p>

          <table className="w-full table-auto bg-slate-800 shadow-lg rounded-md border-2 border-blue-500 ">
            <thead className="bg-gray-100 text-xl text-black">
              <tr>
                <th className="px-4 py-2 text-center">Image</th>
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Sale Price</th>
                <th className="px-4 py-2 text-center">Rating</th>
                <th className="px-4 py-2 text-center">Stock</th>
                <th className="px-4 py-2 text-center">Category</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-600">
                  <td className="px-4 py-2">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">{product.name}</td>
                  <td className="px-4 py-2 text-center">
                    ${product.salePrice}
                  </td>
                  <td className="px-4 py-2 text-center">{product.rating}</td>
                  <td className="px-4 py-2 text-center">{product.stock}</td>
                  <td className="px-4 py-2 capitalize text-center">
                    {product.category}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2 transition"
                      onClick={() => handleEdit(product._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition"
            >
              Previous
            </button>

            <span className="text-white text-lg">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <EditProduct
          productId={editProfileID}
          handleBack={handleBackToProducts}
        />
      )}
    </div>
  )
}

export default Products
