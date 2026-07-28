import {
  SupervisorProfile,
  Teacher,
  School,
  Group,
  ScheduleEvent,
  Visit,
  Absence,
  ActivityLog,
  NotificationItem
} from '../types';
import {
  initialSupervisor,
  initialSchools,
  initialTeachers,
  initialGroups,
  initialVisits,
  initialAbsences,
  initialScheduleEvents,
  initialActivityLogs,
  initialNotifications
} from '../data/mockZakouraData';

const TOKEN_KEY = 'zakoura_jwt_token';
const OFFLINE_DB_KEY = 'zakoura_offline_store';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper to load/save offline state
function loadOfflineStore() {
  try {
    const raw = localStorage.getItem(OFFLINE_DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read offline store', e);
  }
  return {
    supervisor: initialSupervisor,
    isRegistered: true,
    schools: initialSchools,
    teachers: initialTeachers,
    groups: initialGroups,
    visits: initialVisits,
    absences: initialAbsences,
    scheduleEvents: initialScheduleEvents,
    activityLogs: initialActivityLogs,
    notifications: initialNotifications
  };
}

function saveOfflineStore(data: any) {
  try {
    localStorage.setItem(OFFLINE_DB_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save offline store', e);
  }
}

export const api = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  // Auth Status & Space Creation
  async checkAuthStatus() {
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API offline, using local store');
    }
    const store = loadOfflineStore();
    return {
      isRegistered: store.isRegistered,
      supervisor: store.supervisor
    };
  },

  async registerSpace(payload: any) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la création de l\'espace');
      if (data.token) this.setToken(data.token);
      return data;
    } catch (err: any) {
      // Fallback offline space creation
      const store = loadOfflineStore();
      store.supervisor = {
        ...store.supervisor,
        name: payload.name,
        project: payload.project,
        province: payload.province,
        createdAt: new Date().toISOString()
      };
      store.isRegistered = true;
      saveOfflineStore(store);
      const mockToken = 'mock-jwt-token-' + Date.now();
      this.setToken(mockToken);
      return { supervisor: store.supervisor, token: mockToken };
    }
  },

  async login(password: string) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec de connexion');
      if (data.token) this.setToken(data.token);
      return data;
    } catch (err: any) {
      const store = loadOfflineStore();
      const mockToken = 'mock-jwt-token-' + Date.now();
      this.setToken(mockToken);
      return { supervisor: store.supervisor, token: mockToken };
    }
  },

  async updateProfile(payload: Partial<SupervisorProfile> & { newPassword?: string }) {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend update failed, updating offline store');
    }
    const store = loadOfflineStore();
    store.supervisor = { ...store.supervisor, ...payload };
    saveOfflineStore(store);
    return { supervisor: store.supervisor };
  },

  // Dashboard Stats
  async getDashboardStats() {
    try {
      const res = await fetch('/api/dashboard/stats', { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Dashboard fetch offline fallback');
    }
    const store = loadOfflineStore();
    const totalTeachers = store.teachers.length;
    const totalSchools = store.schools.length;
    const totalGroups = store.groups.length;

    let totalStudents = 0;
    let totalBoys = 0;
    let totalGirls = 0;
    store.schools.forEach((s: School) => {
      totalStudents += s.studentCount;
      totalBoys += s.boys;
      totalGirls += s.girls;
    });

    const totalVisits = store.visits.length;
    let totalAbsences = 0;
    store.absences.forEach((a: Absence) => { totalAbsences += a.absenceCount; });

    return {
      totalTeachers,
      totalSchools,
      totalGroups,
      totalStudents,
      totalBoys,
      totalGirls,
      totalVisits,
      totalAbsences,
      visitRealizationRate: 88,
      monthlyEvolution: [
        { month: 'Mai', visites: 8, absences: 2, eleves: 210 },
        { month: 'Juin', visites: 10, absences: 1, eleves: 220 },
        { month: 'Septembre', visites: 12, absences: 4, eleves: 235 },
        { month: 'Octobre', visites: totalVisits, absences: totalAbsences, eleves: totalStudents }
      ],
      genderDistribution: [
        { name: 'Garçons', value: totalBoys, color: '#2563eb' },
        { name: 'Filles', value: totalGirls, color: '#ec4899' }
      ],
      absencesByMonth: [
        { month: 'Mai', count: 2 },
        { month: 'Juin', count: 1 },
        { month: 'Septembre', count: 4 },
        { month: 'Octobre', count: totalAbsences }
      ],
      visitsPerTeacher: store.teachers.map((t: Teacher) => ({
        name: t.name.split(' ')[0],
        visites: t.visitCount,
        progression: t.progressionLevel
      })),
      groupsPerSchool: store.schools.map((s: School) => ({
        name: s.name.replace('École Préscolaire Zakoura - ', ''),
        groupes: s.groupCount,
        eleves: s.studentCount
      }))
    };
  },

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    try {
      const res = await fetch('/api/teachers', { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return loadOfflineStore().teachers;
  },

  async createTeacher(teacher: Partial<Teacher>): Promise<Teacher> {
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(teacher)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const store = loadOfflineStore();
    const newT: Teacher = {
      id: 'tch-' + Date.now(),
      name: teacher.name || 'Nouvel Enseignant',
      phone: teacher.phone || '+212 6 00 00 00 00',
      email: teacher.email || 'test@zakoura.ma',
      schoolId: teacher.schoolId || 'sch-1',
      schoolName: teacher.schoolName || 'École Zakoura',
      commune: teacher.commune || 'Asni',
      groupCount: 1,
      groupNames: ['Groupe A'],
      studentCount: 20,
      boys: 10,
      girls: 10,
      assignmentDate: new Date().toISOString().split('T')[0],
      status: teacher.status || 'actif',
      visitCount: 0,
      absenceCount: 0,
      progressionLevel: 75
    };
    store.teachers.push(newT);
    saveOfflineStore(store);
    return newT;
  },

  async updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher> {
    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const store = loadOfflineStore();
    const idx = store.teachers.findIndex((t: Teacher) => t.id === id);
    if (idx !== -1) {
      store.teachers[idx] = { ...store.teachers[idx], ...data };
      saveOfflineStore(store);
      return store.teachers[idx];
    }
    throw new Error('Teacher not found');
  },

  async deleteTeacher(id: string): Promise<void> {
    try {
      await fetch(`/api/teachers/${id}`, { method: 'DELETE', headers: getAuthHeader() });
    } catch (e) {}
    const store = loadOfflineStore();
    store.teachers = store.teachers.filter((t: Teacher) => t.id !== id);
    saveOfflineStore(store);
  },

  // Schools
  async getSchools(): Promise<School[]> {
    try {
      const res = await fetch('/api/schools', { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return loadOfflineStore().schools;
  },

  async createSchool(school: Partial<School>): Promise<School> {
    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(school)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const store = loadOfflineStore();
    const newS: School = {
      id: 'sch-' + Date.now(),
      name: school.name || 'Nouvelle École',
      commune: school.commune || 'Commune',
      douar: school.douar || 'Douar',
      directionProvinciale: school.directionProvinciale || 'DP Al Haouz',
      phone: school.phone || '+212 5 24 00 00 00',
      groupCount: school.groupCount || 1,
      teacherCount: school.teacherCount || 1,
      studentCount: (school.boys || 15) + (school.girls || 15),
      boys: school.boys || 15,
      girls: school.girls || 15
    };
    store.schools.push(newS);
    saveOfflineStore(store);
    return newS;
  },

  async updateSchool(id: string, data: Partial<School>): Promise<School> {
    try {
      const res = await fetch(`/api/schools/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const store = loadOfflineStore();
    const idx = store.schools.findIndex((s: School) => s.id === id);
    if (idx !== -1) {
      store.schools[idx] = { ...store.schools[idx], ...data };
      saveOfflineStore(store);
      return store.schools[idx];
    }
    throw new Error('School not found');
  },

  async deleteSchool(id: string): Promise<void> {
    try {
      await fetch(`/api/schools/${id}`, { method: 'DELETE', headers: getAuthHeader() });
    } catch (e) {}
    const store = loadOfflineStore();
    store.schools = store.schools.filter((s: School) => s.id !== id);
    saveOfflineStore(store);
  },

  // Groups
  async getGroups(): Promise<Group[]> {
    try {
      const res = await fetch('/api/groups', { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return loadOfflineStore().groups;
  },

  async createGroup(group: Partial<Group>): Promise<Group> {
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(group)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const store = loadOfflineStore();
    const newG: Group = {
      id: 'grp-' + Date.now(),
      name: group.name || 'Groupe Nouveau',
      level: group.level || 'GS',
      teacherId: group.teacherId || 'tch-1',
      teacherName: group.teacherName || 'Enseignant',
      schoolId: group.schoolId || 'sch-1',
      schoolName: group.schoolName || 'École Zakoura',
      studentCount: (group.boys || 10) + (group.girls || 10),
      boys: group.boys || 10,
      girls: group.girls || 10,
      schedule: group.schedule || '08:30 - 11:30',
      room: group.room || 'Salle 1'
    };
    store.groups.push(newG);
    saveOfflineStore(store);
    return newG;
  },

  async updateGroup(id: string, data: Partial<Group>): Promise<Group> {
    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const store = loadOfflineStore();
    const idx = store.groups.findIndex((g: Group) => g.id === id);
    if (idx !== -1) {
      store.groups[idx] = { ...store.groups[idx], ...data };
      saveOfflineStore(store);
      return store.groups[idx];
    }
    throw new Error('Group not found');
  },

  async deleteGroup(id: string): Promise<void> {
    try {
      await fetch(`/api/groups/${id}`, { method: 'DELETE', headers: getAuthHeader() });
    } catch (e) {}
    const store = loadOfflineStore();
    store.groups = store.groups.filter((g: Group) => g.id !== id);
    saveOfflineStore(store);
  },

  // Schedule
  async getSchedule(): Promise<ScheduleEvent[]> {
    try {
      const res = await fetch('/api/schedule', { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return loadOfflineStore().scheduleEvents;
  },

  async createScheduleEvent(event: Partial<ScheduleEvent>): Promise<ScheduleEvent> {
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(event)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const store = loadOfflineStore();
    const newEv: ScheduleEvent = {
      id: 'ev-' + Date.now(),
      title: event.title || 'Visite',
      day: event.day || 'Lundi',
      timeSlot: event.timeSlot || '08:30 - 11:30',
      schoolId: event.schoolId || 'sch-1',
      schoolName: event.schoolName || 'École Zakoura',
      teacherId: event.teacherId || 'tch-1',
      teacherName: event.teacherName || 'Enseignant',
      groupId: event.groupId || 'grp-1',
      groupName: event.groupName || 'Groupe',
      room: event.room || 'Salle 1',
      type: event.type || 'visite_pedagogique',
      color: event.color || '#0284c7'
    };
    store.scheduleEvents.push(newEv);
    saveOfflineStore(store);
    return newEv;
  },

  async deleteScheduleEvent(id: string): Promise<void> {
    try {
      await fetch(`/api/schedule/${id}`, { method: 'DELETE', headers: getAuthHeader() });
    } catch (e) {}
    const store = loadOfflineStore();
    store.scheduleEvents = store.scheduleEvents.filter((ev: ScheduleEvent) => ev.id !== id);
    saveOfflineStore(store);
  },

  // Visits
  async getVisits(): Promise<Visit[]> {
    try {
      const res = await fetch('/api/visits', { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return loadOfflineStore().visits;
  },

  async createVisit(visit: Partial<Visit>): Promise<Visit> {
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(visit)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const store = loadOfflineStore();
    const newV: Visit = {
      id: 'vst-' + Date.now(),
      date: visit.date || new Date().toISOString().split('T')[0],
      teacherId: visit.teacherId || 'tch-1',
      teacherName: visit.teacherName || 'Enseignant',
      schoolId: visit.schoolId || 'sch-1',
      schoolName: visit.schoolName || 'École Zakoura',
      groupId: visit.groupId || 'grp-1',
      groupName: visit.groupName || 'Groupe',
      startTime: visit.startTime || '09:00',
      endTime: visit.endTime || '11:00',
      durationMinutes: visit.durationMinutes || 120,
      objective: visit.objective || 'Visite pédagogique',
      observations: visit.observations || 'Bien déroulé',
      strengths: visit.strengths || ['Participation active'],
      improvementPoints: visit.improvementPoints || ['Gestion du temps'],
      recommendedActions: visit.recommendedActions || ['Appliquer les fiches Zakoura'],
      signatureDataUrl: visit.signatureDataUrl,
      status: visit.status || 'réalisée',
      createdDate: new Date().toISOString()
    };
    store.visits.unshift(newV);
    saveOfflineStore(store);
    return newV;
  },

  async deleteVisit(id: string): Promise<void> {
    try {
      await fetch(`/api/visits/${id}`, { method: 'DELETE', headers: getAuthHeader() });
    } catch (e) {}
    const store = loadOfflineStore();
    store.visits = store.visits.filter((v: Visit) => v.id !== id);
    saveOfflineStore(store);
  },

  // Absences
  async getAbsences(): Promise<Absence[]> {
    try {
      const res = await fetch('/api/absences', { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return loadOfflineStore().absences;
  },

  async createAbsence(abs: Partial<Absence>): Promise<Absence> {
    try {
      const res = await fetch('/api/absences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(abs)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const store = loadOfflineStore();
    const newAbs: Absence = {
      id: 'abs-' + Date.now(),
      schoolId: abs.schoolId || 'sch-1',
      schoolName: abs.schoolName || 'École Zakoura',
      teacherId: abs.teacherId || 'tch-1',
      teacherName: abs.teacherName || 'Enseignant',
      groupId: abs.groupId || 'grp-1',
      groupName: abs.groupName || 'Groupe A',
      month: abs.month || 'Octobre 2025',
      absenceCount: abs.absenceCount || 1,
      reason: abs.reason || 'Maladie',
      observations: abs.observations || 'Absence consignée',
      dateLogged: new Date().toISOString().split('T')[0]
    };
    store.absences.unshift(newAbs);
    saveOfflineStore(store);
    return newAbs;
  },

  async deleteAbsence(id: string): Promise<void> {
    try {
      await fetch(`/api/absences/${id}`, { method: 'DELETE', headers: getAuthHeader() });
    } catch (e) {}
    const store = loadOfflineStore();
    store.absences = store.absences.filter((a: Absence) => a.id !== id);
    saveOfflineStore(store);
  },

  // Logs & Notifications
  async getLogs(): Promise<ActivityLog[]> {
    try {
      const res = await fetch('/api/logs', { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return loadOfflineStore().activityLogs;
  },

  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch('/api/notifications', { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return loadOfflineStore().notifications;
  },

  async markNotificationsRead(): Promise<void> {
    try {
      await fetch('/api/notifications/mark-read', { method: 'POST', headers: getAuthHeader() });
    } catch (e) {}
    const store = loadOfflineStore();
    store.notifications.forEach((n: NotificationItem) => n.read = true);
    saveOfflineStore(store);
  },

  async resetSeed(): Promise<void> {
    try {
      await fetch('/api/system/reset-seed', { method: 'POST', headers: getAuthHeader() });
    } catch (e) {}
    localStorage.removeItem(OFFLINE_DB_KEY);
  },

  async checkAuth() {
    const res = await this.checkAuthStatus();
    const token = this.getToken();
    return {
      isFirstLaunch: !res.isRegistered,
      isAuthenticated: Boolean(token || res.isRegistered),
      supervisor: res.supervisor
    };
  },

  async register(data: any) {
    return this.registerSpace(data);
  },

  logout() {
    this.clearToken();
  },

  async getScheduleEvents(): Promise<ScheduleEvent[]> {
    return this.getSchedule();
  },

  async getStats() {
    try {
      const res = await fetch('/api/stats', { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Offline computed stats fallback
    const store = loadOfflineStore();
    const teachers: Teacher[] = store.teachers || [];
    const schools: School[] = store.schools || [];
    const groups: Group[] = store.groups || [];
    const visits: Visit[] = store.visits || [];
    const absences: Absence[] = store.absences || [];

    let totalStudents = 0;
    let totalBoys = 0;
    let totalGirls = 0;
    schools.forEach(s => {
      totalStudents += s.studentCount || 0;
      totalBoys += s.boys || 0;
      totalGirls += s.girls || 0;
    });

    const totalAbsences = absences.reduce((sum, a) => sum + (a.dayCount || 0), 0);

    return {
      totalTeachers: teachers.length,
      totalSchools: schools.length,
      totalGroups: groups.length,
      totalStudents,
      totalBoys,
      totalGirls,
      totalVisits: visits.length,
      totalAbsences,
      visitRealizationRate: 92,
      monthlyEvolution: [
        { month: 'Sep', eleves: 180, visites: 12 },
        { month: 'Oct', eleves: 195, visites: 18 },
        { month: 'Nov', eleves: 210, visites: 24 }
      ],
      genderDistribution: [
        { name: 'Garçons', value: totalBoys || 105, color: '#3b82f6' },
        { name: 'Filles', value: totalGirls || 105, color: '#ec4899' }
      ],
      absencesByMonth: [
        { month: 'Sep', count: 1 },
        { month: 'Oct', count: 2 },
        { month: 'Nov', count: 1 }
      ],
      visitsPerTeacher: teachers.map(t => ({ name: t.name, visites: t.visitCount })),
      groupsPerSchool: schools.map(s => ({ name: s.name, groupes: s.groupCount, eleves: s.studentCount }))
    };
  }
};

export const apiService = api;

