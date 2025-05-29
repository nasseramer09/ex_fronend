import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

type PrivateRouteProps = {
    allowedRoles?: string[];};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const { isLoggedIn, userRole, loadingAuth } = useAuth();
    
    if (loadingAuth) {
        return <div>Laddar autentisering...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;