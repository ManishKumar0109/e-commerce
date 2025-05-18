import React, { useState } from "react"

const AddBrand = () => {
  const [name, setName] = useState("")
  const [isTopBrand, setIsTopBrand] = useState("no")
  const [image, setImage] = useState("")
  const [Description, setDescription] = useState("")

  const handleAddBrand = async () => {
    if (!name || !isTopBrand || !image || !Description) {
      alert("Please fill all fields, dummy 😘")
      return
    }

    try {
      const images = image.split("$").map((el) => el.trim())
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addbrands`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ${token}",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          isTopBrand,
          images,
          description: Description,
        }),
      })

      const data = await res.json()(data)

      if (res.ok) {
        alert("Brand added successfully, cutie!")
        setName("")
        setIsTopBrand("no")
        setImage("")
        setDescription("")
      } else {
        alert(data.message || "Failed to add brand 💔")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong 😢")
    }
  }

  return (
    <div className="h-[87%] w-full flex justify-center bg-gray-950 py-6  ">
      <div className=" h-[95%] bg-slate-800 text-white border-2 border-blue-600 lg:w-[70%] w-[90%] p-4 rounded-2xl ">
        <h1 className="text-2xl font-bold mb-4">Add Brand</h1>

        <div className="flex flex-col lg:gap-6 gap-10">
          <div>
            <label className="block mb-1 font-semibold">Brand Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Is Top Brand?</label>
            <select
              className=" w-[70%] border p-2 rounded"
              value={isTopBrand}
              onChange={(e) => setIsTopBrand(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Image URL</label>
            <textarea
              type="text"
              className="w-full border p-2 rounded"
              value={image}
              placeholder="Add image urls separated by $ (dollar)"
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Add Description</label>
            <textarea
              type="text"
              className="w-full border p-2 rounded"
              value={Description}
              placeholder="Add image urls separated by commas"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAddBrand}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add Brand
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBrand
