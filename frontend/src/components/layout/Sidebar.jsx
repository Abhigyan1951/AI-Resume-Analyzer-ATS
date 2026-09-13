import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UploadCloud,
  FileCheck2,
  Sparkles,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
  LogOut,
  User as UserIcon,
  Compass,
  MessageSquare,
} from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils/cn';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Roadmap', path: '/roadmap', icon: Compass, badge: 'NEW' },
  { label: 'Interview Prep', path: '/interview-prep', icon: MessageSquare, badge: 'AI' },
  { label: 'Upload Resume', path: '/upload', icon: UploadCloud },
  { label: 'ATS Analysis', path: '/ats-analysis', icon: FileCheck2 },
  { label: 'AI Rewrite', path: '/ai-rewrite', icon: Sparkles },
  { label: 'History', path: '/history', icon: History },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobileSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.', 'Session Ended');
    closeMobileSidebar();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 text-[var(--text-primary)]">
      {/* Top Header & Logo */}
      <div>
        <div className="flex items-center justify-between px-2 py-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#0EA5E9] flex items-center justify-center shadow-lg shadow-[#2563EB]/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="font-bold text-lg tracking-tight text-[var(--text-primary)] flex items-center gap-1">
                  Resum<span className="text-[#2563EB]">AI</span>
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                  Enterprise ATS
                </span>
              </motion.div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            aria-label="Toggle sidebar width"
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobileSidebar}
            aria-label="Close menu"
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative',
                    isActive
                      ? 'bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30 font-semibold shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
                  )
                }
              >
                <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide rounded-md bg-[#2563EB] text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Card & Logout */}
      <div className="pt-4 border-t border-[var(--border-subtle)]">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl glass-soft hover:bg-[var(--surface-elevated)] transition-colors group">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#0EA5E9] flex items-center justify-center font-semibold text-xs text-white border border-[#2563EB]/40 shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-2 ring-[var(--bg-app)]" />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {user?.name || 'Guest'}
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30 ml-1">
                    PRO
                  </span>
                </div>
                <span className="text-xs text-[var(--text-secondary)] truncate">{user?.email || 'guest@resumai.io'}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#0EA5E9] flex items-center justify-center font-semibold text-xs text-white border border-[#2563EB]/40 shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-[var(--surface-main)] backdrop-blur-xl border-r border-[var(--border-subtle)] transition-all duration-300',
          isCollapsed ? 'w-[80px]' : 'w-[280px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="md:hidden fixed inset-0 bg-[#0A0F1C]/80 backdrop-blur-md z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-[var(--surface-main)] border-r border-[var(--border-subtle)]"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
