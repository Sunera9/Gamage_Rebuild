import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../section/Header2";

const Register = () => {
  const [user, setUser] = useState({
    nic: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validate form fields before submission
  const validateForm = () => {
    const { nic, name, email, address, phone, dob, gender, password, role } =
      user;
    if (
      !nic ||
      !name ||
      !email ||
      !address ||
      !phone ||
      !dob ||
      !gender ||
      !password ||
      !role
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields are required!",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Password Error",
        text: "Password should be at least 6 characters long.",
        confirmButtonText: "OK",
      });
      return false;
    }
    return true;
  };

  // Handle form submission
  const register = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // Set loading to true while submitting

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, user, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      .then((response) => {
        console.log("Response:", response.data);
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "User added successfully!",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login"); // Redirect to login page
        });
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:
            error.response?.data?.message ||
            "Failed to register. Please try again.",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setLoading(false); // Set loading to false when request finishes
      });
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-2-screen bg-gradient-to-r py-10 mt-12">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl max-w-4xl w-11/12 p-8 md:p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-4">
            Create a New Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-600 underline hover:text-purple-800"
            >
              Sign in
            </a>
          </p>

          <form onSubmit={register} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side Inputs */}
              <div className="space-y-4">
                {[
                  { name: "nic", placeholder: "Enter your NIC" },
                  { name: "name", placeholder: "Enter your Name" },
                  {
                    name: "email",
                    placeholder: "Enter your Email",
                    type: "email",
                  },
                ].map(({ name, placeholder, type = "text" }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {placeholder}
                    </label>
                    <input
                      type={type}
                      name={name}
                      className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={placeholder}
                      value={user[name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>

              {/* Right Side Inputs */}
              <div className="space-y-4">
                {[
                  { name: "address", placeholder: "Enter your Address" },
                  { name: "phone", placeholder: "Enter your Phone Number" },
                  {
                    name: "dob",
                    placeholder: "Select your Date of Birth",
                    type: "date",
                  },
                ].map(({ name, placeholder, type = "text" }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {placeholder}
                    </label>
                    <input
                      type={type}
                      name={name}
                      className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={placeholder}
                      value={user[name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Dropdowns (Full Width) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Select Gender
                </label>
                <select
                  name="gender"
                  className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Select Role
                </label>
                <select
                  name="role"
                  className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={user.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="visitor">Visitor</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>

            {/* Password Input (Full Width) */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Create a Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Create a Password"
                value={user.password}
                onChange={handleChange}
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg shadow-md transition ease-in duration-200 focus:ring-2 focus:ring-purple-500"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
