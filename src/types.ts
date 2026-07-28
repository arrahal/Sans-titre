export interface SupervisorProfile {
  id: string;
  name: string;
  project: string;
  province: string;
  selectedMonth: string;
  selectedYear: number;
  email?: string;
  phone?: string;
  role?: string;
  createdAt: string;
  token?: string;
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  email: string;
  schoolId: string;
  schoolName: string;
  commune: string;
  groupCount: number;
  groupNames: string[];
  studentCount: number;
  boys: number;
  girls: number;
  assignmentDate: string;
  status: 'actif' | 'inactif' | 'en_formation';
  photoUrl?: string;
  visitCount: number;
  lastVisitDate?: string;
  absenceCount: number;
  progressionLevel: number; // Percentage 0-100
}

export interface School {
  id: string;
  name: string;
  commune: string;
  douar: string;
  directionProvinciale: string;
  phone: string;
  groupCount: number;
  teacherCount: number;
  studentCount: number;
  boys: number;
  girls: number;
  latitude?: number;
  longitude?: number;
  mapEmbedUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  level: string; // e.g. 'Petite Section', 'Moyenne Section', 'Grande Section', 'CP'
  teacherId: string;
  teacherName: string;
  schoolId: string;
  schoolName: string;
  studentCount: number;
  boys: number;
  girls: number;
  schedule: string;
  room: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  timeSlot: string; // e.g. "08:30 - 11:30"
  schoolId: string;
  schoolName: string;
  teacherId: string;
  teacherName: string;
  groupId: string;
  groupName: string;
  room: string;
  type: 'cours' | 'visite_pedagogique' | 'reunion' | 'formation';
  color?: string;
}

export interface Visit {
  id: string;
  date: string;
  teacherId: string;
  teacherName: string;
  schoolId: string;
  schoolName: string;
  groupId: string;
  groupName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  objective: string;
  observations: string;
  strengths: string[];
  improvementPoints: string[];
  recommendedActions: string[];
  signatureDataUrl?: string;
  photoUrl?: string;
  attachments?: string[];
  status: 'réalisée' | 'planifiée' | 'reportée';
  createdDate: string;
}

export interface Absence {
  id: string;
  schoolId: string;
  schoolName: string;
  teacherId: string;
  teacherName: string;
  groupId?: string;
  groupName?: string;
  month?: string; // e.g. "Octobre 2025"
  absenceCount?: number;
  dayCount?: number;
  startDate?: string;
  endDate?: string;
  reason: string;
  justified?: boolean;
  documentUrl?: string;
  observations?: string;
  dateLogged?: string;
}

export interface MonthlyReport {
  id: string;
  month: string;
  year: number;
  supervisorName: string;
  project: string;
  province: string;
  totalSchools: number;
  totalTeachers: number;
  totalGroups: number;
  totalStudents: number;
  boys: number;
  girls: number;
  totalVisits: number;
  totalAbsences: number;
  visitRealizationRate: number;
  executiveSummary: string;
  strengthsSummary: string[];
  improvementSummary: string[];
  recommendations: string[];
  generatedAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  description: string;
  user: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}

export type ActiveTab =
  | 'dashboard'
  | 'teachers'
  | 'schools'
  | 'groups'
  | 'schedule'
  | 'absences'
  | 'visits'
  | 'reports'
  | 'settings';
