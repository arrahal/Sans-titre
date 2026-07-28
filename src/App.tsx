import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { GlobalSearchModal } from './components/GlobalSearchModal';

import { DashboardView } from './views/DashboardView';
import { TeachersView } from './views/TeachersView';
import { SchoolsView } from './views/SchoolsView';
import { GroupsView } from './views/GroupsView';
import { ScheduleView } from './views/ScheduleView';
import { VisitsView } from './views/VisitsView';
import { AbsencesView } from './views/AbsencesView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

import { ActiveTab, SupervisorProfile, School, Teacher, Group, Visit, Absence, ScheduleEvent } from './types';
import { apiService } from './services/api';

export const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
  const [supervisorInfo, setSupervisorInfo] = useState<SupervisorProfile | null>(null);

  // App Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('Novembre 2025');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Data State
  const [schools, setSchools] = useState<School[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check initial Auth & load data
  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        const authData = await apiService.checkAuth();
        setIsFirstLaunch(authData.isFirstLaunch);
        setIsAuthenticated(authData.isAuthenticated);
        if (authData.supervisor) {
          setSupervisorInfo(authData.supervisor);
        }

        if (authData.isAuthenticated) {
          await loadAllData();
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  // Dark Mode class toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loadAllData = async () => {
    try {
      const [sData, tData, gData, vData, aData, evData, statsData] = await Promise.all([
        apiService.getSchools(),
        apiService.getTeachers(),
        apiService.getGroups(),
        apiService.getVisits(),
        apiService.getAbsences(),
        apiService.getScheduleEvents(),
        apiService.getStats()
      ]);

      setSchools(sData);
      setTeachers(tData);
      setGroups(gData);
      setVisits(vData);
      setAbsences(aData);
      setScheduleEvents(evData);
      setStats(statsData);
    } catch (err) {
      console.error("Data load error:", err);
    }
  };

  // Auth Handlers
  const handleRegister = async (data: { name: string; project: string; province: string; password: string }) => {
    const res = await apiService.register(data);
    setIsAuthenticated(true);
    setSupervisorInfo(res.supervisor);
    await loadAllData();
  };

  const handleLogin = async (password: string) => {
    const res = await apiService.login(password);
    setIsAuthenticated(true);
    setSupervisorInfo(res.supervisor);
    await loadAllData();
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  // CRUD Handler Hooks for Teachers
  const handleCreateTeacher = async (teacher: Partial<Teacher>) => {
    await apiService.createTeacher(teacher);
    await loadAllData();
  };

  const handleUpdateTeacher = async (id: string, teacher: Partial<Teacher>) => {
    await apiService.updateTeacher(id, teacher);
    await loadAllData();
  };

  const handleDeleteTeacher = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet enseignant ?')) {
      await apiService.deleteTeacher(id);
      await loadAllData();
    }
  };

  // CRUD Handlers for Schools
  const handleCreateSchool = async (school: Partial<School>) => {
    await apiService.createSchool(school);
    await loadAllData();
  };

  const handleUpdateSchool = async (id: string, school: Partial<School>) => {
    await apiService.updateSchool(id, school);
    await loadAllData();
  };

  const handleDeleteSchool = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette école ?')) {
      await apiService.deleteSchool(id);
      await loadAllData();
    }
  };

  // CRUD Handlers for Groups
  const handleCreateGroup = async (group: Partial<Group>) => {
    await apiService.createGroup(group);
    await loadAllData();
  };

  const handleUpdateGroup = async (id: string, group: Partial<Group>) => {
    await apiService.updateGroup(id, group);
    await loadAllData();
  };

  const handleDeleteGroup = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce groupe ?')) {
      await apiService.deleteGroup(id);
      await loadAllData();
    }
  };

  // CRUD Handlers for Schedule Events
  const handleCreateEvent = async (event: Partial<ScheduleEvent>) => {
    await apiService.createScheduleEvent(event);
    await loadAllData();
  };

  const handleDeleteEvent = async (id: string) => {
    await apiService.deleteScheduleEvent(id);
    await loadAllData();
  };

  // CRUD Handlers for Visits
  const handleCreateVisit = async (visit: Partial<Visit>) => {
    await apiService.createVisit(visit);
    await loadAllData();
  };

  const handleDeleteVisit = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce compte-rendu de visite ?')) {
      await apiService.deleteVisit(id);
      await loadAllData();
    }
  };

  // CRUD Handlers for Absences
  const handleCreateAbsence = async (absence: Partial<Absence>) => {
    await apiService.createAbsence(absence);
    await loadAllData();
  };

  const handleDeleteAbsence = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette déclaration d\'absence ?')) {
      await apiService.deleteAbsence(id);
      await loadAllData();
    }
  };

  // Profile Update
  const handleUpdateProfile = async (name: string, project: string, province: string) => {
    if (supervisorInfo) {
      const updated = { ...supervisorInfo, name, project, province };
      setSupervisorInfo(updated);
      localStorage.setItem('ZAKOURA_SUPERVISOR', JSON.stringify(updated));
    }
  };

  const handleChangePassword = async (oldPass: string, newPass: string) => {
    // Save new password in localStorage / mock backend
    localStorage.setItem('ZAKOURA_AUTH_PASS', newPass);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-400">Chargement de la plateforme Zakoura...</p>
      </div>
    );
  }

  // If not authenticated, render login/register screen
  if (!isAuthenticated) {
    return (
      <AuthScreen
        isFirstLaunch={isFirstLaunch}
        onRegister={handleRegister}
        onLogin={handleLogin}
        supervisorInfo={supervisorInfo || undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased">
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          supervisorInfo={supervisorInfo}
        />

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header
            supervisorName={supervisorInfo?.name || 'Karim EL AMRANI'}
            supervisorProvince={supervisorInfo?.province || 'Province d\'Al Haouz'}
            supervisor={supervisorInfo || undefined}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onLogout={handleLogout}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenSettings={() => setActiveTab('settings')}
          />

          {/* Body Views */}
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'teachers' && (
              <TeachersView
                teachers={teachers}
                schools={schools}
                onCreateTeacher={handleCreateTeacher}
                onUpdateTeacher={handleUpdateTeacher}
                onDeleteTeacher={handleDeleteTeacher}
              />
            )}

            {activeTab === 'schools' && (
              <SchoolsView
                schools={schools}
                onCreateSchool={handleCreateSchool}
                onUpdateSchool={handleUpdateSchool}
                onDeleteSchool={handleDeleteSchool}
              />
            )}

            {activeTab === 'groups' && (
              <GroupsView
                groups={groups}
                schools={schools}
                teachers={teachers}
                onCreateGroup={handleCreateGroup}
                onUpdateGroup={handleUpdateGroup}
                onDeleteGroup={handleDeleteGroup}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleView
                scheduleEvents={scheduleEvents}
                schools={schools}
                teachers={teachers}
                groups={groups}
                onCreateEvent={handleCreateEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}

            {activeTab === 'visits' && (
              <VisitsView
                visits={visits}
                teachers={teachers}
                schools={schools}
                groups={groups}
                onCreateVisit={handleCreateVisit}
                onDeleteVisit={handleDeleteVisit}
              />
            )}

            {activeTab === 'absences' && (
              <AbsencesView
                absences={absences}
                teachers={teachers}
                schools={schools}
                onCreateAbsence={handleCreateAbsence}
                onDeleteAbsence={handleDeleteAbsence}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                supervisorInfo={supervisorInfo || {
                  id: 'sup-1',
                  name: 'Karim EL AMRANI',
                  project: 'Programme Éducation Préscolaire',
                  province: 'Province d\'Al Haouz'
                }}
                stats={stats}
                schools={schools}
                teachers={teachers}
                visits={visits}
                absences={absences}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                supervisorInfo={supervisorInfo || {
                  id: 'sup-1',
                  name: 'Karim EL AMRANI',
                  project: 'Programme Éducation Préscolaire',
                  province: 'Province d\'Al Haouz'
                }}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                onUpdateProfile={handleUpdateProfile}
                onChangePassword={handleChangePassword}
              />
            )}
          </main>

          {/* Status Bar Footer matching Geometric Balance */}
          <footer className="h-10 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Système Connecté</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span>Base de données: Synchronisée</span>
            </div>
            <div>Propulsé par Zakoura Tech | v2.5.0</div>
          </footer>
        </div>
      </div>

      {/* Global Search Modal */}
      {isSearchOpen && (
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          teachers={teachers}
          schools={schools}
          groups={groups}
          visits={visits}
          onSelectResult={(tab) => {
            setActiveTab(tab);
            setIsSearchOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default App;
