import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Alert,
  CircularProgress 
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { login } from '../../Redux/Auth/Action';
import { useNavigate } from 'react-router-dom';

const ALLOWED_EMAIL = 'fluteoncompany@gmail.com';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Check if email matches allowed admin email
      if (user.email !== ALLOWED_EMAIL) {
        setError(`Access Denied: Only ${ALLOWED_EMAIL} is allowed to access Admin Panel`);
        await auth.signOut(); // Sign out unauthorized user
        setLoading(false);
        return;
      }

      // ✅ Email is authorized - proceed with backend login
      const userData = {
        email: user.email,
        password: user.uid, // Using Firebase UID as password identifier
        firstName: user.displayName?.split(' ')[0] || 'Admin',
        lastName: user.displayName?.split(' ')[1] || '',
        googleAuth: true
      };

      // Call backend to create/login admin user
      console.log('🔐 Calling backend login with:', userData);
      await dispatch(login(userData));
      
      // Check if JWT was stored
      const jwt = sessionStorage.getItem('jwt');
      console.log('✅ JWT stored:', jwt ? 'Yes' : 'No');
      
      if (!jwt) {
        throw new Error('Login failed - no JWT received from backend');
      }
      
      // Navigate to admin dashboard (root path after login)
      navigate('/');
      
    } catch (error) {
      console.error('❌ Google Sign-In Error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        code: error.code
      });
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Sign-in failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              gutterBottom
              sx={{ color: '#667eea' }}
            >
              Admin Panel
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
            >
              Sign in with authorized Google account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: '#4285f4',
              '&:hover': {
                backgroundColor: '#357ae8',
              }
            }}
          >
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Only <strong>{ALLOWED_EMAIL}</strong> is authorized
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminLogin;
