import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../section/Header";

const Layout_1 = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Stays on Top */}
      <Header />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar - Fixed Width on Large Screens, Hidden on Small Screens */}
        <Sidebar className="w-64 hidden md:block" />

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:ml-64">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout_1;
