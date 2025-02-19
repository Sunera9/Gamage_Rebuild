import React, { useState, useEffect } from "react";
import axios from "axios";

const Recruite = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    jobPosition: "",
    department: "IT",
    startDate: "",
    endDate: "",
    role: "employee",
  });

  const [jobPositions, setJobPositions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch job positions from the database
  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/jobPosition`
        );
        setJobPositions(response.data || []);
      } catch (error) {
        console.error("Error fetching job positions:", error);
      }
    };

    fetchJobPositions();
  }, []);

  const handleEmailBlur = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/getByEmail/${formData.email}`
      );
      const user = response.data.user;
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        phone: user.phone,
      }));
      setErrors((prev) => ({ ...prev, email: "" }));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrors((prev) => ({
          ...prev,
          email: "Email not found in database",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "Error fetching user details",
        }));
      }
      setFormData((prev) => ({ ...prev, name: "", phone: "" }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      alert("Email is required.");
      return;
    }

    const requestData = {
      name: formData.name,
      phone: formData.phone,
      jobPosition: formData.jobPosition._id,
      department: formData.department,
      startDate: formData.startDate,
      endDate: formData.endDate,
      role: formData.role,
    };

    console.log("Request Data:", requestData);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/updateByEmail/${formData.email}`,
        requestData
      );

      if (response.status === 200) {
        alert("Applicant updated successfully!");

        // Clear the form after successful submission
        setFormData({
          name: "",
          phone: "",
          jobPosition: {},
          department: "",
          startDate: "",
          endDate: "",
          role: "",
          email: "",
        });
      }
    } catch (error) {
      console.error("Error updating applicant:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update the applicant. Please try again."
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md mt-14">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Recruit an Employee
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {loading && <span className="text-blue-500">Loading...</span>}
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
          />
        </div>

        {/* Job Position */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Job Position:
          </label>
          <select
            name="jobPosition"
            value={formData.jobPosition}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              Select a job position
            </option>
            {jobPositions.length > 0 ? (
              jobPositions.map((position) => (
                <option key={position._id} value={position.title}>
                  {position.title}
                </option>
              ))
            ) : (
              <option disabled>Loading job positions...</option>
            )}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Department:
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Start Date:
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            End Date:
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Role:</label>
          <input
            type="text"
            value="employee"
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Recruite
          </button>
        </div>
      </form>
    </div>
  );
};

export default Recruite;
