// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {
  return isAdmin ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
