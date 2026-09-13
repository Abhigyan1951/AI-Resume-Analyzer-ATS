import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Sparkles, Command, User as UserIcon, Sun, Moon, Monitor } from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

export const TopNav = () => {
  const { toggleMobileOpen, isCollapsed } = useSidebar();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef(null);

  const firstName = user?.name ? user.name.trim().split(' ')[0] : 'Guest';

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          aria-label="Toggle mobile menu"
          className="md:hidden flex items-center justify-center p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            Welcome back, {firstName} <span className="text-base">👋</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)] hidden sm:block">
            Your ATS optimization score improved by <span className="text-[#16A34A] font-medium">+14%</span> this week
          </p>
        </div>
      </div>

      {/* Right Section: Search, Theme Toggle, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden sm:block w-64 lg:w-80">
          <Input
            isSearch
            placeholder="Search resumes, jobs, metrics..."
            className="py-1.5 text-xs bg-[var(--surface-main)]"
            rightIcon={
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded">
                <Command className="w-3 h-3" /> K
              </kbd>
            }
          />
        </div>

        {/* AI Quick Status Badge */}
        <Badge variant="secondary" className="hidden lg:inline-flex py-1 px-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Gemini 3.6 Active</span>
        </Badge>

        {/* Theme Switcher Menu */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setShowThemeMenu((prev) => !prev)}
            aria-label="Select color theme"
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-[#38BDF8]" />
            ) : theme === 'light' ? (
              <Sun className="w-5 h-5 text-[#F59E0B]" />
            ) : (
              <Monitor className="w-5 h-5 text-[#2563EB]" />
            )}
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-36 py-1 bg-[var(--surface-main)] border border-[var(--border-subtle)] rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => {
                  setTheme('light');
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                  theme === 'light'
                    ? 'text-[#2563EB] bg-[#2563EB]/10 font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
                }`}
              >
                <Sun className="w-4 h-4 text-[#F59E0B]" />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  setTheme('dark');
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-[#2563EB] bg-[#2563EB]/10 font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
                }`}
              >
                <Moon className="w-4 h-4 text-[#38BDF8]" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => {
                  setTheme('system');
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                  theme === 'system'
                    ? 'text-[#2563EB] bg-[#2563EB]/10 font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
                }`}
              >
                <Monitor className="w-4 h-4 text-[#2563EB]" />
                <span>System</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-[var(--bg-app)]" />
        </button>

        {/* Avatar / Profile quick trigger */}
        <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-subtle)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#0EA5E9] flex items-center justify-center font-semibold text-xs text-white border border-[#2563EB]/50 ring-2 ring-[#2563EB]/10 cursor-pointer shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
