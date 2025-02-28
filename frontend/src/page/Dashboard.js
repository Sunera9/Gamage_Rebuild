import React from "react";
import DashboardCard from "../section/DashboardCard";

const Dashboard = () => {
  return (
    <div className="flex-1 p-6 space-y-6 mt-16"> {/* Adjusted margin for Header */}
      
      {/* Main Cards Section */}
      <DashboardCard />

      {/* Charts & Calendar Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      </div>
    </div>
  );
};

export default Dashboard;