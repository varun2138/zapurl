import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const AppLayout = () => {
  return (
    <div className="">
      <main className="min-h-screen container ">
        <Header />
        <Outlet />
      </main>
      <div data-theme="sunset" className="p-8 text-center   ">
        Footer
      </div>
    </div>
  );
};

export default AppLayout;
