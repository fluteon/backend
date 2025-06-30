import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPannel from "../Admin/AdminPannel";
const Routers = () => {
  return (
    <div>
        <div>
        </div>
       <div className="">
        <Routes>
        <Route path="/admin" element={<AdminPannel/>}></Route>
      </Routes>
       </div>
    </div>
  );
};

export default Routers;
