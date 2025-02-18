import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SalarySlip = () => {
  const { salaryComponentId } = useParams();
  const [salarySlipData, setSalarySlipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use environment variable for the base URL

 useEffect(() => {
   const fetchSalarySlip = async () => {
     try {
       setError("");
       const response = await axios.get(
         `${API_BASE_URL}/salary/slip/${salaryComponentId}`
       );
       setSalarySlipData(response.data.salarySlip);
     } catch (err) {
       setError(
         err.response?.data?.message || "Failed to fetch salary slip data"
       );
     } finally {
       setLoading(false);
     }
   };

   fetchSalarySlip();
 }, [salaryComponentId]);

 const handleDownloadPDF = async () => {
   const element = document.getElementById("salary-slip-content");
   const canvas = await html2canvas(element, { backgroundColor: "#fff" });
   const imgData = canvas.toDataURL("image/png");

   const pdf = new jsPDF("p", "mm", "a4");
   const pdfWidth = pdf.internal.pageSize.getWidth();
   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
   pdf.save("SalarySlip.pdf");
 };


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-bold">
        {error}
      </div>
    );
  }

  const {
    employee,
    period,
    attendance,
    earnings,
    totalEarnings,
    deductions,
    totalDeductions,
    netSalary,
    employerContributions,
  } = salarySlipData;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-50 flex flex-col items-center p-10 mt-10">
      <div
        id="salary-slip-content"
        className="max-w-4xl w-full bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200"
      >
        <header className="bg-blue-500 text-white py-4 text-center">
          <h1 className="text-3xl font-bold">Salary Slip</h1>
          <p className="text-lg">{employee.company}</p>
        </header>

        <div className="p-8 bg-gray-100">
          {/* Employee Details */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2">Employee Details</h2>
            <table className="table-auto w-full mt-4 border-collapse border border-gray-200 text-gray-700">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">Name</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">Designation</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.designation}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">Department</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.department}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">Bank</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.bankName} ({employee.bankAccountNumber})</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Salary Period */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2">Salary Period</h2>
            <p className="mt-4 text-gray-700">{`Month: ${period.month}, Year: ${period.year}`}</p>
          </section>

          {/* Attendance */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2">Attendance</h2>
            <table className="table-auto w-full mt-4 border-collapse border border-gray-200 text-gray-700">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">Working Days</td>
                  <td className="border border-gray-300 px-4 py-2">{attendance.workingDays}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">Attended Days</td>
                  <td className="border border-gray-300 px-4 py-2">{attendance.attendedDays}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">Leaves Taken</td>
                  <td className="border border-gray-300 px-4 py-2">{attendance.leavesTaken}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">Absent Days</td>
                  <td className="border border-gray-300 px-4 py-2">{attendance.absentDays}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Earnings and Deductions */}
          <section className="mb-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Earnings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Earnings</h3>
                <table className="table-auto w-full mt-4 border-collapse border border-gray-200 text-gray-700">
                  <tbody>
                    {earnings.map((earning, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{earning.name}</td>
                        <td className="border border-gray-300 px-4 py-2 font-bold">{earning.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="font-bold mt-4 text-green-600">Total Earnings: {totalEarnings.toLocaleString()}</p>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Deductions</h3>
                <table className="table-auto w-full mt-4 border-collapse border border-gray-200 text-gray-700">
                  <tbody>
                    {deductions.map((deduction, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{deduction.name}</td>
                        <td className="border border-gray-300 px-4 py-2 font-bold">{deduction.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="font-bold mt-4 text-red-600">Total Deductions: {totalDeductions.toLocaleString()}</p>
              </div>
            </div>
          </section>

          {/* Net Salary */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2">Net Salary</h2>
            <p className="text-2xl font-bold text-green-600 mt-4">{netSalary.toLocaleString()}</p>
          </section>

          {/* Employer Contributions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2">Employer Contributions</h2>
            <table className="table-auto w-full mt-4 border-collapse border border-gray-200 text-gray-700">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">EPF (Employer)</td>
                  <td className="border border-gray-300 px-4 py-2">{employerContributions.epfEmployer.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-bold">ETF (Employer)</td>
                  <td className="border border-gray-300 px-4 py-2">{employerContributions.etfEmployer.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>

      <footer className="mt-6">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all"
        >
          Download PDF
        </button>
      </footer>
    </div>
  );
};

export default SalarySlip;
