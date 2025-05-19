import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, saveCartToBackend } from "../../redux/cartSlice"
import ReviewForm from "./ReviewForm"

export default function ProductDetail() {
  const navigate = useNavigate()
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

  if (!product)
    return <div className="p-10 text-center text-lg">Loading product...</div>

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
    const cartObj = {
      name,
      description,
      salePrice,
      price,
      productId: _id,
      size: selectedSize,
      image: images[0],
    }

    if (!["accessories", "footwear"].includes(category) && !selectedSize) {
      alert("Please select a size.")
      return
    }

    const existingItem = items.some(
      (el) =>
        String(el.name) === String(cartObj.name) &&
        String(el.size) === String(cartObj.size)
    )

    dispatch(addToCart(cartObj))
    if (!existingItem) {
      dispatch(saveCartToBackend())
    }
  }

  const discount = Math.round(100 - (price / salePrice) * 100)
  const defaultTag = [brandName, gender, category]
  const showSizes = category !== "footwear" && category !== "accessories"

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <ImageCarousel
          images={images}
          mainImage={mainImage}
          setMainImage={setMainImage}
        />

        <div className="flex-1 lg:ml-0 ml-4">
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <h2 className="text-lg text-gray-500 mb-4">by {brandName}</h2>

          <ProductTags tags={tags ? tags : defaultTag} />
          <p className="text-gray-700 my-4 leading-relaxed">{description}</p>

          <ProductPrice
            price={price}
            salePrice={salePrice}
            discount={discount}
          />

          {stock === 0 ? (
            <p className="text-red-600 font-semibold mb-4">Out of Stock</p>
          ) : (
            stock < 10 && (
              <p className="text-orange-600 font-semibold mb-4">
                Hurry! Only {stock} left.
              </p>
            )
          )}

          {showSizes && (
            <SizeSelector
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          )}

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={addCart}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all"
            >
              <i className="fas fa-shopping-cart mr-2"></i>Add to Cart
            </button>
            <button
              onClick={() => navigate(`/reviews/${_id}`)}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-all"
            >
              See All Reviews
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ReviewForm productId={_id} />
      </div>
    </div>
  )
}

// ----------------- Subcomponents -----------------

function ImageCarousel({ images, mainImage, setMainImage }) {
  const prev = () =>
    setMainImage((prev) => (prev - 1 + images.length) % images.length)
  const next = () => setMainImage((prev) => (prev + 1) % images.length)

  return (
    <div className="relative w-full lg:w-[50%]">
      <img
        src={images[mainImage]}
        alt="Product"
        className="w-full h-[500px] object-contain rounded-xl shadow-md"
      />
      <button
        onClick={prev}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
      >
        &lt;
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
      >
        &gt;
      </button>
    </div>
  )
}

function ProductTags({ tags }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

function ProductPrice({ price, salePrice, discount }) {
  return (
    <p className="text-xl font-semibold mb-2">
      <span className="line-through text-gray-400 mr-3">
        ₹{price.toFixed(2)}
      </span>
      <span className="text-red-600 text-2xl">₹{salePrice.toFixed(2)}</span>
      <span className="text-green-600 text-base ml-2">({discount}% OFF)</span>
    </p>
  )
}

function SizeSelector({ selectedSize, setSelectedSize }) {
  const sizes = ["S", "M", "L", "XL", "XXL"]

  return (
    <div className="mb-6">
      <p className="text-lg font-medium mb-2">
        Select Size:{" "}
        <span className="text-gray-600 font-normal">
          {selectedSize || "None"}
        </span>
      </p>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`px-4 py-2 border-2 rounded-full transition-all ${
              selectedSize === size
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white border-gray-300"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
