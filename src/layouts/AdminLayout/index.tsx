import React from "react";
import AdminHeader from "../AdminHeader";
import { Outlet } from "react-router-dom";

const AdminLayout:React.FC = () => {
  return (
    <>
      <AdminHeader />
      <Outlet />
    </>
  );
};

export default AdminLayout;
