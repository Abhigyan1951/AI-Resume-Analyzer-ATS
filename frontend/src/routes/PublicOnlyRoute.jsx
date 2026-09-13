import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Zap } from 'lucide-react';

export const PublicOnlyRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center gap-4 text-[#F9FAFB]">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#7C3AED] flex items-center justify-center animate-pulse shadow-lg shadow-[#4F8CFF]/20">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
        <p className="text-sm font-medium text-[#9CA3AF]">Loading session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
