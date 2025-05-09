import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AuthSuccessPage from './pages/AuthSuccessPage';
import { AuthProvider, useAuth } from './AuthContext';
import './index.css'; 

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-xl">Authenticating...</p>
      </div>
    ); 
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const NotFoundPage = () => (
  <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <a href="/" style={{ textDecoration: 'underline', color: 'blue' }}>Go to Homepage</a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
          <Route 
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
