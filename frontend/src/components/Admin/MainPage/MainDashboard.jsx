import React, { useState, useEffect } from "react"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })

  const [lowStock, setLowStock] = useState([])
  const [mostSelling, setMostSelling] = useState([])

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/getstats`,
        {
          method: "GET",
          credentials: "include",
        }
      )
      const json = await response.json()

      const data = json.result
      setStats({
        totalOrders: data.totalOrders,
        totalRevenue: data.totalRevenue,
        totalProducts: data.totalProducts,
        totalCustomers: data.totalCustomers,
      })
      setLowStock(data.lowStock || [])
      setMostSelling(data.mostSell || [])
    } catch (err) {
      console.error("Failed to fetch stats:", err)
    }
  }

  return (
    <div className="lg:p-2 h-[87%] p-4  max-w-screen-xl mx-auto overflow-y-scroll ">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Admin Dashboard
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon="fas fa-box-open"
          label="Total Orders"
          value={stats.totalOrders}
          color="text-indigo-600"
        />
        <StatCard
          icon="fas fa-dollar-sign"
          label="Total Revenue"
          value={`$${stats.totalRevenue}`}
          color="text-green-500"
        />
        <StatCard
          icon="fas fa-cogs"
          label="Total Products"
          value={stats.totalProducts}
          color="text-yellow-500"
        />
        <StatCard
          icon="fas fa-users"
          label="Total Customers"
          value={stats.totalCustomers}
          color="text-blue-500"
        />
      </div>

      {/* Most Selling Products */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Most Selling Products
        </h2>
        {mostSelling.length === 0 ? (
          <p className="text-gray-500">No recent activity.</p>
        ) : (
          mostSelling.map((product) => (
            <div
              key={product._id}
              className="flex items-center text-sm text-gray-700 mb-2"
            >
              <i className="fas fa-circle text-green-500 mr-2"></i>
              <span className="flex-1 font-semibold">{product.name}</span>
              <span className="text-gray-500">{product.sold} sold</span>
            </div>
          ))
        )}
      </div>

      {/* Low Stock Products */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Low Stock Products
        </h2>
        {lowStock.length === 0 ? (
          <p className="text-gray-500">No products are low on stock.</p>
        ) : (
          lowStock.map((product) => (
            <div key={product._id} className="text-sm text-gray-600 mb-2">
              {product.name} – {product.stock} items left
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const StatCard = ({ icon, label, value, color }) => (
  <div className="p-6 bg-white shadow-md rounded-lg flex justify-between items-center hover:shadow-xl transition-all duration-200">
    <i className={`${icon} text-3xl ${color}`}></i>
    <div>
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className="font-bold text-xl">{value}</p>
    </div>
  </div>
)

export default Dashboard
