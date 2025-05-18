import { useRef, useState } from "react"

const handleSignup = async (formData, seterrormsg) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.Error?.ErrorMessage || "Something went wrong")
    }

    alert("Sign up successful. Please log in.")
  } catch (err) {
    seterrormsg(err.message)
    setTimeout(() => seterrormsg(null), 5000)
  }
}

const Signup = () => {
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const [errormsg, seterrormsg] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      emailId: emailRef.current.value,
      password: passwordRef.current.value,
    }
    await handleSignup(formData, seterrormsg)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
      <h2 className="text-3xl font-bold text-center w-full mb-2">Sign Up</h2>

      <input
        type="text"
        placeholder="First Name"
        ref={firstNameRef}
        className="w-full p-3 rounded-lg bg-black/50 border border-white placeholder-white text-white focus:outline-none"
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        ref={lastNameRef}
        className="w-full p-3 rounded-lg bg-black/50 border border-white placeholder-white text-white focus:outline-none"
        required
      />
      <input
        type="email"
        placeholder="Email"
        ref={emailRef}
        className="w-full p-3 rounded-lg bg-black/50 border border-white placeholder-white text-white focus:outline-none"
        required
      />
      <input
        type="password"
        placeholder="Password"
        ref={passwordRef}
        className="w-full p-3 rounded-lg bg-black/50 border border-white placeholder-white text-white focus:outline-none"
        required
      />
      <p className="text-sm text-gray-200 italic -mt-2">
        Password must include capital, small letters, a number, and a symbol.
      </p>

      {errormsg && (
        <p className="text-red-300 mt-1 text-sm text-center">{errormsg}</p>
      )}

      <button
        type="submit"
        className="w-3/4 max-w-xs py-3 mt-4 text-lg md:text-xl bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Create Account
      </button>
    </form>
  )
}

export default Signup
