import React, {  useState } from "react";
import Header from '../section/Header'
import DashboardCard from "../section/DashboardCard";
import Sidebar from "../components/Sidebar";


const Dashboard = () => {
  
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10">
        <Header/>
        <DashboardCard/>
        <Sidebar/>
      </div>
  )
}

export default Dashboard
