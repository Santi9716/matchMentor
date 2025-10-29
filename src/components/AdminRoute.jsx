import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('authToken');
const isAdmin = () => {
  try {
    return (localStorage.getItem('role') || '').toLowerCase() === 'admin';
  } catch (e) {
    return false;
  }
};

export default function AdminRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/login" replace />;
  return children;
}
