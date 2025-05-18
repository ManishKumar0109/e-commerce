import React, { useEffect, useState } from "react"

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [customersPerPage] = useState(10)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/getcustomers`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        )

        const data = await response.json()
        if (response.ok) {
          setCustomers(data.result || [])
        } else {
          console.error("Failed to fetch customers:", data)
        }
      } catch (error) {
        console.error("Error fetching customers:", error)
      }
    }

    fetchCustomers()
  }, [])

  const indexOfLastCustomer = currentPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  )
  const totalPages = Math.ceil(customers.length / customersPerPage)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="p-6 min-h-[87%] overflow-x-auto bg-gray-950 text-white">
      <h1 className="text-4xl font-extrabold text-white mb-4">Customers</h1>
      <p className="text-gray-400 mb-6">
        View and manage customer details here.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-blue-500 bg-gray-900 rounded-xl overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gray-800 text-blue-400 text-sm">
              <th className="px-4 py-3 border-b border-blue-500 text-left">
                Customer ID
              </th>
              <th className="px-4 py-3 border-b border-blue-500 text-left">
                Full Name
              </th>
              <th className="px-4 py-3 border-b border-blue-500 text-left">
                Email
              </th>
              <th className="px-4 py-3 border-b border-blue-500 text-left">
                Phone
              </th>
              <th className="px-4 py-3 border-b border-blue-500 text-left">
                Address
              </th>
              <th className="px-4 py-3 border-b border-blue-500 text-left">
                Admin Status
              </th>
              <th className="px-4 py-3 border-b border-blue-500 text-left">
                Cart Items
              </th>
              <th className="px-4 py-3 border-b border-blue-500 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr
                key={customer._id}
                className="hover:bg-gray-800 transition duration-200 text-sm"
              >
                <td className="px-4 py-3 border-b border-gray-700 truncate">
                  {customer._id}
                </td>
                <td className="px-4 py-3 border-b border-gray-700">
                  {customer.firstName} {customer.lastName}
                </td>
                <td className="px-4 py-3 border-b border-gray-700">
                  {customer.emailId}
                </td>
                <td className="px-4 py-3 border-b border-gray-700">
                  {customer.phone}
                </td>
                <td className="px-4 py-3 border-b border-gray-700">
                  {customer.address || "N/A"}
                </td>
                <td className="px-4 py-3 border-b border-gray-700">
                  {customer.isAdmin === "yes" ? (
                    <span className="text-green-400 font-semibold">Admin</span>
                  ) : (
                    "Customer"
                  )}
                </td>
                <td className="px-4 py-3 border-b border-gray-700">
                  {customer.cart.length}
                </td>
                <td className="px-4 py-3 border-b border-gray-700">
                  <button className="text-blue-500 hover:text-blue-300 font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav className="inline-flex items-center gap-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-40 rounded-l-md"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-2 border border-gray-600 ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-40 rounded-r-md"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}

export default Customers
