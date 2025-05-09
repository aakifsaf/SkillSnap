import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Your FastAPI backend URL

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to get cookies (needed for username, though token is HttpOnly)
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // The /auth/me endpoint relies on the HttpOnly cookie for authentication
                const response = await axios.get(`${API_BASE_URL}/auth/me`, { withCredentials: true });
                setCurrentUser(response.data);
            } catch (error) {
                console.warn("Not logged in or error fetching user:", error.response?.data?.detail || error.message);
                setCurrentUser(null);
            }
            setLoading(false);
        };

        fetchUser();
        
        // Also check for the username cookie as a secondary signal / for immediate UI update
        // This is less secure than the /auth/me check but can improve UX
        const usernameFromCookie = getCookie("github_username");
        if (usernameFromCookie && !currentUser) {
            // If /auth/me hasn't populated yet, but cookie exists, set a temporary user object
            // The /auth/me call will eventually confirm/override this.
            // setCurrentUser({ username: usernameFromCookie }); // Potentially re-enable if desired
        }

    }, []);

    const login = () => {
        // Redirect to backend GitHub login URL
        window.location.href = `${API_BASE_URL}/auth/github/login`;
    };

    const logout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
            setCurrentUser(null);
            // Cookies should be cleared by the backend. 
            // Forcing a reload to ensure frontend state is clean and cookies are re-evaluated by browser.
            window.location.href = "/"; 
        } catch (error) {
            console.error("Logout failed:", error);
            // Still attempt to clear user and redirect
            setCurrentUser(null);
            window.location.href = "/";
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
