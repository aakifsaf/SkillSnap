import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FiCheckCircle, FiLoader, FiGithub } from 'react-icons/fi';

function AuthSuccessPage() {
    const navigate = useNavigate();
    const { loading: authLoading } = useAuth(); // Renamed to avoid conflict with local loading
    const [localLoading, setLocalLoading] = useState(true); // For the page's own loading feel
    // Attempt to get initial dark mode preference, default to true (dark)
    const [darkMode] = useState(() => {
        try {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        } catch (e) {
            return true; // Default to dark if window.matchMedia is not available (e.g. SSR)
        }
    });

    useEffect(() => {
        const pageLoadTimer = setTimeout(() => {
            setLocalLoading(false);
        }, 750);
        return () => clearTimeout(pageLoadTimer);
    }, []);

    useEffect(() => {
        if (!localLoading) {
            console.log("AuthSuccessPage: Auth context loading state:", authLoading);
            // We wait for authLoading to be false from AuthContext before redirecting to dashboard
            // This ensures currentUser is likely set.
            if (!authLoading) { 
                const redirectTimer = setTimeout(() => {
                    console.log("AuthSuccessPage: Navigating to dashboard after successful auth.");
                    navigate('/dashboard'); 
                }, 1500); // Keep a small delay for user to see the message
                return () => clearTimeout(redirectTimer);
            }
        }
    }, [localLoading, authLoading, navigate]);

    if (authLoading || localLoading) {
      return (
        <div className={`min-h-screen flex flex-col justify-center items-center p-6 transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-800'}`}>
            <div className="text-center">
                <FiLoader className={`animate-spin text-6xl mb-6 mx-auto ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h1 className={`text-3xl font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Almost there...</h1>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Finalizing your secure connection.</p>
            </div>
        </div>
      );
    }

    return (
        <div className={`min-h-screen flex flex-col justify-center items-center p-6 transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-800'}`}>
            <div className={`text-center p-8 sm:p-12 md:p-16 rounded-xl shadow-2xl max-w-lg w-full ${darkMode ? 'bg-slate-800/70 backdrop-blur-md' : 'bg-white/70 backdrop-blur-md'}`}>
                <FiCheckCircle className={`text-7xl mb-6 mx-auto ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400' : 'text-slate-800'}`}>
                    Authentication Successful!
                </h1>
                <p className={`text-xl mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Welcome to SkillSnap!
                </p>
                <p className={`text-md mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    You are now securely logged in. Redirecting you to your dashboard momentarily...
                </p>
                <div className="mt-8">
                    <div className={`w-24 h-2 border-2 border-dashed rounded-full animate-spin-slow mx-auto ${darkMode ? 'border-purple-400' : 'border-purple-500'}`}></div>
                </div>
                 <FiGithub className={`mx-auto text-4xl mt-10 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>
        </div>
    );
}

export default AuthSuccessPage;
