import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";  // Import the plugin
import Header from "../section/Header";

const Salary = () => {
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [sheetMonth, setSheetMonth] = useState("");
  const [sheetYear, setSheetYear] = useState("");
  const [salarySheet, setSalarySheet] = useState([]);
  const [sheetError, setSheetError] = useState("");
  const [loadingSheet, setLoadingSheet] = useState(false);

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use environment variable for the base URL

const handleSearch = async () => {
  try {
    setSearchError("");
    setLoadingSearch(true);
    const response = await axios.get(`${API_BASE_URL}/salary/search`, {
      params: { month: searchMonth, year: searchYear, userQuery },
    });
    setSearchResults(response.data.salaryRecords);
  } catch (err) {
    setSearchError(
      err.response?.data?.message || "Failed to fetch salary records"
    );
  } finally {
    setLoadingSearch(false);
  }
};

const handleGenerateSheet = async () => {
  try {
    setSheetError("");
    setLoadingSheet(true);
    if (!sheetMonth || !sheetYear || sheetMonth < 1 || sheetMonth > 12) {
      setSheetError("Please provide a valid month (1-12) and year.");
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/salary/sheet`, {
      params: { month: sheetMonth, year: sheetYear },
    });
    setSalarySheet(response.data.salarySheet);
  } catch (err) {
    setSheetError(
      err.response?.data?.message || "Failed to generate salary sheet"
    );
  } finally {
    setLoadingSheet(false);
  }
};


  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.autoTable({
      head: [['#', 'User Name', 'Job Title', 'Basic','Allowances','Deductions', 'Net Salary']],
      body: salarySheet.map((record, index) => [
        index + 1,
        record.userName,
        record.jobTitle,
        record.basicSalary,
        record.totalAllowances,
        record.totalDeductions,
        record.netSalary
      ]),
    });

    doc.save('salary-sheet.pdf');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
          <header className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
          </header>

          {/* Search Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Salary Records</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Month (1-12)"
                value={searchMonth}
                onChange={(e) => setSearchMonth(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Year"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="User ID or Name"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              {loadingSearch ? "Searching..." : "Search"}
            </button>
            {searchError && <p className="text-red-500 mt-4">{searchError}</p>}
            {searchResults.length > 0 && (
              <table className="w-full border mt-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">#</th>
                    <th className="border p-2">User Name</th>
                    <th className="border p-2">Designation</th>
                    <th className="border p-2">Basic</th>
                    <th className="border p-2">Net Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((record, index) => (
                    <tr key={index}>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{record.userName}</td>
                      <td className="border p-2">{record.designation}</td>
                      <td className="border p-2">{record.basic}</td>
                      <td className="border p-2">{record.netSalary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Salary Sheet Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Generate Salary Sheet</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Month (1-12)"
                value={sheetMonth}
                onChange={(e) => setSheetMonth(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Year"
                value={sheetYear}
                onChange={(e) => setSheetYear(e.target.value)}
                className="border rounded p-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleGenerateSheet}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              {loadingSheet ? "Generating..." : "Generate"}
            </button>
            {sheetError && <p className="text-red-500 mt-4">{sheetError}</p>}
            {salarySheet.length > 0 && (
              <>
                <table className="w-full border mt-4">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">#</th>
                      <th className="border p-2">User Name</th>
                      <th className="border p-2">Job Title</th>
                      <th className="border p-2">Basic</th>
                      <th className="border p-2">Allowances</th>
                      <th className="border p-2">Deductions</th>
                      <th className="border p-2">Net Salary</th>

                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salarySheet.map((record, index) => (
                      <tr key={index}>
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{record.userName}</td>
                        <td className="border p-2">{record.jobTitle}</td>
                        <td className="border p-2">{record.basicSalary}</td>
                        <td className="border p-2">{record.totalAllowances}</td>
                        <td className="border p-2">{record.totalDeductions}</td>
                        <td className="border p-2">{record.netSalary}</td>
                        <td className="border p-2">
                          <Link
                            to={`/salary/slip/${record.salaryComponentId}`}
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                          >
                            View Slip
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={handleDownloadPDF}
                  className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Download Salary Sheet
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Salary;
