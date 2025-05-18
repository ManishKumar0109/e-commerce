import React, { Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"

import "./index.css"
import store from "./redux/store.js"

// Loading fallback component
const Loading = () => (
  <div className="text-center mt-10 text-lg">Loading...</div>
)

// Lazy imports
const App = lazy(() => import("./App.jsx"))
const MainPage = lazy(() => import("./components/MainPage/MainPage.jsx"))
const MainContent = lazy(() => import("./components/MainPage/MainContent.jsx"))
const ProductPage = lazy(() => import("./components/Products/Products.jsx"))
const ProductDetail = lazy(() =>
  import("./components/DetailPage/ProductDetail.jsx")
)
const DetailPage = lazy(() => import("./components/DetailPage/DetailPage.jsx"))
const Authentication = lazy(() =>
  import("./components/Athentication/Authentication.jsx")
)
const Cart = lazy(() => import("./components/Cart/Cart.jsx"))
const Profile = lazy(() => import("./components/Profile/Profile.jsx"))
const UserOrders = lazy(() => import("./components/Orders/Orders.jsx"))
const BookOrder = lazy(() => import("./components/BookOrder/BookOrder.jsx"))
const Admin = lazy(() => import("./components/Admin/AdminPanel.jsx"))
const MainDashboard = lazy(() =>
  import("./components/Admin/MainPage/MainDashboard.jsx")
)
const Analytics = lazy(() =>
  import("./components/Admin/MainPage/Analytics.jsx")
)
const Orders = lazy(() => import("./components/Admin/MainPage/Orders.jsx"))
const Products = lazy(() => import("./components/Admin/MainPage/Products.jsx"))
const Customers = lazy(() =>
  import("./components/Admin/MainPage/Customers.jsx")
)
const Reports = lazy(() => import("./components/Admin/MainPage/Reports.jsx"))
const Transactions = lazy(() =>
  import("./components/Admin/MainPage/Transactions.jsx")
)
const Banner = lazy(() => import("./components/Admin/MainPage/Banner.jsx"))
const Stock = lazy(() => import("./components/Admin/MainPage/Stock.jsx"))
const AddProduct = lazy(() =>
  import("./components/Admin/MainPage/AddProduct.jsx")
)
const AddBrand = lazy(() => import("./components/Admin/MainPage/AddBrand.jsx"))
const Brand = lazy(() => import("./components/Admin/MainPage/Brand.jsx"))
const Reviews = lazy(() => import("./components/DetailPage/Reviews.jsx"))
const NotFoundPage = lazy(() => import("./components/NotFoundPage.jsx"))

const suspenseWrap = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
)

const router = createBrowserRouter([
  {
    path: "/",
    element: suspenseWrap(MainPage),
    children: [
      { path: "/", element: suspenseWrap(MainContent) },
      {
        path: "products/:brand/:category/:gender",
        element: suspenseWrap(ProductPage),
      },
      { path: "productdetail/:id", element: suspenseWrap(ProductDetail) },
      { path: "bag", element: suspenseWrap(Cart) },
      { path: "orders", element: suspenseWrap(UserOrders) },
      { path: "bookorder", element: suspenseWrap(BookOrder) },
      { path: "profile", element: suspenseWrap(Profile) },
      { path: "reviews/:productId", element: suspenseWrap(Reviews) },
    ],
  },
  {
    path: "/",
    element: suspenseWrap(App),
    children: [
      { path: "auth", element: suspenseWrap(Authentication) },
      { path: "detail", element: suspenseWrap(DetailPage) },
      {
        path: "admin",
        element: suspenseWrap(Admin),
        children: [
          { path: "dashboard", element: suspenseWrap(MainDashboard) },
          { path: "analytics", element: suspenseWrap(Analytics) },
          { path: "orders", element: suspenseWrap(Orders) },
          { path: "products", element: suspenseWrap(Products) },
          { path: "customers", element: suspenseWrap(Customers) },
          { path: "reports", element: suspenseWrap(Reports) },
          { path: "transactions", element: suspenseWrap(Transactions) },
          { path: "managestock", element: suspenseWrap(Stock) },
          { path: "managebanner", element: suspenseWrap(Banner) },
          { path: "AddProduct", element: suspenseWrap(AddProduct) },
          { path: "AddBrand", element: suspenseWrap(AddBrand) },
          { path: "Brand", element: suspenseWrap(Brand) },
        ],
      },
    ],
  },
  {
    path: "*",
    element: suspenseWrap(NotFoundPage),
  },
])

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
