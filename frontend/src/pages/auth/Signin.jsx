import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signInStart, signInFailure, signInSuccess } from '../../redux/userSlice'

const Signin = () => {
  const [data, setData] = useState({
    email: "",
    password: ""
  })
  const [err, setErr] = useState(""); // Declare err state for errors

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value.trim('') })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      setErr("Please fill out all fields");
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api-v1/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        navigate('/dashboard')
       
        dispatch(signInSuccess(data));
        
      } else {
        setErr("Invalid credentials, please try again.");
      }
    } catch (error) {
      setErr("An error occurred, please try again later.");
      dispatch(signInFailure(error));
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign In</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* Error Message */}
          {err && <div className="mb-4 text-red-600 text-sm text-center">{err}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">Don't have an account? 
            <a href="/signup" className="text-blue-500 hover:underline"> Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signin;
