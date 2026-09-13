import React from 'react';
import { Menu, Bell, Sparkles, Command, User as UserIcon } from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

export const TopNav = () => {
  const { toggleMobileOpen, isCollapsed } = useSidebar();
  const { user } = useAuth();

  const firstName = user?.name ? user.name.trim().split(' ')[0] : 'Guest';

  return (
    <header
      className={`sticky top-0 z-30 h-16 glass-nav px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
        isCollapsed ? 'md:ml-[80px]' : 'md:ml-[280px]'
      }`}
    >
      {/* Left Section: Mobile Menu & Welcome Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileOpen}
          className="md:hidden flex items-center justify-center p-2 rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1A2235]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-semibold text-[#F9FAFB] flex items-center gap-2">
            Welcome back, {firstName} <span className="text-base">👋</span>
          </h2>
          <p className="text-xs text-[#9CA3AF] hidden sm:block">
            Your ATS optimization score improved by <span className="text-[#22C55E] font-medium">+14%</span> this week
          </p>
        </div>
      </div>

      {/* Right Section: Search, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden sm:block w-64 lg:w-80">
          <Input
            isSearch
            placeholder="Search resumes, jobs, metrics..."
            className="py-1.5 text-xs bg-[#111827]/80"
            rightIcon={
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#9CA3AF] bg-[#1A2235] border border-[#1F2937] rounded">
                <Command className="w-3 h-3" /> K
              </kbd>
            }
          />
        </div>

        {/* AI Quick Status Badge */}
        <Badge variant="secondary" className="hidden lg:inline-flex py-1 px-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>Gemini 3.6 Active</span>
        </Badge>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1A2235] transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4F8CFF] ring-2 ring-[#0B1020]" />
        </button>

        {/* Avatar / Profile quick trigger */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1F2937]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4F8CFF] to-[#7C3AED] flex items-center justify-center font-semibold text-xs text-white border border-[#4F8CFF]/50 ring-2 ring-[#4F8CFF]/10 cursor-pointer shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
        </div>
      </div>
    </header>

  );
};

export default TopNav;
