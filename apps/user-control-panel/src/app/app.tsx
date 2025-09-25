import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import {} from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import {
  ChakraProvider,
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
// Chakra imports

// Inner component that uses auth context
function AppContent() {
  const [ currentTheme, setCurrentTheme ] = useState(initialTheme);
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <ChakraProvider theme={currentTheme}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          Loading...
        </div>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/" 
          element={
            <Navigate 
              to={isAuthenticated ? "/admin/default" : "/auth/sign-in"} 
              replace 
            />
          } 
        />
      </Routes>
    </ChakraProvider>
  );
}

export default function Main() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
