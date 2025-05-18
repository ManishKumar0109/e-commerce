import React, { useState, useEffect } from "react"

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block mb-1 font-semibold">{label}</label>
    <input
      type={type}
      className="w-full border p-2 rounded"
      value={value}
      onChange={onChange}
    />
  </div>
)

const EditProduct = ({ productId }) => {
  const [brands, setBrands] = useState([])
  const [selectedBrandId, setSelectedBrandId] = useState("")
  const [selectedBrandName, setSelectedBrandName] = useState("")
  const [productData, setProductData] = useState({
    name: "",
    stock: 0,
    price: 0,
    salePrice: 0,
    images: "",
    tags: "",
    category: "",
    gender: "unisex",
    description: "",
  })

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getbrands`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
        const data = await res.json()
        setBrands(data.result)
      } catch (error) {
        console.error("Failed to fetch brands 💔", error)
      }
    }

    const fetchProduct = async () => {
      try {
        productId + " is the mk id"
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/productdetail?id=${productId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        )
        const data = await res.json()
        if (data?.Result) {
          setProductData({
            name: data.Result.name || "",
            stock: data.Result.stock || 0,
            price: data.Result.price || 0,
            salePrice: data.Result.salePrice || 0,
            images: data.Result.images ? data.Result.images.join("$") : "",
            tags: data.Result.tags ? data.Result.tags.join(", ") : "",
            category: data.Result.category || "",
            gender: data.Result.gender || "unisex",
            description: data.Result.description || "",
          })
          setSelectedBrandId(data.Result.brand || "")
          setSelectedBrandName(data.Result.brandName || "")
        }
      } catch (err) {
        console.error("Error fetching product:", err)
      }
    }

    fetchBrands()
    fetchProduct()
  }, [productId])

  const handleUpdateProduct = async () => {
    if (!selectedBrandId || brands.length === 0) {
      alert("Select a brand first, silly 😘")
      return
    }

    if (
      !productData.name ||
      !productData.price ||
      !productData.images ||
      !productData.category
    ) {
      alert("Please fill all required fields, hot stuff 🔥")
      return
    }

    const payload = {
      ...productData,
      tags: productData.tags.split(",").map((el) => el.trim()),
      brand: selectedBrandId,
      brandName: selectedBrandName,
      images: productData.images.split("$").map((el) => el.trim()),
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/updateproduct/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      )

      const data = await res.json()

      if (res.ok) {
        alert("Product updated successfully 😚")
      } else {
        alert(data.message || "Failed to update product 😩")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong 😭")
    }
  }

  return (
    <div className="h-[87%] w-full bg-transparent ">
      <div className="max-w-3xl lg:w-[60%] w-full bg-transparent p-6 rounded shadow-md h-full flex flex-col mx-auto overflow-y-scroll">
        <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

        <div className="space-y-4 bg-transparent">
          {/* Brand Selection */}
          <div>
            <label className="block mb-1 font-semibold">Select Brand</label>
            <div className="flex flex-wrap gap-2">
              {brands.length === 0
                ? "No Brands"
                : brands.map((brand) => (
                    <button
                      key={brand._id}
                      className={`px-4 py-2 rounded border hover:bg-gray-300 ${
                        selectedBrandId === brand._id
                          ? "bg-blue-600 text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => {
                        setSelectedBrandId(brand._id)
                        setSelectedBrandName(brand.name)
                      }}
                    >
                      {brand.name}
                    </button>
                  ))}
            </div>
          </div>

          {/* Form Inputs */}
          <InputField
            label="Product Name"
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
          />

          <InputField
            label="Stock"
            type="number"
            value={productData.stock}
            onChange={(e) =>
              setProductData({
                ...productData,
                stock: parseInt(e.target.value),
              })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Price"
              type="number"
              value={productData.price}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  price: parseFloat(e.target.value),
                })
              }
            />
            <InputField
              label="Sale Price"
              type="number"
              value={productData.salePrice}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  salePrice: parseFloat(e.target.value),
                })
              }
            />
          </div>

          <InputField
            label="Image URLs ($ separated)"
            value={productData.images}
            onChange={(e) =>
              setProductData({ ...productData, images: e.target.value })
            }
          />

          <InputField
            label="Tags (comma separated)"
            value={productData.tags}
            onChange={(e) =>
              setProductData({ ...productData, tags: e.target.value })
            }
          />

          <InputField
            label="Category"
            value={productData.category}
            onChange={(e) =>
              setProductData({ ...productData, category: e.target.value })
            }
          />

          <div>
            <label className="block mb-1 font-semibold">Gender</label>
            <select
              value={productData.gender}
              onChange={(e) =>
                setProductData({ ...productData, gender: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              value={productData.description}
              onChange={(e) =>
                setProductData({ ...productData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <button
            onClick={handleUpdateProduct}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProduct
