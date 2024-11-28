import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const register = async (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8070/auth/register", user, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response:", response.data);
        alert("User added successfully!");
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Error:", error.response ? error.response.data : error.message);
        alert("Failed to register. Please try again.");
      });
  };

  return (
    React.createElement("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-10" },
      React.createElement("div", { className: "flex flex-col max-w-lg px-8 py-10 bg-white rounded-xl shadow-xl mt-10 mb-16 dark:bg-gray-800 sm:px-16 md:px-20 lg:px-24" },
        React.createElement("div", { className: "self-center mb-6 text-2xl font-semibold text-gray-800 sm:text-3xl dark:text-white" }, "Create a New Account"),
        React.createElement("span", { className: "justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400" },
          "Already have an account? ",
          React.createElement("a", { href: "/login", className: "text-sm font-medium text-purple-600 underline hover:text-purple-800" }, "Sign in")
        ),
        React.createElement("div", { className: "p-6 mt-6" },
          React.createElement("h1", { className: "text-lg font-medium text-gray-700 dark:text-gray-300 mb-4" }, "Register"),
          React.createElement("form", { onSubmit: register },
            [
              { name: "nic", placeholder: "Enter your NIC" },
              { name: "name", placeholder: "Enter your Name" },
              { name: "email", placeholder: "Enter your Email", type: "email" },
              { name: "address", placeholder: "Enter your Address" },
              { name: "phone", placeholder: "Enter your Phone Number" },
              { name: "dob", placeholder: "Select your Date of Birth", type: "date" },
            ].map(({ name, placeholder, type = "text" }) =>
              React.createElement("div", { key: name, className: "flex flex-col mb-4" },
                React.createElement("label", { className: "text-sm font-medium text-gray-600 mb-1 dark:text-gray-400" }, placeholder),
                React.createElement("div", { className: "relative" },
                  React.createElement("input", {
                    type,
                    name,
                    className: "rounded-lg border border-gray-300 w-full py-3 px-4 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-purple-400",
                    placeholder,
                    value: user[name],
                    onChange: handleChange,
                  })
                )
              )
            ),
            React.createElement("div", { className: "flex flex-col mb-4" },
              React.createElement("label", { className: "text-sm font-medium text-gray-600 mb-1 dark:text-gray-400" }, "Select Gender"),
              React.createElement("div", { className: "relative" },
                React.createElement("select", {
                  className: "rounded-lg border border-gray-300 w-full py-3 px-4 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-purple-400",
                  name: "gender",
                  value: user.gender,
                  onChange: handleChange,
                },
                  React.createElement("option", { value: "" }, "Select Gender"),
                  React.createElement("option", { value: "Male" }, "Male"),
                  React.createElement("option", { value: "Female" }, "Female")
                )
              )
            ),
            React.createElement("div", { className: "flex flex-col mb-4" },
              React.createElement("label", { className: "text-sm font-medium text-gray-600 mb-1 dark:text-gray-400" }, "Create a Password"),
              React.createElement("div", { className: "relative" },
                React.createElement("input", {
                  type: "password",
                  name: "password",
                  className: "rounded-lg border border-gray-300 w-full py-3 px-4 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:ring-purple-400",
                  placeholder: "Create a Password",
                  value: user.password,
                  onChange: handleChange,
                })
              )
            ),
            React.createElement("button", {
              type: "submit",
              className: "py-3 px-6 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg",
            }, "Register")
          )
        )
      )
    )
  );
};

export default Register;
