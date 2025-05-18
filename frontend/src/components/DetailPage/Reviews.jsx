import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const dummyReviews = [
  {
    userId: { name: "Rohit Sharma" },
    text: "Amazing quality, exceeded expectations!",
    rating: 5,
  },
  {
    userId: { name: "Priya Mehta" },
    text: "Product was decent, packaging could improve.",
    rating: 3,
  },
  {
    userId: { name: "Aman Verma" },
    text: "Not happy with the purchase. Poor quality.",
    rating: 1,
  },
  {
    userId: { name: "Sneha Gupta" },
    text: "Absolutely loved it. Highly recommended!",
    rating: 4,
  },
  {
    userId: { name: "Rajesh Kumar" },
    text: "Below average, expected better.",
    rating: 2,
  },
]

async function getReviews(setReviews, productId) {
  try {
    const raw = await fetch(
      `${import.meta.env.VITE_API_URL}/reviews/${productId}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
    const data = await raw.json()(data)
    if (data?.result) {
      setReviews(data.result)(data.result)
    }
  } catch (error) {
    console.error("Error fetching reviews:", error)
  }
}

export default function ReviewPage() {
  const [sortOrder, setSortOrder] = useState("positive")
  const [reviews, setReviews] = useState([])
  const navigate = useNavigate()

  // Replace with actual dynamic productId or prop
  const { productId } = useParams()

  useEffect(() => {
    getReviews(setReviews, productId)
  }, [productId])

  const sortedReviews = [...reviews].sort((a, b) =>
    sortOrder === "positive" ? b.rating - a.rating : a.rating - b.rating
  )

  const getStars = (rating) => (
    <div className="text-yellow-400">
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={`fa-star ${i < rating ? "fas" : "far"} mr-1`}></i>
      ))}
    </div>
  )

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((acc, r) => acc + r.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => {
      counts[r.rating]++
    })
    return counts
  }

  const ratingCounts = getRatingCounts()
  const avgRating = getAverageRating()

  if (reviews.length <= 0) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        No reviews yet
      </div>
    )
  }

  return (
    <div className="bg-gray-100  hide-scrollbar py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>

      <div className="max-w-4xl mx-auto h-[95%] hide-scrollbar overflow-hidden">
        {/* Header and Sort */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Customer Reviews</h2>
          <button
            onClick={() =>
              setSortOrder((prev) =>
                prev === "positive" ? "negative" : "positive"
              )
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
          >
            Sort:{" "}
            {sortOrder === "positive" ? "Positive First" : "Negative First"}
          </button>
        </div>

        {/* Summary Box */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-2xl font-semibold text-gray-800">
              Average Rating: {avgRating} / 5
            </div>
            <div className="flex flex-wrap gap-4 text-gray-700 ">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-1">
                  <span className="text-yellow-500">{star}★</span>:
                  <span className="font-medium">{ratingCounts[star]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-6 ">
          {sortedReviews.map((review, idx) => {
            const name =
              review?.userId?.firstName || review?.userId?.toString() || "User"
            const firstLetter = name.charAt(0).toUpperCase()

            return (
              <div
                key={idx}
                className="bg-white shadow-md rounded-lg p-6 flex items-start gap-4"
              >
                {/* Avatar */}
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {firstLetter}
                </div>

                {/* Review content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {name}
                  </h3>
                  {getStars(review.rating)}
                  <p className="text-gray-700 mt-2">{review.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
