import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    const { nic, name, email, address, phone, dob, gender, password, role } = user;
    if (!nic || !name || !email || !address || !phone || !dob || !gender || !password || !role) {
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
      .post("http://localhost:8070/auth/register", user, {
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
        console.error("Error:", error.response ? error.response.data : error.message);
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.response?.data?.message || "Failed to register. Please try again.",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setLoading(false); // Set loading to false when request finishes
      });
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
      <div className="flex flex-col max-w-lg px-8 py-10 bg-white rounded-xl shadow-xl mt-10 mb-16 dark:bg-gray-800 sm:px-16 md:px-20 lg:px-24">
        <div className="self-center mb-6 text-2xl font-semibold text-gray-800 sm:text-3xl dark:text-white">
          Create a New Account
        </div>
        <span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-sm font-medium text-purple-600 underline hover:text-purple-800">
            Sign in
          </a>
        </span>
        <div className="p-6 mt-6">
          <h1 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Register</h1>
          <form onSubmit={register}>
            {[ 
              { name: "nic", placeholder: "Enter your NIC" },
              { name: "name", placeholder: "Enter your Name" },
              { name: "email", placeholder: "Enter your Email", type: "email" },
              { name: "address", placeholder: "Enter your Address" },
              { name: "phone", placeholder: "Enter your Phone Number" },
              { name: "dob", placeholder: "Select your Date of Birth", type: "date" }
            ].map(({ name, placeholder, type = "text" }) => (
              <div key={name} className="flex flex-col mb-4">
                <label className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">
                  {placeholder}
                </label>
                <div className="relative">
                  <input
                    type={type}
                    name={name}
                    className="rounded-lg border border-gray-300 w-full py-3 px-4 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-purple-400"
                    placeholder={placeholder}
                    value={user[name]}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ))}
            
            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">Select Gender</label>
              <div className="relative">
                <select
                  className="rounded-lg border border-gray-300 w-full py-3 px-4 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-purple-400"
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">Select Role</label>
              <div className="relative">
                <select
                  className="rounded-lg border border-gray-300 w-full py-3 px-4 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-purple-400"
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="visitor">Visitor</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">Create a Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  className="rounded-lg border border-gray-300 w-full py-3 px-4 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-purple-400"
                  placeholder="Create a Password"
                  value={user.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;