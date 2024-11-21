import React, {  useState } from "react";
import Header from '../section/Header'


const Dashboard = () => {
  const [applicationDetails, setApplicationDetails] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
  });
  
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10">
        <Header/>
        {/* Application Details Section */}
      <div className="w-full max-w-6xl bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Application Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Applications</h3>
            <p className="text-2xl font-bold">{applicationDetails.totalApplications}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Pending Applications</h3>
            <p className="text-2xl font-bold">{applicationDetails.pendingApplications}</p>
          </div>
          <div className="bg-green-100 text-green-800 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Approved Applications</h3>
            <p className="text-2xl font-bold">{applicationDetails.approvedApplications}</p>
          </div>
        </div>
      </div>

        
    </div>
  )
}

export default Dashboard
