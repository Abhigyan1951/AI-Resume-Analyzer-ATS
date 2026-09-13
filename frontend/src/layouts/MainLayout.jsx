import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import { useSidebar } from '../hooks/useSidebar';

export const MainLayout = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F9FAFB] flex flex-col font-sans">
      <Sidebar />
      <TopNav />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 p-4 sm:p-6 md:p-8 ${
          isCollapsed ? 'md:ml-[80px]' : 'md:ml-[280px]'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
