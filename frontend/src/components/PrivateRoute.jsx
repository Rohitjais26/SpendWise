// frontend-vite/src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { user } = useSelector((state) => state.auth);

    // If user exists, render the child route (Outlet), otherwise redirect to /login
    return user ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;