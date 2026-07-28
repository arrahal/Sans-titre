import React from 'react';
import {
  LayoutDashboard,
  Users,
  School as SchoolIcon,
  Layers,
  CalendarDays,
  UserX,
  ClipboardCheck,
  FileSpreadsheet,
  Settings,
  X
} from 'lucide-react';
import { ActiveTab, SupervisorProfile } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
  supervisorInfo?: SupervisorProfile | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  collapsed = false,
  supervisorInfo
}) => {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'teachers' as ActiveTab, label: 'Enseignants', icon: Users },
    { id: 'schools' as ActiveTab, label: 'Écoles', icon: SchoolIcon },
    { id: 'groups' as ActiveTab, label: 'Groupes', icon: Layers },
    { id: 'schedule' as ActiveTab, label: 'Emploi du temps', icon: CalendarDays },
    { id: 'visits' as ActiveTab, label: 'Visites', icon: ClipboardCheck },
    { id: 'absences' as ActiveTab, label: 'Absences', icon: UserX },
    { id: 'reports' as ActiveTab, label: 'Rapports', icon: FileSpreadsheet },
    { id: 'settings' as ActiveTab, label: 'Paramètres', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      )}

      <aside
        className={`bg-slate-900 text-white flex flex-col shrink-0 z-50 transition-all duration-300 ${
          // Mobile responsive drawer handling
          isOpen ? 'translate-x-0 fixed inset-y-0 left-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } lg:relative lg:flex ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-md shadow-emerald-500/20 shrink-0">
              Z
            </div>
            {!collapsed && (
              <div className="leading-tight overflow-hidden">
                <h1 className="text-sm font-bold uppercase tracking-wider text-white">Zakoura</h1>
                <p className="text-[10px] text-slate-400">Portail Superviseur</p>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          {setIsOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setIsOpen) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'opacity-70'}`} />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer User Card */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center font-bold text-xs text-white shrink-0">
                {supervisorInfo?.name ? supervisorInfo.name.charAt(0) : 'A'}
              </div>
              <div className="overflow-hidden leading-tight">
                <p className="text-xs font-medium truncate text-white">
                  {supervisorInfo?.name || 'M. Karim EL AMRANI'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">Superviseur Pédagogique</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

