import { useNavigate } from "react-router-dom"
import category from "../../publicutil/clothing_categories.json"
const Category = () => {
  const navigate = useNavigate()

  return (
    <div className="lg:h-[170vh] h-[140vh] flex flex-col lg:px-0 px-2 pb-0">
      <h1 className="font-semibold text-gray-500 text-3xl my-4 ">Categories</h1>
      <div className="  h-[95%] px-2  flex flex-col">
        <h2 className="font-semibold text-gray-600 text-2xl mb-5">
          Women’s Collection
        </h2>
        <div className="flex overflow-x-scroll scroll-smooth gap-8 h-[40%] w-full rounded-xl hide-scrollbar">
          {category
            .filter((el) => el.gender === "female")
            .map((el, index) => (
              <div
                key={el.title + index}
                onClick={() => navigate(`/products/null/${el.category}/female`)}
                className="relative h-full flex-shrink-0 overflow-hidden rounded-xl"
              >
                <img
                  src={el.image}
                  alt={el.title}
                  className="h-full rounded-xl shadow-md object-cover transition-transform duration-300 ease-in-out hover:scale-110  "
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-lg sm:text-base px-2 py-1 text-center backdrop-blur-sm rounded-b-xl">
                  {el.title}
                </div>
              </div>
            ))}
        </div>

        <h2 className="font-semibold text-gray-600 text-2xl my-5">
          Men’s Collection
        </h2>
        <div className="flex overflow-x-scroll scroll-smooth gap-8 h-[40%] w-full rounded-xl hide-scrollbar ">
          {category
            .filter((el) => el.gender === "male")
            .map((el, index) => (
              <div
                onClick={() => navigate(`/products/null/${el.category}/male`)}
                key={index}
                className="relative h-full flex-shrink-0 rounded-xl overflow-hidden"
              >
                <img
                  src={el.image}
                  alt={el.title}
                  className="h-full rounded-xl shadow-md object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-lg sm:text-base px-2 py-1 text-center backdrop-blur-sm rounded-b-xl">
                  {el.title}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Category
