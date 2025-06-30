import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
// import Navigation from './customer/Components/Navbar/Navigation';
// import CustomerRoutes from './Routers/CustomerRoutes';
// import AdminRoutes from './Routers/AdminRoutes';
// import NotFound from './Pages/Notfound';
import AdminPannel from './Admin/AdminPannel';
// import api from '../src/config/api';
// import { useEffect, useState } from 'react';
// npm// import ContactSidebar from './Pages/ContactSidebar';

// import Routers from './Routers/Routers';



function App() {
  const isAdmin=true;
  return (
    <>
    
      {/* <ScrollToTop /> */}
      {/* <ContactSidebar /> */}
      <Routes>
        {/* <Route path="/*" element={<CustomerRoutes />} /> */}
        <Route path="/admin/*" element={<AdminPannel />} />
        
      </Routes>
    </>
  );
}

export default App;
