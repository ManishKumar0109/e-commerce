import { Link } from "react-router-dom"

const ProductCard = ({ _id, images, name, price, salePrice, description }) => {
  return (
    <Link to={`/productdetail/${_id}`} className="block">
      <div className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition w-full">
        <img
          src={images}
          alt={name}
          className="w-full h-52 lg:h-80 object-cover rounded-md bg-amber-500"
        />
        <div className="mt-2 space-y-1">
          <h2 className="text-sm font-medium text-gray-800">{name}</h2>

          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-lg">₹{price}</span>
            {salePrice && (
              <>
                <span className="line-through text-gray-500 text-sm">
                  ₹{salePrice}
                </span>
                <span className="text-green-500 text-sm">
                  {Math.round(((salePrice - price) / salePrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* Optional short description */}
          <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
