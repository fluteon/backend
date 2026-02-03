import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminPannel from "../Admin/AdminPannel";
import AdminLogin from "../Admin/Auth/AdminLogin";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const jwt = sessionStorage.getItem('jwt');
  return jwt ? children : <Navigate to="/admin/login" replace />;
};

const Routers = () => {
  return (
    <div>
        <div>
        </div>
       <div className="">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminPannel />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>
       </div>
    </div>
  );
};

export default Routers;

