import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, saveCartToBackend } from "../../redux/cartSlice"
import ReviewForm from "./ReviewForm"
export default function ProductDetail() {
  const Navigate = useNavigate()
  const { id } = useParams()
  const items = useSelector((store) => store.cart.items)
  const [product, setProduct] = useState(null)
  const dispatch = useDispatch()
  const [mainImage, setMainImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/productdetail?id=${id}`,
          {
            credentials: "include",
          }
        )
        const data = await res.json()
        setProduct(data.Result)
      } catch (err) {}
    }

    fetchProduct()
  }, [id])

  if (!product) return <div className="p-4 text-center">Loading...</div>

  const {
    _id,
    name,
    description,
    brand,
    price,
    salePrice,
    stock,
    images,
    tags,
    rating,
    review,
    category,
    gender,
    brandName,
  } = product

  function addCart() {
    const cartObj = {}
    cartObj.name = name
    cartObj.description = description
    cartObj.salePrice = salePrice
    cartObj.price = price
    cartObj.productId = _id
    cartObj.size = selectedSize
    cartObj.image = images[0]
    if (!["accessories", "footwear"].includes(category) && !selectedSize) {
      alert("select size")
      return
    }
    const existingItem = items.some(
      (el) =>
        String(el.name) === String(cartObj.name) &&
        String(el.size) === String(cartObj.size)
    )
    dispatch(addToCart(cartObj))
    if (!existingItem) {
      console.log("work")
      dispatch(saveCartToBackend())
    }
  }

  const discount = Math.round(100 - (price / salePrice) * 100)
  const defaultTag = [brandName, gender, category]
  const showSizes = category !== "footwear" && category !== "accessories"

  return (
    <div className="px-4 py-6 border-8 border-amber-600 h-full overflow-y-auto  flex flex-col">
      <div className="flex flex-col  lg:flex-row">
        <ImageCarousel
          images={images}
          mainImage={mainImage}
          setMainImage={setMainImage}
        />

        <div className="flex-grow py-6 px-6">
          <div className="mb-6">
            <h1 className="text-[2rem] md:text-[2.5rem] font-semibold text-neutral-900 tracking-tight">
              {name}
            </h1>
            <h2 className="text-base md:text-lg text-neutral-500 mt-1">
              from{" "}
              <span className="text-neutral-700 font-medium">{brandName}</span>
            </h2>
          </div>

          <ProductTags tags={tags ? tags : defaultTag} />
          <p className="text-gray-700 my-4">{description}</p>

          <ProductPrice
            price={price}
            salePrice={salePrice}
            discount={discount}
          />
          {/* <ProductRating rating={rating} reviewCount={review.length} /> */}
          {stock < 10 && (
            <p className="text-red-600 font-semibold mb-4">
              Hurry! Only {stock} left in stock.
            </p>
          )}

          {showSizes && (
            <SizeSelector
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          )}

          <ActionButtons
            onClick={() => {
              addCart()
            }}
          />
        </div>
      </div>
      <ReviewForm productId={product._id} />

      {/* ✅ See All Reviews Button */}
      <button
        onClick={() => Navigate(`/reviews/${_id}`)}
        className="mt-4 mx-auto  bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        See All Reviews
      </button>
    </div>
  )
}

// ---------------------- Subcomponents ----------------------

function ImageCarousel({ images, mainImage, setMainImage }) {
  const prev = () =>
    setMainImage((prev) => (prev - 1 + images.length) % images.length)
  const next = () => setMainImage((prev) => (prev + 1) % images.length)

  return (
    <div className="w-full lg:w-[40%] lg:h-[70vh] flex items-center justify-center relative  ">
      <img
        src={images[mainImage]}
        alt="Product"
        className="w-110 h-96 lg:h-full object-contain  lg:ml-6  "
      />
      <button
        onClick={prev}
        className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 rounded-full px-3 py-1"
      >
        &lt;
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/40 rounded-full px-3 py-1"
      >
        &gt;
      </button>
    </div>
  )
}

function ProductTags({ tags }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {tags.map((tag, i) => (
        <span key={i} className="bg-gray-600 text-white px-3 py-1 rounded-full">
          {tag ?? "uni"}
        </span>
      ))}
    </div>
  )
}

function ProductPrice({ price, salePrice, discount }) {
  return (
    <p className="text-lg mb-2">
      <span className="line-through text-gray-500 mr-2">
        ₹{price.toFixed(2)}
      </span>
      <span className="text-red-600 font-bold text-xl">
        ₹{salePrice.toFixed(2)}
      </span>
      <span className="text-green-600 ml-2">({discount}% OFF)</span>
    </p>
  )
}

function ProductRating({ rating, reviewCount }) {
  return (
    <p className="text-base text-gray-700 mb-4">
      <i className="fas fa-star text-yellow-400"></i> <strong>Rating:</strong>{" "}
      {rating} ({reviewCount} reviews)
    </p>
  )
}

function SizeSelector({ selectedSize, setSelectedSize }) {
  const sizes = ["S", "M", "L", "XL", "XXL"]

  return (
    <div className="mb-6">
      <p className="text-lg font-semibold mb-2">
        Selected Size: {selectedSize}
      </p>
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => setSelectedSize(size)}
          className={`px-4 py-1 border rounded-full mr-2 ${
            selectedSize === size ? "bg-gray-400 text-white" : ""
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  )
}

function ActionButtons({ onClick }) {
  return (
    <div className="flex gap-4 mt-6">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg">
        <i className="fas fa-comment-dots mr-2"></i>Add Review
      </button>
      <button
        onClick={onClick}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
      >
        <i className="fas fa-shopping-cart mr-2"></i>Add to Cart
      </button>
    </div>
  )
}
