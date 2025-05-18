import React, { useState, useEffect } from "react"

const AddProduct = () => {
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
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 👈 if you're using cookies for auth
        })
        const data = await res.json()
        setBrands(data.result || [])
      } catch (error) {
        console.error("Failed to fetch brands 💔", error)
      }
    }

    fetchBrands()
  }, [])

  const handleAddProduct = async () => {
    if (!selectedBrandId || brands.length <= 0) {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addproducts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 again, for auth via cookie
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Product added successfully 😚")
        setProductData({
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
        setSelectedBrandId("")
        setSelectedBrandName("")
      } else {
        alert(data.message || "Failed to add product 😩")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong 😭")
    }
  }

  return (
    <div className="h-[87%] w-full bg-gray-950 py-8">
      <div className="max-w-3xl lg:w-[60%] w-full bg-slate-800 text-white border-2 border-blue-500  p-6 rounded shadow-md h-full flex flex-col mx-auto overflow-y-scroll">
        <h1 className="text-2xl font-bold mb-4">Add Product</h1>

        <div className="space-y-4">
          {/* Brand Dropdown */}
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

          {/* Other Inputs ... */}
          {/* (No changes needed below this point except as required) */}

          <InputField
            label="Product Name"
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
          />
          {/* ... rest of fields stay the same ... */}
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

          {/* Price and Sale Price */}
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

          {/* Images */}
          <InputField
            label="Image URLs ($-dollar separated)"
            value={productData.images}
            onChange={(e) =>
              setProductData({ ...productData, images: e.target.value })
            }
          />

          {/* Category */}
          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <select
              className="w-full border p-2 rounded"
              value={productData.category}
              onChange={(e) =>
                setProductData({ ...productData, category: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="footwear">Footwear</option>
              <option value="upper">Upper</option>
              <option value="bottom">Bottom</option>
              <option value="accessories">Accessories</option>
              <option value="innerwear">Innerwear</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-semibold">Gender</label>
            <select
              className="w-full border p-2 rounded"
              value={productData.gender}
              onChange={(e) =>
                setProductData({ ...productData, gender: e.target.value })
              }
            >
              <option value="unisex">Unisex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              rows="3"
              value={productData.description}
              onChange={(e) =>
                setProductData({ ...productData, description: e.target.value })
              }
            />
          </div>

          {/* Tags */}
          <InputField
            label="Tags (comma separated)"
            value={productData.tags}
            onChange={(e) =>
              setProductData({ ...productData, tags: e.target.value })
            }
          />

          <div className="flex justify-end">
            <button
              onClick={handleAddProduct}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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

export default AddProduct
