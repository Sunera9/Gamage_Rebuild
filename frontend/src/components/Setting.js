import React, { useState } from "react";
import axios from "axios";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    healthInsurance: "",
    professionalTax: "",
    standardAllowance: "",
    medicalAllowance: "",
    dearnessAllowance: "",
    conveyanceAllowance: "",
    epfEmployee: "",
    epfEmployer: "",
    etfEmployer: "",
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
    setError(""); // Clear error on input
  };

  // Validate form inputs
  const validateForm = () => {
    for (const key in settings) {
      if (settings[key] === "") {
        return `${key
          .replace(/([A-Z])/g, " $1")
          .charAt(0)
          .toUpperCase()}${key.slice(1)} is required.`;
      }
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      // Replace with your backend API URL
      const response = await axios.post("http://localhost:5000/api/settings", settings);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Settings</h2>
      {error && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            color: "red",
            backgroundColor: "#ffd2d2",
            border: "1px solid red",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {Object.keys(settings).map((key) => (
          <div key={key} style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
              {key.replace(/([A-Z])/g, " $1").charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="text"
              name={key}
              value={settings[key]}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
            />
          </div>
        ))}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save and Update
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
