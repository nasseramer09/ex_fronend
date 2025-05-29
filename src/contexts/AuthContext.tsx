import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '../services/api';

type AuthContextType = {
    isLoggedIn: boolean;
    userRole: string | null;
    userId: number | null;
    login: (token: string, role: string, id: number) => void;
    logout: () => void;
    loadingAuth: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const storedToken = localStorage.getItem('access_token');

            if (!storedToken) {
                setIsLoggedIn(false);
                setUserRole(null);
                setUserId(null);
                setLoadingAuth(false);
                return;
            }

            try {
                const data = await apiRequest<{isLoggedIn:boolean; user_role:string; user_id:number}>('/api/users/check_auth_status', 'GET');
                
                if (data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUserRole(data.user_role);
                    setUserId(data.user_id);
                } else {
                    localStorage.removeItem('access_token');
                    setIsLoggedIn(false);
                    setUserRole(null);
                    setUserId(null);
                }
            } catch (error) {
                console.error("Fel vid verifiering av JWT:", error);
                localStorage.removeItem('access_token');
                setIsLoggedIn(false);
                setUserRole(null);
                setUserId(null);
            } finally {
                setLoadingAuth(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (token: string, role: string, id: number) => {
        localStorage.setItem('access_token', token); 
        setIsLoggedIn(true);
        setUserRole(role);
        setUserId(id);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
        setUserRole(null);
        setUserId(null);
    };
    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, userId, login, logout, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth måste användas inom en AuthProvider');
    }
    return context;
};