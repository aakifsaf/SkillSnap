import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Added Link import
import { useAuth } from '../AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiGithub, FiZap, FiCpu, FiTerminal } from 'react-icons/fi';

// Main HomePage Component
function HomePage() {
    const { currentUser, login, loading } = useAuth(); // Removed logout as it's in Header
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode !== null) return JSON.parse(savedMode);
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('themeMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(prevMode => !prevMode);

    // Initial page loading state (if auth is loading and no user yet)
    if (loading && !currentUser) {
        return (
            <div className={`min-h-screen flex flex-col justify-center items-center p-4 transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-800'}`}>
                <div className="animate-pulse flex flex-col items-center">
                    <FiZap size={64} className={`mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <p className="text-2xl font-medium">Loading SkillSnap...</p>
                </div>
            </div>
        );
    }

    const FeatureCard = ({ icon, title, description }) => (
        <div className={`p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-slate-800/60 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm'}`}>
            <div className={`text-4xl mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{icon}</div>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
            <p className={`${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>
        </div>
    );

    return (
        <div className={`flex flex-col min-h-screen antialiased transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-slate-200' : 'bg-gray-50 text-slate-700'}`}>
            <Header darkMode={darkMode} toggleTheme={toggleTheme} />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className={`py-20 sm:py-28 text-center ${darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800/80' : 'bg-gradient-to-b from-gray-50 to-gray-100/80'}`}>
                    <div className="container mx-auto px-4">
                        <FiGithub className={`mx-auto text-7xl sm:text-8xl mb-6 transition-colors duration-500 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                        <h1 className={`text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 transition-colors duration-500 
                                       ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400' : 'text-slate-800'}`}>
                            SkillSnap
                        </h1>
                        <p className={`text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Transform your GitHub contributions into a stunning, professional resume & portfolio. Effortlessly.
                        </p>
                        {!currentUser && (
                            <button 
                                onClick={() => login()} // Directly call login from useAuth
                                className={`w-full sm:w-auto mx-auto flex items-center justify-center space-x-3 transition-all duration-300 font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-lg text-lg sm:text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 
                                            ${darkMode ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white focus:ring-purple-500/50' 
                                                        : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white focus:ring-purple-400/50'}`}
                            >
                                <FiGithub size={24} className="mr-2 sm:mr-3" />
                                <span>Login with GitHub & Get Started</span>
                            </button>
                        )}
                         {currentUser && (
                            <Link 
                                to="/dashboard" // Link to dashboard if logged in
                                className={`w-full sm:w-auto mx-auto flex items-center justify-center space-x-3 transition-all duration-300 font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-lg text-lg sm:text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 
                                            ${darkMode ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white focus:ring-green-500/50' 
                                                        : 'bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white focus:ring-green-400/50'}`}
                            >
                                <FiZap size={24} className="mr-2 sm:mr-3" />
                                <span>Go to Your Dashboard</span>
                            </Link>
                        )}
                    </div>
                </section>

                {/* Features Section */}
                <section className={`py-16 sm:py-24 ${darkMode ? 'bg-slate-800/80' : 'bg-gray-100/80'}`}>
                    <div className="container mx-auto px-4 text-center">
                        <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Why SkillSnap?</h2>
                        <p className={`text-lg mb-12 max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Stop manually updating your resume. Let your code speak for itself.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<FiZap />} 
                                title="Automated Portfolio"
                                description="Generates a dynamic portfolio based on your GitHub activity and project showcases."
                            />
                            <FeatureCard 
                                icon={<FiCpu />} 
                                title="AI-Powered Resume"
                                description="Crafts compelling resume points from your commit messages and project READMEs."
                            />
                            <FeatureCard 
                                icon={<FiTerminal />} 
                                title="Developer Focused"
                                description="Designed for developers, by a developer. Understands your workflow and needs."
                            />
                        </div>
                    </div>
                </section>
            </main>
            
            <Footer darkMode={darkMode} />
        </div>
    );
}

export default HomePage;
