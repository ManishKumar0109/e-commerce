import { useEffect, useState } from "react"

const Orders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getorder`, {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json()
        if (res.ok) {
          setOrders(data.orders)
        } else {
          console.error("Failed to fetch orders")
        }
      } catch (err) {
        console.error("Error fetching orders:", err)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="h-[100%] w-full flex items-center overflow-hidden justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-3xl h-[75vh] lg:h-[80vh] overflow-y-auto rounded-2xl hide-scrollbar backdrop-blur-md bg-white/30 border border-blue-300 shadow-2xl p-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center drop-shadow-sm">
          🛍️ My Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg mt-10">
            No orders yet <span className="text-xl">😢</span>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="mb-6 bg-white/60 border border-blue-100 rounded-xl p-4 shadow-md hover:shadow-lg transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                <div>
                  <p className="text-gray-700 font-medium">
                    🗓️ Order Date:{" "}
                    <span className="text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-gray-700 font-medium">
                    🚚 Status:{" "}
                    <span
                      className={`capitalize font-semibold ${
                        order.status === "pending"
                          ? "text-orange-400"
                          : order.status === "shipped"
                          ? "text-blue-500"
                          : order.status === "delivered"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 font-medium">
                    💰 Amount: ₹
                    <span className="text-gray-500">{order.totalAmount}</span>
                  </p>
                  <p className="text-gray-700 font-medium">
                    💳 Payment:{" "}
                    <span
                      className={`capitalize font-semibold ${
                        order.paymentStatus === "done"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-gray-700 font-medium mb-1">🛒 Products:</p>
                <ul className="list-disc list-inside text-gray-600 ml-2">
                  {order.product.map((prod, index) => (
                    <li key={index}>
                      {prod.productId?.name || "Unknown Product"} (
                      {prod.productId?.category || "Unknown Category"}) - Qty:{" "}
                      {prod.quantity}
                      {prod.size ? ` - Size: ${prod.size}` : ""}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-gray-700 font-medium">📍 Delivery Address:</p>
              <p className="text-gray-500">{order.address}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
