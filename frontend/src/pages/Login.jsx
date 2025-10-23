import React, { useState } from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser, reset } from '../features/auth/authSlice'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const { isLoading , isError , isSuccess , user , message } = useSelector((state) => state.auth)

  useEffect(() => {
    if(isError){
        toast.error(message)
    }

    if(isSuccess || user) {
        toast.success(message)
        navigate('/dashboard')
        dispatch(reset())
    }
  },[isError, message, isSuccess, user , navigate ])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(formData))
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-[900px] h-[550px] flex rounded-2xl shadow-xl overflow-hidden">
        <div className="w-1/2 bg-[#043873] text-white flex flex-col justify-center items-center relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-12 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-12 right-16 w-16 h-16 bg-white/10 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold z-10">Hello Friend!</h2>
          <p className="text-sm mt-2 text-gray-200 text-center z-10 px-6">
            Enter your personal details and start your journey with us
          </p>
          <button
            onClick={() => navigate("/register")}
            className="mt-6 border border-white rounded-full px-8 py-2 text-sm font-semibold hover:bg-white hover:text-[#043873] transition-all duration-300 z-10"
          >
            SIGN UP
          </button>
        </div>

        <div className="w-1/2 bg-white flex flex-col justify-center items-center px-12">
          <h2 className="text-2xl font-semibold text-[#FFB100] mb-1">
            Sign In to Your Account
          </h2>

          <form onSubmit={onSubmit} className="w-full mt-5 space-y-5">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB100] focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB100] focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2 cursor-pointer hover:underline">
                Forgot password?
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FFB100] text-white font-semibold rounded-full hover:bg-[#e0a000] transition-all duration-300"
            >
              {isLoading ? "Signing in..." : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
