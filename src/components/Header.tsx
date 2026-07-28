import React, { useState } from 'react';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Calendar,
  Menu,
  User,
  LogOut,
  ChevronDown,
  CheckCheck
} from 'lucide-react';
import { SupervisorProfile, NotificationItem } from '../types';

interface HeaderProps {
  supervisorName?: string;
  supervisorProvince?: string;
  supervisor?: SupervisorProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  setDarkMode?: (val: boolean) => void;
  onOpenSearch: () => void;
  onLogout: () => void;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  onUpdateMonth?: (month: string) => void;
  onOpenSidebar?: () => void;
  notifications?: NotificationItem[];
  onMarkNotificationsRead?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  supervisorName = 'Karim EL AMRANI',
  supervisorProvince = 'Al Haouz',
  supervisor,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onLogout,
  selectedMonth = 'Octobre 2025',
  onMonthChange,
  onUpdateMonth,
  onOpenSidebar,
  notifications = [],
  onMarkNotificationsRead,
  onOpenSettings
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleMonthSelect = (val: string) => {
    if (onMonthChange) onMonthChange(val);
    if (onUpdateMonth) onUpdateMonth(val);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 transition-colors z-20">
      {/* Left: Mobile Menu + Search + Project Metadata */}
      <div className="flex items-center gap-4 sm:gap-8">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search Pill */}
        <div className="relative hidden sm:block cursor-pointer" onClick={onOpenSearch}>
          <input
            type="text"
            readOnly
            placeholder="Recherche globale..."
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-xs w-48 lg:w-64 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 cursor-pointer"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        </div>

        {/* Strategic Metadata tags */}
        <div className="hidden md:flex gap-6 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex flex-col">
            <span className="uppercase font-bold text-[9px] text-slate-400 tracking-tighter">Projet</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">Éducation Préscolaire Rurale</span>
          </div>
          <div className="flex flex-col">
            <span className="uppercase font-bold text-[9px] text-slate-400 tracking-tighter">Province</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">{supervisor?.province || supervisorProvince}</span>
          </div>
        </div>
      </div>

      {/* Right: Date/Month selector, Theme Toggle, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Month Selector Badge */}
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border border-slate-200/50 dark:border-slate-700/50">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthSelect(e.target.value)}
            className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="Novembre 2025" className="bg-white dark:bg-slate-900">Nov 2025</option>
            <option value="Octobre 2025" className="bg-white dark:bg-slate-900">Oct 2025</option>
            <option value="Septembre 2025" className="bg-white dark:bg-slate-900">Sept 2025</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 p-3 space-y-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications ({unreadCount})</span>
                {unreadCount > 0 && onMarkNotificationsRead && (
                  <button
                    onClick={onMarkNotificationsRead}
                    className="text-[11px] text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3 h-3" /> Tout lire
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Aucune notification récenet.</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-xs transition-colors ${
                        n.read
                          ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                          : 'bg-blue-50/70 dark:bg-blue-950/40 text-slate-800 dark:text-slate-200 font-medium'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.date}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center border border-slate-600">
              {(supervisor?.name || supervisorName).charAt(0)}
            </div>
            <span className="hidden sm:inline text-xs font-medium text-slate-800 dark:text-slate-200">
              {supervisor?.name || supervisorName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 py-1 text-xs text-slate-700 dark:text-slate-300">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">{supervisor?.name || supervisorName}</p>
                <p className="text-[10px] text-slate-500 truncate">Superviseur Pédagogique</p>
              </div>
              {onOpenSettings && (
                <button
                  onClick={() => { setShowUserMenu(false); onOpenSettings(); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" /> Paramètres
                </button>
              )}
              <button
                onClick={() => { setShowUserMenu(false); onLogout(); }}
                className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

