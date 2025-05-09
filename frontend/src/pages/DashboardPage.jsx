import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiUser, FiGrid, FiBarChart2, FiEye, FiSettings, FiInfo, FiZap, FiActivity, FiBox, FiCode } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:8000'; // Define for this component, ideally centralize

function DashboardPage() {
    const { currentUser, loading } = useAuth();
    const [statsLoading, setStatsLoading] = useState(true);
    const [uiMode, setUiMode] = useState('mainDashboard'); // 'mainDashboard' or 'analyzeRepoView'
    // const [repoUrl, setRepoUrl] = useState(''); // No longer needed as we scan all repos
    const [repositories, setRepositories] = useState([]);
    const [isFetchingRepos, setIsFetchingRepos] = useState(false);
    const [fetchReposError, setFetchReposError] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('dashboardThemeMode'); // Separate theme for dashboard
        if (savedMode !== null) return JSON.parse(savedMode);
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('dashboardThemeMode', JSON.stringify(darkMode));
        // Clean up function to remove class when component unmounts or darkmode changes
        // This is important if HomePage and DashboardPage can have different themes active
        // and to ensure the global class reflects the current page's theme.
        return () => {
            // Potentially remove the class if this page was the last one to set it.
            // This logic might need refinement based on overall app structure if multiple
            // theme-controlling pages are open or frequently switched.
        };
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(prevMode => !prevMode);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatsLoading(false);
        }, 1500); // Simulate loading for 1.5 seconds
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className={`min-h-screen flex flex-col justify-center items-center p-4 transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-800'}`}>
                <div className="animate-pulse flex flex-col items-center">
                    <FiGrid size={64} className={`mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <p className="text-2xl font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    const StatCard = ({ icon, label, value, subValue, colorClass, isLoading }) => {
        if (isLoading) {
            return (
                <div className={`p-5 rounded-xl shadow-lg ${darkMode ? 'bg-slate-800/70' : 'bg-white/70'} backdrop-blur-sm animate-pulse`}>
                    <div className={`h-8 w-8 mb-3 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
                    <div className={`h-7 w-1/2 mb-2 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
                    <div className={`h-4 w-3/4 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
                    {subValue && <div className={`h-3 w-1/2 mt-2 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>}
                </div>
            );
        }
        return (
            <div className={`p-5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-slate-800/70' : 'bg-white/70'} backdrop-blur-sm`}>
                <div className={`text-3xl mb-3 ${colorClass}`}>{icon}</div>
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{value}</div>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
                {subValue && <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{subValue}</p>}
            </div>
        );
    };

    const ActionButton = ({ icon, title, description, action, available = true }) => (
        <button 
            onClick={action} 
            disabled={!available}
            className={`w-full p-6 rounded-lg shadow-lg text-left transition-all duration-300 hover:shadow-xl 
                        ${darkMode ? 'bg-slate-700/80 hover:bg-slate-600/80' : 'bg-white/80 hover:bg-slate-50/80'}
                        ${!available ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className={`text-3xl mb-3 ${darkMode ? (available ? 'text-purple-400' : 'text-slate-500') : (available ? 'text-purple-600' : 'text-slate-400')}`}>{icon}</div>
            <h3 className={`text-xl font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
            <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                {description} {!available && <span className="text-xs opacity-70">(Coming Soon)</span>}
            </p>
        </button>
    );

    const API_BASE_URL = 'http://localhost:8000'; // Define for this component, ideally centralize

    const handleAnalyzeRepo = async () => {
        if (currentUser && currentUser.username) {
            console.log(`GitHub account connected for user: ${currentUser.username}. Fetching repositories...`);
            setIsFetchingRepos(true);
            setFetchReposError(null);
            setRepositories([]); // Clear previous results
            try {
                // Replace with your actual API endpoint for fetching user repositories
                const response = await axios.get(`${API_BASE_URL}/api/github/user/repos`, { withCredentials: true });
                setRepositories(response.data.repositories || []); // Assuming backend returns { repositories: [...] }
                console.log('Repositories fetched:', response.data);
            } catch (error) {
                console.error("Failed to fetch repositories:", error.response?.data?.detail || error.message);
                setFetchReposError(error.response?.data?.detail || error.message || 'Failed to fetch repositories. Please try again.');
            }
            setIsFetchingRepos(false);
        } else {
            console.log('GitHub account not connected or username not available. Prompting user to connect.');
            alert('Please connect your GitHub account first. (This alert is a placeholder for a better UI prompt)');
        }
    };

    return (
        <div className={`flex flex-col min-h-screen antialiased transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-slate-200' : 'bg-gray-100 text-slate-700'}`}>
            <Header darkMode={darkMode} toggleTheme={toggleTheme} />
            
            <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
                {uiMode === 'mainDashboard' && (
                    <>
                        {/* Welcome Header */}
                        <section className={`mb-10 p-6 sm:p-8 rounded-xl shadow-xl 
                                           ${darkMode ? 'bg-gradient-to-r from-slate-800 to-slate-700/90 text-white' : 'bg-gradient-to-r from-white to-gray-50/90 text-slate-800'}
                                           backdrop-blur-md`}>
                            <div className="flex items-center space-x-4">
                                {currentUser.avatar_url ? 
                                    <img src={currentUser.avatar_url} alt={currentUser.username} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-purple-500 shadow-md" /> :
                                    <FiUser size={60} className={`p-3 rounded-full ${darkMode ? 'bg-slate-700 text-purple-400' : 'bg-slate-200 text-purple-600'}`} />
                                }
                                <div>
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                                        Welcome back, <span className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{currentUser.username || 'Developer'}</span>!
                                    </h1>
                                    <p className={`text-sm sm:text-base mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Here's your SkillSnap dashboard.</p>
                                </div>
                            </div>
                        </section>

                        {/* Quick Stats (Placeholder) */}
                        <section className="mb-10">
                            <h2 className={`text-xl sm:text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Overview</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                <StatCard icon={<FiBox />} label="Projects Synced" value="0" colorClass={darkMode ? 'text-sky-400' : 'text-sky-600'} isLoading={statsLoading} />
                                <StatCard icon={<FiCode />} label="Repositories Analyzed" value="0" colorClass={darkMode ? 'text-green-400' : 'text-green-600'} isLoading={statsLoading} />
                                <StatCard icon={<FiActivity />} label="Skills Identified" value="0" colorClass={darkMode ? 'text-yellow-400' : 'text-yellow-600'} isLoading={statsLoading} />
                                <StatCard icon={<FiZap />} label="Portfolio Views" value="0" subValue="Last 30 days" colorClass={darkMode ? 'text-red-400' : 'text-red-600'} isLoading={statsLoading} />
                            </div>
                        </section>

                        {/* Action Center */}
                        <section>
                            <h2 className={`text-xl sm:text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>What would you like to do?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                <ActionButton 
                                    icon={<FiBarChart2 />} 
                                    title="Analyze Repositories"
                                    description="Connect GitHub to analyze your project contributions and extract skills."
                                    action={() => setUiMode('analyzeRepoView')}
                                    available={true} 
                                />
                                <ActionButton 
                                    icon={<FiEye />} 
                                    title="Manage & View Portfolio"
                                    description="Customize and view your generated developer portfolio."
                                    action={() => alert('Portfolio viewing feature coming soon!')}
                                    available={false} // Set to true when feature is ready
                                />
                                <ActionButton 
                                    icon={<FiSettings />} 
                                    title="Account Settings"
                                    description="Manage your SkillSnap account preferences and integrations."
                                    action={() => alert('Account settings feature coming soon!')}
                                    available={false} // Set to true when feature is ready
                                />
                            </div>
                        </section>

                        {/* Info/Tip Section (Example) */}
                        <section className={`mt-12 p-4 sm:p-6 rounded-lg ${darkMode ? 'bg-slate-800/70' : 'bg-blue-50/70'} border ${darkMode ? 'border-slate-700' : 'border-blue-200'}`}>
                            <div className="flex items-start">
                                <FiInfo className={`mr-3 mt-1 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
                                <div>
                                    <h3 className={`text-md font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Pro Tip:</h3>
                                    <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        Keep your GitHub profile and project READMEs up-to-date for the best SkillSnap analysis and portfolio generation.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {uiMode === 'analyzeRepoView' && (
                    <section className={`mt-10 p-6 sm:p-8 rounded-xl shadow-xl ${darkMode ? 'bg-slate-800/70' : 'bg-slate-100/70'} backdrop-blur-md`}>
                        <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Analyze GitHub Repository</h2>
                        <p className={`mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Here you will be able to connect to your GitHub account, select repositories,
                            and initiate an analysis to extract skills and project details.
                        </p>
                        <div className={`p-6 rounded-lg mb-8 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-200/50'} border ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                        <div className={`p-6 rounded-lg mb-8 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-200/50'} border ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                            {currentUser && currentUser.username ? (
                                <div className="space-y-6">
                                    <p className={`text-center ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        Your GitHub account (<span className="font-semibold">{currentUser.username}</span>) is connected. Analyze all your repositories to extract skills and generate insights.
                                    </p>
                                    <button
                                        onClick={handleAnalyzeRepo} 
                                        className={`w-full px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-colors duration-300 
                                                    ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                    >
                                        Analyze My GitHub Repositories
                                    </button>
                                    {/* Display area for fetching status, errors, or repository list */}
                                    <div className={`mt-6 p-4 rounded-md min-h-[100px] ${darkMode ? 'bg-slate-600/50' : 'bg-slate-100/50'}`}>
                                        {isFetchingRepos && (
                                            <p className={`text-center ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}>Fetching repositories... <span className="animate-pulse">â °</span></p>
                                        )}
                                        {!isFetchingRepos && fetchReposError && (
                                            <p className={`text-center text-red-500 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Error: {fetchReposError}</p>
                                        )}
                                        {!isFetchingRepos && !fetchReposError && repositories.length > 0 && (
                                            <div>
                                                <h4 className={`text-lg font-semibold mb-2 text-center ${darkMode? 'text-white' : 'text-slate-700'}`}>Found {repositories.length} repositories:</h4>
                                                <ul className="list-disc list-inside max-h-60 overflow-y-auto px-4">
                                                    {repositories.map(repo => (
                                                        <li key={repo.id || repo.name} className={`py-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{repo.name}</li>
                                                    ))}
                                                </ul>
                                                <p className={`text-xs text-center mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Further analysis of these repositories is the next step.</p>
                                            </div>
                                        )}
                                        {!isFetchingRepos && !fetchReposError && repositories.length === 0 && (
                                            <p className={`text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                Click "Analyze My GitHub Repositories" to fetch and list your projects.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className={`mb-4 text-lg ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Please connect your GitHub account to enable repository analysis.
                                    </p>
                                    <button
                                        onClick={login} // Use the login function from AuthContext
                                        className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-colors duration-300 
                                                    ${darkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                                    >
                                        Connect GitHub Account
                                    </button>
                                    <p className={`mt-3 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        (This will take you to settings - functionality coming soon)
                                    </p>
                                </div>
                            )}
                        </div>
                        </div>
                        <button
                            onClick={() => setUiMode('mainDashboard')}
                            className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-colors duration-300 w-full sm:w-auto
                                        ${darkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                        >
                            Back to Dashboard
                        </button>
                    </section>
                )}

            </main>

            <Footer darkMode={darkMode} />
        </div>
    );
}

export default DashboardPage;
