import { useState } from "react"
import Signup from "./Signup"
import Login from "./Login"

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="relative h-screen w-full bg-black">
      <img
        src="/authbg.jpg"
        className="absolute object-cover h-full w-full"
        alt="auth background"
      />

      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="rounded-2xl border border-white bg-black/30 p-8 shadow-xl text-white w-[90%] max-w-lg">
          <div className="mb-4">{isLogin ? <Login /> : <Signup />}</div>

          <p className="text-center text-base mt-6">
            {isLogin ? (
              <>
                New user?{" "}
                <span
                  className="text-blue-400 underline cursor-pointer hover:text-blue-300"
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already a user?{" "}
                <span
                  className="text-blue-400 underline cursor-pointer hover:text-blue-300"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Authentication
