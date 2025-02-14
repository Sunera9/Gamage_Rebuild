import React, { useState } from "react";
import axios from "axios";
import Header from "../section/Header";
import { useEffect } from "react";
import Swal from "sweetalert2"; 

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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/setting`
        );


        if (response.data.settings) {
          // Convert response into a key-value object
          const mappedSettings = response.data.settings.reduce((acc, item) => {
            switch (item.name) {
              case "Health Insurance Deduction":
                acc.healthInsurance = item.value;
                break;
              case "Professional Tax":
                acc.professionalTax = item.value;
                break;
              case "Standard Allowance":
                acc.standardAllowance = item.value;
                break;
              case "Medical Allowance":
                acc.medicalAllowance = item.value;
                break;
              case "Dearness Allowance":
                acc.dearnessAllowance = item.value;
                break;
              case "Conveyance Allowance":
                acc.conveyanceAllowance = item.value;
                break;
              case "EPF Employee":
                acc.epfEmployee = item.value;
                break;
              case "EPF Employer":
                acc.epfEmployer = item.value;
                break;
              case "ETF Employer":
                acc.etfEmployer = item.value;
                break;
              default:
                break;
            }
            return acc;
          }, {});

          setSettings(mappedSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/setting/update-by-name`,
      {
        healthInsurance: settings.healthInsurance,
        professionalTax: settings.professionalTax,
        standardAllowance: settings.standardAllowance,
        medicalAllowance: settings.medicalAllowance,
        dearnessAllowance: settings.dearnessAllowance,
        conveyanceAllowance: settings.conveyanceAllowance,
        epfEmployee: settings.epfEmployee,
        epfEmployer: settings.epfEmployer,
        etfEmployer: settings.etfEmployer,
      }
    );

    Swal.fire("Success", "Settings updated successfully!", "success");
  } catch (error) {
    console.error(
      "Error updating settings:",
      error.response?.data || error.message
    );
    Swal.fire("Error", "Failed to update settings!", "error");
  }
  };  
  
  return (
    <>
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "30px" }}>
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
          {Object.keys(settings).map((key) => {
            // Determine if the field should have Rs. or %
            const isPercentageField = [
              "epfEmployee",
              "epfEmployer",
              "etfEmployer",
            ].includes(key);
            const unit = isPercentageField ? "%" : "Rs.";

            return (
              <div key={key} style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .charAt(0)
                    .toUpperCase() + key.slice(1)}{" "}
                  ({unit})
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
                  placeholder={`Enter ${key
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()}`}
                />
              </div>
            );
          })}
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
    </>
  );
};

export default SettingsPage;
