



import React from 'react';
import { useAuth } from '../../store/AuthContext';
import { Navigate } from 'react-router-dom';

export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user || !user.role) {
    return <div className="p-8 text-center text-slate-500">Loading your dashboard...</div>;
  }

  switch (user.role.role_name) {
    case 'Admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'Approver':
      return <Navigate to="/dashboard/approver" replace />;
    case 'Production Manager':
      return <Navigate to="/dashboard/production" replace />;
    case 'Engineer':
      return <Navigate to="/dashboard/engineer" replace />;
    default:
      return <div className="p-8 text-center text-slate-500">No dashboard configured for your role.</div>;
  }
}
