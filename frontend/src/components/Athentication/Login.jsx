import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { signIn } from "../../firebase"

const fetchcall = async (firebasetoken, navigate) => {
  const response = await fetch("http://localhost:3000/user/verifytoken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firebasetoken }),
    credentials: "include",
  })
  const data = await response.json()
  if (response.ok) {
    navigate("/")
  } else {
    alert("Something went wrong !!")
  }
}

const Login = () => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [errormsg, seterrormsg] = useState(null)
  const [token, settoken] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const email = emailRef.current.value
      const password = passwordRef.current.value
      const token = await signIn(email, password)
      settoken(token)
    } catch (err) {
      seterrormsg(err.message)
    }
  }

  if (token) fetchcall(token, navigate)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
      <h2 className="text-3xl font-bold text-center w-full mb-2">Login</h2>

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

      {errormsg && (
        <p className="text-red-300 mt-1 text-sm text-center">{errormsg}</p>
      )}

      <button
        type="submit"
        className="w-3/4 max-w-xs py-3 mt-4 text-lg md:text-xl bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Login
      </button>
    </form>
  )
}

export default Login
