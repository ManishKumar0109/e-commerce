import { useEffect, useState } from "react"
import { getAuth, signOut } from "firebase/auth"

async function fetchProfile(setFormData) {
  try {
    const raw = await fetch(`${import.meta.env.VITE_API_URL}/user/getProfile`, {
      method: "GET",
      credentials: "include",
    })
    const data = await raw.json()
    setFormData(data)
  } catch (err) {
    console.error("Error fetching profile:", err)
  }
}

async function updateProfile(formData) {
  try {
    const raw = await fetch(
      `${import.meta.env.VITE_API_URL}/user/updateProfile`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone: formData.phone,
          address: formData.address,
        }),
      }
    )
    const data = await raw.json()
    if (!raw.ok) throw new Error(data.message || "Failed to update profile")
    alert("Profile updated successfully!")
  } catch (err) {
    console.error("Error updating profile:", err)
    alert("Failed to update profile.")
  }
}

async function backendLogout() {
  await fetch(`${import.meta.env.VITE_API_URL}/user/logout`, {
    method: "POST",
    credentials: "include",
  })
}

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "sample@gmail.com",
    phone: "",
    address: "",
  })

  useEffect(() => {
    fetchProfile(setFormData)
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
  }

  const handleLogout = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      await backendLogout()
      window.location.href = "/auth"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12">
      {/* Left panel: Profile info + form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-3xl p-8 lg:pt-8 pt-20 w-full max-w-md lg:max-w-lg flex flex-col gap-6 relative"
      >
        <h2 className="text-3xl font-extrabold text-amber-500 mb-4 text-center">
          Update Profile
        </h2>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="absolute lg:top-8 top-6 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md font-semibold transition duration-300"
          title="Logout"
        >
          Logout
        </button>

        {/* Profile fields */}
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              First Name
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              readOnly
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 uppercase"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Last Name
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              readOnly
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 uppercase"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Email
            </label>
            <input
              name="emailId"
              value={formData.emailId}
              readOnly
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength="10"
              placeholder="Enter phone number"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              rows={4}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 rounded-xl shadow-lg transition duration-300"
        >
          Save Changes
        </button>
      </form>

      {/* Right panel: Illustration or info */}
      <div className="hidden lg:flex flex-col items-center justify-center max-w-md p-8 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-3xl shadow-xl text-white text-center select-none">
        <h3 className="text-4xl font-extrabold mb-4">Welcome Back!</h3>
        <p className="text-lg">
          Manage your profile details and stay connected. Your info is secure
          with us.
        </p>
        {/* You can add an image or SVG here if you want */}
      </div>
    </div>
  )
}

export default Profile
