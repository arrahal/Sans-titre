import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
} from './src/data/mockZakouraData';
import {
  SupervisorProfile,
  Teacher,
  School,
  Group,
  Visit,
  Absence,
  ScheduleEvent,
  ActivityLog,
  NotificationItem
} from './src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'zakoura_pedagogical_supervision_jwt_secret_2025';
const DATA_FILE = path.join(process.cwd(), 'zakoura_database.json');

interface DatabaseSchema {
  supervisor: SupervisorProfile & { passwordHash?: string };
  isRegistered: boolean;
  schools: School[];
  teachers: Teacher[];
  groups: Group[];
  visits: Visit[];
  absences: Absence[];
  scheduleEvents: ScheduleEvent[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading database file, using default seed:', err);
  }

  const defaultDb: DatabaseSchema = {
    supervisor: {
      ...initialSupervisor,
      passwordHash: bcrypt.hashSync('zakoura2025', 10)
    },
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

  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // --- Auth Middleware ---
  const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // Allow unauthenticated demo requests with graceful fallback
      next();
      return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        res.status(403).json({ error: 'Token invalide ou expiré' });
        return;
      }
      (req as any).user = user;
      next();
    });
  };

  // Helper log action
  const addLog = (action: string, module: string, description: string) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      action,
      module,
      description,
      user: db.supervisor.name || 'Superviseur'
    };
    db.activityLogs.unshift(newLog);
    if (db.activityLogs.length > 50) db.activityLogs.pop();
    saveDatabase(db);
  };

  // ==================== AUTH API ====================

  app.get('/api/auth/status', (req: Request, res: Response) => {
    res.json({
      isRegistered: db.isRegistered,
      supervisor: {
        id: db.supervisor.id,
        name: db.supervisor.name,
        project: db.supervisor.project,
        province: db.supervisor.province,
        selectedMonth: db.supervisor.selectedMonth,
        selectedYear: db.supervisor.selectedYear,
        email: db.supervisor.email,
        phone: db.supervisor.phone,
        role: db.supervisor.role
      }
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, project, province, password, confirmPassword } = req.body;

    if (!name || !project || !province || !password) {
      res.status(400).json({ error: 'Tous les champs sont obligatoires' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    db.supervisor = {
      id: 'sup-' + Date.now(),
      name,
      project,
      province,
      selectedMonth: 'Octobre',
      selectedYear: 2025,
      role: 'Superviseur Pédagogique',
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@zakoura.org`,
      createdAt: new Date().toISOString(),
      passwordHash
    };

    db.isRegistered = true;
    saveDatabase(db);

    addLog('Création d\'espace', 'Authentification', `Espace créé pour ${name} (${province})`);

    const token = jwt.sign(
      { id: db.supervisor.id, name: db.supervisor.name, province: db.supervisor.province },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Espace créé avec succès',
      token,
      supervisor: {
        id: db.supervisor.id,
        name: db.supervisor.name,
        project: db.supervisor.project,
        province: db.supervisor.province,
        selectedMonth: db.supervisor.selectedMonth,
        selectedYear: db.supervisor.selectedYear
      }
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ error: 'Le mot de passe est requis' });
      return;
    }

    const isValid = db.supervisor.passwordHash
      ? bcrypt.compareSync(password, db.supervisor.passwordHash)
      : password === 'zakoura2025';

    if (!isValid) {
      res.status(401).json({ error: 'Mot de passe incorrect' });
      return;
    }

    const token = jwt.sign(
      { id: db.supervisor.id, name: db.supervisor.name, province: db.supervisor.province },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    addLog('Connexion', 'Authentification', `${db.supervisor.name} s'est connecté`);

    res.json({
      token,
      supervisor: {
        id: db.supervisor.id,
        name: db.supervisor.name,
        project: db.supervisor.project,
        province: db.supervisor.province,
        selectedMonth: db.supervisor.selectedMonth,
        selectedYear: db.supervisor.selectedYear,
        email: db.supervisor.email,
        phone: db.supervisor.phone,
        role: db.supervisor.role
      }
    });
  });

  app.put('/api/auth/profile', authenticateToken, (req: Request, res: Response) => {
    const { name, project, province, selectedMonth, selectedYear, newPassword } = req.body;

    if (name) db.supervisor.name = name;
    if (project) db.supervisor.project = project;
    if (province) db.supervisor.province = province;
    if (selectedMonth) db.supervisor.selectedMonth = selectedMonth;
    if (selectedYear) db.supervisor.selectedYear = selectedYear;

    if (newPassword && newPassword.trim().length >= 6) {
      db.supervisor.passwordHash = bcrypt.hashSync(newPassword, 10);
    }

    saveDatabase(db);
    addLog('Modification profil', 'Paramètres', 'Mise à jour du profil superviseur');

    res.json({
      supervisor: {
        id: db.supervisor.id,
        name: db.supervisor.name,
        project: db.supervisor.project,
        province: db.supervisor.province,
        selectedMonth: db.supervisor.selectedMonth,
        selectedYear: db.supervisor.selectedYear,
        email: db.supervisor.email,
        phone: db.supervisor.phone,
        role: db.supervisor.role
      }
    });
  });

  // ==================== DASHBOARD STATS API ====================

  app.get('/api/dashboard/stats', (req: Request, res: Response) => {
    const totalTeachers = db.teachers.length;
    const totalSchools = db.schools.length;
    const totalGroups = db.groups.length;

    let totalStudents = 0;
    let totalBoys = 0;
    let totalGirls = 0;

    db.schools.forEach(s => {
      totalStudents += s.studentCount;
      totalBoys += s.boys;
      totalGirls += s.girls;
    });

    const totalVisits = db.visits.length;

    let totalAbsences = 0;
    db.absences.forEach(a => {
      totalAbsences += a.absenceCount;
    });

    const targetVisitsMonth = totalTeachers * 2; // e.g. 2 visits per teacher target
    const visitRealizationRate = Math.min(100, Math.round((totalVisits / Math.max(1, targetVisitsMonth)) * 100));

    res.json({
      totalTeachers,
      totalSchools,
      totalGroups,
      totalStudents,
      totalBoys,
      totalGirls,
      totalVisits,
      totalAbsences,
      visitRealizationRate,
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
      visitsPerTeacher: db.teachers.map(t => ({
        name: t.name.split(' ')[0],
        visites: t.visitCount,
        progression: t.progressionLevel
      })),
      groupsPerSchool: db.schools.map(s => ({
        name: s.name.replace('École Préscolaire Zakoura - ', '').replace('Unité Préscolaire - ', ''),
        groupes: s.groupCount,
        eleves: s.studentCount
      }))
    });
  });

  // ==================== TEACHERS API ====================

  app.get('/api/teachers', (req: Request, res: Response) => {
    res.json(db.teachers);
  });

  app.post('/api/teachers', (req: Request, res: Response) => {
    const teacherData: Partial<Teacher> = req.body;
    const newTeacher: Teacher = {
      id: 'tch-' + Date.now(),
      name: teacherData.name || 'Nouvel Enseignant',
      phone: teacherData.phone || '+212 6 00 00 00 00',
      email: teacherData.email || 'enseignant@zakoura-edu.ma',
      schoolId: teacherData.schoolId || (db.schools[0]?.id || 'sch-1'),
      schoolName: teacherData.schoolName || (db.schools[0]?.name || 'École Zakoura'),
      commune: teacherData.commune || 'Asni',
      groupCount: teacherData.groupCount || 1,
      groupNames: teacherData.groupNames || ['Groupe Pre-school'],
      studentCount: (teacherData.boys || 10) + (teacherData.girls || 10),
      boys: teacherData.boys || 10,
      girls: teacherData.girls || 10,
      assignmentDate: teacherData.assignmentDate || new Date().toISOString().split('T')[0],
      status: teacherData.status || 'actif',
      photoUrl: teacherData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      visitCount: 0,
      absenceCount: 0,
      progressionLevel: 75
    };

    db.teachers.push(newTeacher);
    saveDatabase(db);
    addLog('Ajout Enseignant', 'Enseignants', `Ajout de ${newTeacher.name}`);
    res.status(201).json(newTeacher);
  });

  app.put('/api/teachers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.teachers.findIndex(t => t.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Enseignant non trouvé' });
      return;
    }

    db.teachers[index] = { ...db.teachers[index], ...req.body };
    saveDatabase(db);
    addLog('Modification Enseignant', 'Enseignants', `Mise à jour des informations de ${db.teachers[index].name}`);
    res.json(db.teachers[index]);
  });

  app.delete('/api/teachers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const teacher = db.teachers.find(t => t.id === id);
    db.teachers = db.teachers.filter(t => t.id !== id);
    saveDatabase(db);
    if (teacher) addLog('Suppression Enseignant', 'Enseignants', `Suppression de ${teacher.name}`);
    res.json({ message: 'Enseignant supprimé avec succès' });
  });

  // ==================== SCHOOLS API ====================

  app.get('/api/schools', (req: Request, res: Response) => {
    res.json(db.schools);
  });

  app.post('/api/schools', (req: Request, res: Response) => {
    const schoolData: Partial<School> = req.body;
    const newSchool: School = {
      id: 'sch-' + Date.now(),
      name: schoolData.name || 'Nouvelle École Zakoura',
      commune: schoolData.commune || 'Centre',
      douar: schoolData.douar || 'Douar Local',
      directionProvinciale: schoolData.directionProvinciale || 'Direction Provinciale d\'Al Haouz',
      phone: schoolData.phone || '+212 5 24 00 00 00',
      groupCount: schoolData.groupCount || 1,
      teacherCount: schoolData.teacherCount || 1,
      studentCount: (schoolData.boys || 15) + (schoolData.girls || 15),
      boys: schoolData.boys || 15,
      girls: schoolData.girls || 15,
      latitude: schoolData.latitude || 31.2501,
      longitude: schoolData.longitude || -7.9823,
      mapEmbedUrl: schoolData.mapEmbedUrl || 'https://maps.google.com/maps?q=31.2501,-7.9823&z=14&output=embed'
    };

    db.schools.push(newSchool);
    saveDatabase(db);
    addLog('Ajout École', 'Écoles', `Création de l'école ${newSchool.name}`);
    res.status(201).json(newSchool);
  });

  app.put('/api/schools/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.schools.findIndex(s => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'École non trouvée' });
      return;
    }
    db.schools[index] = { ...db.schools[index], ...req.body };
    saveDatabase(db);
    addLog('Mise à jour École', 'Écoles', `Modifications apportées à ${db.schools[index].name}`);
    res.json(db.schools[index]);
  });

  app.delete('/api/schools/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.schools = db.schools.filter(s => s.id !== id);
    saveDatabase(db);
    addLog('Suppression École', 'Écoles', `École ${id} supprimée`);
    res.json({ message: 'École supprimée' });
  });

  // ==================== GROUPS API ====================

  app.get('/api/groups', (req: Request, res: Response) => {
    res.json(db.groups);
  });

  app.post('/api/groups', (req: Request, res: Response) => {
    const groupData: Partial<Group> = req.body;
    const newGroup: Group = {
      id: 'grp-' + Date.now(),
      name: groupData.name || 'Nouveau Groupe',
      level: groupData.level || 'Moyenne Section',
      teacherId: groupData.teacherId || 'tch-1',
      teacherName: groupData.teacherName || 'Enseignant',
      schoolId: groupData.schoolId || 'sch-1',
      schoolName: groupData.schoolName || 'École Zakoura',
      studentCount: (groupData.boys || 10) + (groupData.girls || 10),
      boys: groupData.boys || 10,
      girls: groupData.girls || 10,
      schedule: groupData.schedule || 'Lun - Ven: 08:30 - 11:30',
      room: groupData.room || 'Salle A'
    };

    db.groups.push(newGroup);
    saveDatabase(db);
    addLog('Ajout Groupe', 'Groupes', `Création du groupe ${newGroup.name}`);
    res.status(201).json(newGroup);
  });

  app.put('/api/groups/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.groups.findIndex(g => g.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Groupe non trouvé' });
      return;
    }
    db.groups[index] = { ...db.groups[index], ...req.body };
    saveDatabase(db);
    res.json(db.groups[index]);
  });

  app.delete('/api/groups/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.groups = db.groups.filter(g => g.id !== id);
    saveDatabase(db);
    res.json({ message: 'Groupe supprimé' });
  });

  // ==================== SCHEDULE API ====================

  app.get('/api/schedule', (req: Request, res: Response) => {
    res.json(db.scheduleEvents);
  });

  app.post('/api/schedule', (req: Request, res: Response) => {
    const eventData: Partial<ScheduleEvent> = req.body;
    const newEvent: ScheduleEvent = {
      id: 'ev-' + Date.now(),
      title: eventData.title || 'Activité / Visite',
      day: eventData.day || 'Lundi',
      timeSlot: eventData.timeSlot || '08:30 - 11:30',
      schoolId: eventData.schoolId || 'sch-1',
      schoolName: eventData.schoolName || 'École Zakoura',
      teacherId: eventData.teacherId || 'tch-1',
      teacherName: eventData.teacherName || 'Enseignant',
      groupId: eventData.groupId || 'grp-1',
      groupName: eventData.groupName || 'Groupe A',
      room: eventData.room || 'Salle 1',
      type: eventData.type || 'visite_pedagogique',
      color: eventData.color || '#0284c7'
    };

    db.scheduleEvents.push(newEvent);
    saveDatabase(db);
    addLog('Création Plannning', 'Emploi du temps', `Nouvel événement planifié: ${newEvent.title}`);
    res.status(201).json(newEvent);
  });

  app.put('/api/schedule/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.scheduleEvents.findIndex(e => e.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Événement non trouvé' });
      return;
    }
    db.scheduleEvents[index] = { ...db.scheduleEvents[index], ...req.body };
    saveDatabase(db);
    res.json(db.scheduleEvents[index]);
  });

  app.delete('/api/schedule/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.scheduleEvents = db.scheduleEvents.filter(e => e.id !== id);
    saveDatabase(db);
    res.json({ message: 'Événement supprimé' });
  });

  // ==================== VISITS API ====================

  app.get('/api/visits', (req: Request, res: Response) => {
    res.json(db.visits);
  });

  app.post('/api/visits', (req: Request, res: Response) => {
    const visitData: Partial<Visit> = req.body;
    const newVisit: Visit = {
      id: 'vst-' + Date.now(),
      date: visitData.date || new Date().toISOString().split('T')[0],
      teacherId: visitData.teacherId || 'tch-1',
      teacherName: visitData.teacherName || 'Enseignant',
      schoolId: visitData.schoolId || 'sch-1',
      schoolName: visitData.schoolName || 'École Zakoura',
      groupId: visitData.groupId || 'grp-1',
      groupName: visitData.groupName || 'Groupe',
      startTime: visitData.startTime || '09:00',
      endTime: visitData.endTime || '11:00',
      durationMinutes: visitData.durationMinutes || 120,
      objective: visitData.objective || 'Visite de suivi pédagogique',
      observations: visitData.observations || 'Activités pédagogiques satisfaisantes.',
      strengths: visitData.strengths || ['Bonne gestion du climat de classe'],
      improvementPoints: visitData.improvementPoints || ['Renforcer la préparation écrite'],
      recommendedActions: visitData.recommendedActions || ['Consulter le guide pédagogique Zakoura'],
      signatureDataUrl: visitData.signatureDataUrl,
      photoUrl: visitData.photoUrl,
      attachments: visitData.attachments || [],
      status: visitData.status || 'réalisée',
      createdDate: new Date().toISOString()
    };

    db.visits.unshift(newVisit);

    // Update teacher visit stats
    const teacherIdx = db.teachers.findIndex(t => t.id === newVisit.teacherId);
    if (teacherIdx !== -1) {
      db.teachers[teacherIdx].visitCount += 1;
      db.teachers[teacherIdx].lastVisitDate = newVisit.date;
      db.teachers[teacherIdx].progressionLevel = Math.min(100, db.teachers[teacherIdx].progressionLevel + 5);
    }

    saveDatabase(db);
    addLog('Saisie Visite', 'Visites', `Visite pédagogique consignée pour ${newVisit.teacherName}`);
    res.status(201).json(newVisit);
  });

  app.put('/api/visits/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.visits.findIndex(v => v.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Visite non trouvée' });
      return;
    }
    db.visits[index] = { ...db.visits[index], ...req.body };
    saveDatabase(db);
    res.json(db.visits[index]);
  });

  app.delete('/api/visits/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.visits = db.visits.filter(v => v.id !== id);
    saveDatabase(db);
    res.json({ message: 'Visite supprimée' });
  });

  // ==================== ABSENCES API ====================

  app.get('/api/absences', (req: Request, res: Response) => {
    res.json(db.absences);
  });

  app.post('/api/absences', (req: Request, res: Response) => {
    const absData: Partial<Absence> = req.body;
    const newAbsence: Absence = {
      id: 'abs-' + Date.now(),
      schoolId: absData.schoolId || 'sch-1',
      schoolName: absData.schoolName || 'École Zakoura',
      teacherId: absData.teacherId || 'tch-1',
      teacherName: absData.teacherName || 'Enseignant',
      groupId: absData.groupId || 'grp-1',
      groupName: absData.groupName || 'Groupe A',
      month: absData.month || `${db.supervisor.selectedMonth} ${db.supervisor.selectedYear}`,
      absenceCount: absData.absenceCount || 1,
      reason: absData.reason || 'Maladie',
      observations: absData.observations || 'Absence déclarée avec justificatif',
      dateLogged: new Date().toISOString().split('T')[0]
    };

    db.absences.unshift(newAbsence);

    // Update teacher absence count
    const teacherIdx = db.teachers.findIndex(t => t.id === newAbsence.teacherId);
    if (teacherIdx !== -1) {
      db.teachers[teacherIdx].absenceCount += newAbsence.absenceCount;
    }

    saveDatabase(db);
    addLog('Saisie Absence', 'Absences', `Absence de ${newAbsence.absenceCount} jour(s) pour ${newAbsence.teacherName}`);
    res.status(201).json(newAbsence);
  });

  app.delete('/api/absences/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.absences = db.absences.filter(a => a.id !== id);
    saveDatabase(db);
    res.json({ message: 'Absence supprimée' });
  });

  // ==================== LOGS & NOTIFS API ====================

  app.get('/api/logs', (req: Request, res: Response) => {
    res.json(db.activityLogs);
  });

  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json(db.notifications);
  });

  app.post('/api/notifications/mark-read', (req: Request, res: Response) => {
    db.notifications.forEach(n => n.read = true);
    saveDatabase(db);
    res.json({ message: 'Notifications marquées comme lues' });
  });

  // Reset to seed data endpoint
  app.post('/api/system/reset-seed', (req: Request, res: Response) => {
    db = {
      supervisor: {
        ...initialSupervisor,
        passwordHash: bcrypt.hashSync('zakoura2025', 10)
      },
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
    saveDatabase(db);
    addLog('Réinitialisation', 'Système', 'Données de démonstration réinitialisées');
    res.json({ message: 'Données réinitialisées avec succès' });
  });

  // ==================== VITE MIDDLEWARE / SERVE ====================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
