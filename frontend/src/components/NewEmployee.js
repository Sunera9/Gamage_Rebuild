import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewEmployee = () => {
  // Employee data
  const initialFormData = {
    full_name: "",
    nic: "",
    email: "",
    phone: "",
    gender: "",
    birthdate: "",
    job_position: "",
    company: "",
    start_date: "",
    end_date: "",
  };

  // Error state
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialFormData);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate each field
    const newErrors = {};
    for (const key in formData) {
      if (!formData[key]) {
        newErrors[key] = `${key.replace(/_/g, " ")} is required`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8070/users/add", formData);
      alert("Employee added successfully");
      navigate("/employee");
    } catch (error) {
      alert("Failed to add employee");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center my-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          Employee Application
        </h1>
        <form id="employee-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Full Name:</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter full name..."
                className={`w-full p-2 border rounded ${
                  errors.full_name ? "border-red-500" : ""
                }`}
              />
              {errors.full_name && (
                <div className="text-red-700">{errors.full_name}</div>
              )}
            </div>

            <div>
              <label>NIC Number:</label>
              <input
                type="text"
                name="nic"
                className={`w-full p-2 border rounded ${
                  errors.nic ? "border-red-500" : ""
                }`}
                value={formData.nic}
                onChange={handleInputChange}
              />
              {errors.nic && <div className="text-red-700">{errors.nic}</div>}
            </div>

            <div>
              <label>E-mail:</label>
              <input
                type="email"
                name="email"
                className={`w-full p-2 border rounded ${
                  errors.email ? "border-red-500" : ""
                }`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <div className="text-red-700">{errors.email}</div>
              )}
            </div>

            <div>
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                pattern="[0-9]*"
                className={`w-full p-2 border rounded ${
                  errors.phone ? "border-red-500" : ""
                }`}
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && (
                <div className="text-red-700">{errors.phone}</div>
              )}
            </div>

            <div>
              <label>Gender:</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  className="mr-2"
                  checked={formData.gender === "Male"}
                  onChange={handleInputChange}
                />{" "}
                Male
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  className="ml-4 mr-2"
                  checked={formData.gender === "Female"}
                  onChange={handleInputChange}
                />{" "}
                Female
              </div>
              {errors.gender && (
                <div className="text-red-700">{errors.gender}</div>
              )}
            </div>

            <div>
              <label>Birth Date:</label>
              <input
                type="date"
                name="birthdate"
                className={`w-full p-2 border rounded ${
                  errors.birthdate ? "border-red-500" : ""
                }`}
                value={formData.birthdate}
                onChange={handleInputChange}
              />
              {errors.birthdate && (
                <div className="text-red-700">{errors.birthdate}</div>
              )}
            </div>

            <div>
              <label>Job Position:</label>
              <input
                type="text"
                name="job_position"
                className={`w-full p-2 border rounded ${
                  errors.job_position ? "border-red-500" : ""
                }`}
                value={formData.job_position}
                onChange={handleInputChange}
              />
              {errors.job_position && (
                <div className="text-red-700">{errors.job_position}</div>
              )}
            </div>

            <div>
              <label>Company:</label>
              <input
                type="text"
                name="company"
                className={`w-full p-2 border rounded ${
                  errors.company ? "border-red-500" : ""
                }`}
                value={formData.company}
                onChange={handleInputChange}
              />
              {errors.company && (
                <div className="text-red-700">{errors.company}</div>
              )}
            </div>

            <div className="col-span-2">
              <label>Time period:</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    name="start_date"
                    className={`w-full p-2 border rounded ${
                      errors.start_date ? "border-red-500" : ""
                    }`}
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                  {errors.start_date && (
                    <div className="text-red-700">{errors.start_date}</div>
                  )}
                </div>
                <div>
                  <input
                    type="date"
                    name="end_date"
                    className={`w-full p-2 border rounded ${
                      errors.end_date ? "border-red-500" : ""
                    }`}
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                  {errors.end_date && (
                    <div className="text-red-700">{errors.end_date}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button type="button" className="px-6 py-2 border rounded">
              CANCEL
            </button>
            <button type="submit" className="px-6 py-2 border rounded">
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEmployee;
