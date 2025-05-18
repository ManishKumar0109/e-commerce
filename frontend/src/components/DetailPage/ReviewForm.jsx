import React, { useState } from "react"

const ReviewForm = ({ productId }) => {
  const [text, setText] = useState("")
  const [rating, setRating] = useState(5)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/addreview`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        text,
        rating,
      }),
    })

    const newReview = await response.json()
    // call parent function
    setText("")
    setRating(5)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-xl p-4 shadow mt-24 space-y-6 lg:w-[70%] w-[96%] h-[50%] mx-auto"
    >
      <h3 className="text-lg font-semibold">Add Your Review</h3>
      <textarea
        className="w-full border rounded p-2"
        placeholder="Write your review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Rating:</label>
        <select
          className="border rounded p-1"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} ⭐
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 "
      >
        Submit Review
      </button>
    </form>
  )
}

export default ReviewForm
