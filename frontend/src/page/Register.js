import React, { useState } from "react";
import axios from "axios";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const register = async (e) => {
    e.preventDefault();

    axios.post("http://localhost:8070/auth/register", user, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error.response ? error.response.data : error.message);
      });

    alert("User added");
  };

  return (
    React.createElement("div", { className: "flex flex-col max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10" },
      React.createElement("div", { className: "self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white" }, "Create a new account"),
      React.createElement("span", { className: "justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400" },
        "Already have an account? ",
        React.createElement("a", { href: "/login", className: "text-sm text-blue-500 underline hover:text-blue-700" }, "Sign in")
      ),
      React.createElement("div", { className: "p-6 mt-8" },
        React.createElement("h1", null, "Register"),
        React.createElement("form", { onSubmit: register },
          [
            { name: "nic", placeholder: "NIC" },
            { name: "name", placeholder: "Name" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "address", placeholder: "Address" },
            { name: "phone", placeholder: "Phone" },
            { name: "dob", placeholder: "Date of Birth", type: "date" },
            { name: "password", placeholder: "Password", type: "password" },
          ].map(({ name, placeholder, type = "text" }) =>
            React.createElement("div", { key: name, className: "flex flex-col mb-2" },
              React.createElement("div", { className: "relative" },
                React.createElement("input", {
                  type,
                  name,
                  className: "rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent",
                  placeholder,
                  value: user[name],
                  onChange: handleChange,
                })
              )
            )
          ),
          React.createElement("div", { className: "flex flex-col mb-2" },
            React.createElement("div", { className: "relative" },
              React.createElement("select", {
                className: "rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent",
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
          React.createElement("button", {
            type: "submit",
            className: "py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg",
          }, "Register")
        )
      )
    )
  );
};

export default Register;
