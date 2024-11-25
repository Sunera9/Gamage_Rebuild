import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SalarySlip = () => {
  const { userId, month, year } = useParams();  // Correctly fetching params from URL
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:8070/api";

  useEffect(() => {
    const fetchSalaryDetails = async () => {
      try {
        // Replace salaryComponentId with actual parameters (userId, month, year)
        const response = await axios.get(`${API_BASE_URL}/slip`, {
          params: { userId, month, year },
        });
        setSalaryDetails(response.data.salary);
        console.log('User ID:', userId);
        console.log('Month:', month);
        console.log('Year:', year);
        console.log('Salary Details:', response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch salary details");
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryDetails();
  }, [userId, month, year]);

  



  const handlePrint = () => {
    window.print(); // You can customize the print styles here
  };

  if (loading) return <p>Loading salary details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Salary Slip</h1>
          <p className="text-gray-600">{`Month: ${month}, Year: ${year}`}</p>
        </header>

        {salaryDetails ? (
          <div>
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-gray-700">Employee Name: {salaryDetails.userName}</p>
                <p className="text-gray-700">Designation: {salaryDetails.designation}</p>
              </div>
              <div>
                <p className="text-gray-700">Basic Salary: {salaryDetails.basic}</p>
                <p className="text-gray-700">Net Salary: {salaryDetails.netSalary}</p>
              </div>
            </div>

            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Earnings</th>
                  <th className="border p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {salaryDetails.earnings && salaryDetails.earnings.map((earning, index) => (
                  <tr key={index}>
                    <td className="border p-2">{earning.name}</td>
                    <td className="border p-2">{earning.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-4"
            >
              Print Salary Slip
            </button>
          </div>
        ) : (
          <p>No salary details found.</p>
        )}
      </div>
    </div>
  );
};

export default SalarySlip;
