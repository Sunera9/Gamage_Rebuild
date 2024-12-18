import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../section/Header";


const Layout_1 = () => {
  return (
    <div className="">
      <div className="flex ">
        <Header/>
        <Sidebar/>
        <div className="flex-grow justify-center items-center mt-10">
          <Outlet />

        </div>
      </div>
    </div>
  );
};

export default Layout_1;
