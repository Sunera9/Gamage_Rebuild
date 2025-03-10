import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../section/Header2";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validate the form before submission
  const validateForm = () => {
    const { email, password, role } = credentials;
    if (!email || !password || !role) {
      Swal.fire({
        icon: "warning",
        title: "Please fill in all fields",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonText: "OK",
      });
      return false;
    }

    return true;
  };

  const login = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // Show loading state

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      // API call to login
      const response = await axios.post(
        `${backendUrl}/auth/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      console.log(credentials);

      // Store token, role, and email in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ token: response.data.token, role: response.data.role })
      );
      localStorage.setItem("userEmail", credentials.email); // Store user email

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonText: "OK",
      }).then(() => {
        // Navigate based on role
        const role = response.data.role;
        if (role === "visitor") {
          navigate("/employee/joblist");
        } else if (role === "employee") {
          navigate("/profile");
        } else if (role === "admin") {
          navigate("/admin/dashboard");
        }
      });
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response
          ? error.response.data.message
          : "Invalid credentials. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[rgb(147,51,234)] to-blue-500">
        <div className="flex flex-col w-full max-w-lg px-8 py-10 bg-white rounded-xl shadow-xl mt-24 mb-16 dark:bg-gray-800 sm:px-10 md:px-14 lg:px-16">
          <div className="self-center mb-6 text-2xl font-semibold text-gray-800 sm:text-3xl dark:text-white text-center">
            Login to Your Account
          </div>

          <span className="text-sm text-center text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-purple-600 underline hover:text-purple-800"
            >
              Register now
            </a>
          </span>

          <div className="p-6 mt-6">
            <h1 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
              Login
            </h1>

            <form onSubmit={login}>
              {/* Email Input */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="rounded-lg border border-gray-300 w-full py-3 px-4 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-purple-400"
                  placeholder="Enter your Email"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="rounded-lg border border-gray-300 w-full py-3 px-4 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-purple-400"
                  placeholder="Enter your Password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>

              {/* Role Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">
                  Select Role
                </label>
                <select
                  className="rounded-lg border border-gray-300 w-full py-3 px-4 bg-gray-50 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-purple-400"
                  name="role"
                  value={credentials.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="visitor">Visitor</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white w-full transition duration-200 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
