import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { dataContext } from '../context/UserContext';

const ProtectedAdminRoute = ({ children }) => {
    const { admin } = useContext(dataContext);

    if (!admin || !admin.token || admin.role !== 'admin') {
        localStorage.removeItem("user"); // Clear invalid session
        return <Navigate to="/admin-secret-login" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
