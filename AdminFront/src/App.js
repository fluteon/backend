import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import AdminPannel from "./Admin/AdminPannel";
import AdminLogin from "./Admin/Auth/AdminLogin";
import { getUser } from "./Redux/Auth/Action";
import { auth } from "./firebase";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const jwt = sessionStorage.getItem('jwt');
  return jwt ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const jwt = sessionStorage.getItem('jwt');
      
      if (jwt) {
        try {
          // Validate JWT by fetching user profile
          await dispatch(getUser(jwt));
          console.log('✅ Session restored successfully');
        } catch (error) {
          console.error('❌ Invalid session, clearing token');
          sessionStorage.removeItem('jwt');
          window.location.href = '/login';
        }
      }
      
      setIsValidating(false);
    };

    validateSession();

    // Cleanup function to clear auth on window close/unload
    const handleBeforeUnload = () => {
      console.log('🧹 Cleaning up auth data on window close');
      sessionStorage.clear();
      localStorage.clear();
      // Sign out from Firebase
      auth.signOut().catch(err => console.error('Firebase signout error:', err));
    };

    // Add event listener for cleanup
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);

  // Show loading while validating session
  if (isValidating) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p>Validating session...</p>
        </div>
      </div>
    );
  }

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
