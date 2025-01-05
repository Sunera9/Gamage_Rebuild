import React from "react";
import Sidebar from "../components/Sidebar"; // Ensure the correct import path
import Header from "../section/Header";
import BarChart from "../section/BarChart";
import ActivityFeed from "../section/ActivityFeed";
import Meetings from "../section/Meetings";
import DashboardCard from "../section/DashboardCard";

const Dashboard = () => {
  return (
    <div>
      <div className="flex-1 p-6 space-y-6">
        <Header />
        
       <DashboardCard />

        
        {/* Statistics Section */}
        <div className="bg-white rounded-lg p-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <BarChart />
          </div>
        </div>
        
        {/* Other Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left side: Activity Feed */}
      <div className="flex items-center justify-end">
        <ActivityFeed />
      </div>

      {/* Right side: Meetings */}
      <div className="flex items-center">
        <Meetings />
      </div>
    </div>
      </div>
    </div>
  );
};

export default Dashboard;
