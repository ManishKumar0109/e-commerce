import React, { useEffect, useState } from "react"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [showDeliveredOnly, setShowDeliveredOnly] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState({})

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getorder`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        const data = await res.json()
        if (res.ok) {
          setOrders(data.orders)
        } else {
          console.error("Error fetching orders:", data.message)
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err)
      }
    }

    fetchOrders()
  }, [])

  const handleTempStatusChange = (orderId, newStatus) => {
    setSelectedStatuses((prev) => ({ ...prev, [orderId]: newStatus }))
  }

  const handleConfirmStatusUpdate = async (orderId) => {
    const updatedStatus = selectedStatuses[orderId]
    if (!updatedStatus) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/updateorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ orderId, status: updatedStatus }),
      })

      const data = await res.json()

      if (res.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: updatedStatus } : order
          )
        )
        setSelectedStatuses((prev) => {
          const newState = { ...prev }
          delete newState[orderId]
          return newState
        })

        alert("Status updated successfully!")
      } else {
        alert(data.message || "Failed to update status")
      }
    } catch (err) {
      console.error("Update failed:", err)
    }
  }

  const filteredOrders = showDeliveredOnly
    ? orders.filter((order) => order.status === "delivered")
    : orders.filter((order) => order.status !== "delivered")

  return (
    <div className="p-4 text-white h-[87%] overflow-y-scroll bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <label className="flex items-center gap-2 text-gray-200 font-medium">
          <input
            type="checkbox"
            checked={showDeliveredOnly}
            onChange={() => setShowDeliveredOnly(!showDeliveredOnly)}
            className="w-5 h-5 accent-green-500"
          />
          Show Delivered Only
        </label>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-400">No orders found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border border-blue-600 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-6 max-w-4xl  w-full mx-auto space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {order.user?.name || "Unknown User"}
                </h2>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-600"
                      : order.status === "shipped"
                      ? "bg-blue-600"
                      : order.status === "delivered"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div>
                <p className="font-semibold">Products:</p>
                <ul className="list-disc ml-5 text-sm">
                  {order.product.map((p, i) => (
                    <li key={i}>
                      <a
                        href={`/product/${p.productId._id}`}
                        className="text-yellow-400 hover:text-yellow-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {p.productId.name}
                      </a>{" "}
                      - Qty: {p.quantity} {p.size && `| Size: ${p.size}`}
                    </li>
                  ))}
                </ul>
              </div>

              <p>
                <span className="font-semibold">Address:</span> {order.address}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div>
                  <label className="font-semibold">Update Status:</label>{" "}
                  <select
                    value={selectedStatuses[order._id] || order.status}
                    onChange={(e) =>
                      handleTempStatusChange(order._id, e.target.value)
                    }
                    className="bg-gray-200 text-black px-3 py-1 rounded-md focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>

                {selectedStatuses[order._id] && (
                  <button
                    onClick={() => handleConfirmStatusUpdate(order._id)}
                    className="bg-green-600 hover:bg-green-700 transition-colors text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Confirm Update
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-300">
                <p>
                  <span className="font-semibold">Order Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Total Amount:</span> ₹
                  {order.totalAmount}
                </p>
                <p>
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {order.paymentMethod.toUpperCase()}
                </p>
                <p>
                  <span className="font-semibold">Payment Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === "done"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
