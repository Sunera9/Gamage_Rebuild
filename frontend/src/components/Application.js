import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Application = () => {
  // Employee data
  const initialFormData = {
    nic:"",
    name:"",
    email:"",
    phone:"",
    gender:"",
    dob:"",
    jobPosition:"",
    company:"",
    startDate:"",
    endDate:""
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
  
    const newErrors = {};
    for (const key in formData) {
      if (!formData[key]) {
        newErrors[key] = `${key.replace(/_/g, " ")} is required`;
      }
    }
  
    // Additional validation
    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "Invalid email format";
    }
    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone must contain only numbers";
    }
    if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
      newErrors.start_date = "Start date must be before end date";
      newErrors.end_date = "End date must be after start date";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log("FormData before sending:", formData);


    try {
      await axios.post(
        "http://localhost:8070/api/applications/add",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Employee added successfully");
      navigate("/employee");
    } catch (error) {
      alert("Failed to add employee");
      console.error("Error:", error.response?.data || error.message);
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name..."
                className={`w-full p-2 border rounded ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <div className="text-red-700">{errors.name}</div>
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
                name="dob"
                className={`w-full p-2 border rounded ${
                  errors.dob ? "border-red-500" : ""
                }`}
                value={formData.dob}
                onChange={handleInputChange}
              />
              {errors.dob && (
                <div className="text-red-700">{errors.dob}</div>
              )}
            </div>

            <div>
              <label>Job Position:</label>
              <input
                type="text"
                name="jobPosition"
                className={`w-full p-2 border rounded ${
                  errors.jobPosition ? "border-red-500" : ""
                }`}
                value={formData.jobPosition}
                onChange={handleInputChange}
              />
              {errors.jobPosition && (
                <div className="text-red-700">{errors.jobPosition}</div>
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
                    name="startDate"
                    className={`w-full p-2 border rounded ${
                      errors.startDate ? "border-red-500" : ""
                    }`}
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                  {errors.startDate && (
                    <div className="text-red-700">{errors.startDate}</div>
                  )}
                </div>
                <div>
                  <input
                    type="date"
                    name="endDate"
                    className={`w-full p-2 border rounded ${
                      errors.endDate ? "border-red-500" : ""
                    }`}
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                  {errors.endDate && (
                    <div className="text-red-700">{errors.endDate}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button type="submit" className="px-6 py-2 border rounded">
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Application;
