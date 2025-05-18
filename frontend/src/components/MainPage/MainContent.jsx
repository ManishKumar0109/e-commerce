import Banner from "./Content/Banner"
import Brand from "./Content/Brand"
import Category from "./Content/Category"
const MainContent = () => {
  return (
    <div className="h-full pb-50 lg:pb-6  w-full lg:px-20 lg:p-28 flex flex-col gap-16 overflow-x-hidden overflow-y-scroll bg-gradient-to-b from-white  via-white to-pink-300">
      <Banner />
      <Brand />
      <Category />
    </div>
  )
}

export default MainContent
