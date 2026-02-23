import { createContext, useState, useEffect } from "react";
import { setToken, getToken, removeToken } from "../utils/tokenHandler";
import { useNavigate } from "react-router-dom";
import { login as loginApi, getMe } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from token on refresh
    useEffect(() => {
        const loadUser = async () => {
            const token = getToken();

            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Session expired or invalid token");
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            const data = await loginApi(credentials);
            setToken(data.token);
            setUser(data.user);

            // Redirect based on role
            if (data.user.role === "student") {
                navigate("/student/dashboard");
            } else if (data.user.role === "faculty") {
                navigate("/faculty/dashboard");
            } else if (data.user.role === "admin") {
                navigate("/admin/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw error; // Re-throw to handle in UI
        }
    };

    // Logout function
    const logout = () => {
        removeToken();
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
