import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import Logo from './Logo';
import { useAuth } from '../AuthContext';
import { FiGithub, FiLogOut, FiLogIn, FiMoon, FiSun, FiGrid } from 'react-icons/fi';

const Header = ({ darkMode, toggleTheme }) => {
  const { currentUser, login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const handleLogin = () => {
    login(); // AuthContext login
  };

  const handleLogout = () => {
    logout(); // AuthContext logout
    navigate('/'); // Redirect to homepage after logout
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <header className={`shadow-md sticky top-0 z-50 transition-colors duration-300 ${darkMode ? 'bg-slate-800/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Logo darkMode={darkMode} />
        <div className="flex items-center space-x-2 sm:space-x-3">
          {loading && !currentUser ? (
            <div className={`px-3 py-2 rounded-md text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Authenticating...</div>
          ) : currentUser ? (
            <>
              {location.pathname !== '/dashboard' && (
                <button 
                  onClick={handleDashboard}
                  title="Go to Dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${darkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-400 text-white'} shadow-sm hover:shadow-md`}
                >
                  <FiGrid />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
              )}
              <button 
                onClick={handleLogout} 
                title="Logout"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${darkMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500 hover:bg-red-400 text-white'} shadow-sm hover:shadow-md`}
              >
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <button 
              onClick={handleLogin} 
              title="Login with GitHub"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-400 text-white'} shadow-sm hover:shadow-md`}
            >
              <FiGithub /> 
              <span className="hidden sm:inline">Login with GitHub</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 ${darkMode ? 'hover:bg-slate-700 focus:ring-purple-400 text-yellow-300' : 'hover:bg-slate-200 focus:ring-purple-500 text-purple-600'}`}
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
