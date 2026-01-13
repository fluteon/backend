import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import AdminPannel from "./Admin/AdminPannel";
import AdminLogin from "./Admin/Auth/AdminLogin";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const jwt = localStorage.getItem('jwt');
  return jwt ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <AdminPannel />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
export default App;
