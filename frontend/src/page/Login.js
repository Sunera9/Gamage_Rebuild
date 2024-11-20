import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Login.css'

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const login = () => {
    if (!user.email || !user.password) {
      alert("Please fill in all fields.");
      return;
    }

    axios
      .post("http://localhost:8070/auth/login", user)
      .then((res) => {
        alert(res.data.message);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "An error occurred. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
          autoComplete="off"
        >
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="mt-1">
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-600 focus:border-purple-600 text-gray-700"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-600 focus:border-purple-600 text-gray-700"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="button"
              onClick={login}
              className="w-full px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 ease-in-out"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
