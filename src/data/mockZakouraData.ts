import { SupervisorProfile, Teacher, School, Group, ScheduleEvent, Visit, Absence, ActivityLog, NotificationItem } from '../types';

export const initialSupervisor: SupervisorProfile = {
  id: 'sup-001',
  name: 'Karim EL AMRANI',
  project: 'Programme Éducation Préscolaire en Milieu Rural (PEPMR)',
  province: 'Préfecture de Marrakech - Province d\'Al Haouz',
  selectedMonth: 'Octobre',
  selectedYear: 2025,
  email: 'karim.elamrani@zakoura.org',
  phone: '+212 6 61 23 45 67',
  role: 'Superviseur Pédagogique Senior',
  createdAt: '2024-09-01T08:00:00Z'
};

export const initialSchools: School[] = [
  {
    id: 'sch-1',
    name: 'École Préscolaire Zakoura - Douar Asni',
    commune: 'Asni',
    douar: 'Douar Asni Centre',
    directionProvinciale: 'Direction Provinciale d\'Al Haouz',
    phone: '+212 5 24 48 10 22',
    groupCount: 2,
    teacherCount: 2,
    studentCount: 42,
    boys: 22,
    girls: 20,
    latitude: 31.2501,
    longitude: -7.9823,
    mapEmbedUrl: 'https://maps.google.com/maps?q=31.2501,-7.9823&z=14&output=embed'
  },
  {
    id: 'sch-2',
    name: 'Unité Préscolaire - Douar Tahanaout',
    commune: 'Tahanaout',
    douar: 'Douar Ait Ziad',
    directionProvinciale: 'Direction Provinciale d\'Al Haouz',
    phone: '+212 5 24 48 22 15',
    groupCount: 3,
    teacherCount: 2,
    studentCount: 58,
    boys: 30,
    girls: 28,
    latitude: 31.3533,
    longitude: -7.9521,
    mapEmbedUrl: 'https://maps.google.com/maps?q=31.3533,-7.9521&z=14&output=embed'
  },
  {
    id: 'sch-3',
    name: 'École Préscolaire Communautaire - Oukaïmeden',
    commune: 'Oukaïmeden',
    douar: 'Douar Tacheddirt',
    directionProvinciale: 'Direction Provinciale d\'Al Haouz',
    phone: '+212 5 24 48 33 09',
    groupCount: 2,
    teacherCount: 1,
    studentCount: 36,
    boys: 17,
    girls: 19,
    latitude: 31.2050,
    longitude: -7.8631,
    mapEmbedUrl: 'https://maps.google.com/maps?q=31.2050,-7.8631&z=14&output=embed'
  },
  {
    id: 'sch-4',
    name: 'Unité Zakoura - Douar Ourika Valley',
    commune: 'Ourika',
    douar: 'Douar Setti Fatma',
    directionProvinciale: 'Direction Provinciale d\'Al Haouz',
    phone: '+212 5 24 48 44 88',
    groupCount: 3,
    teacherCount: 2,
    studentCount: 65,
    boys: 34,
    girls: 31,
    latitude: 31.3120,
    longitude: -7.7811,
    mapEmbedUrl: 'https://maps.google.com/maps?q=31.3120,-7.7811&z=14&output=embed'
  },
  {
    id: 'sch-5',
    name: 'École Préscolaire Zakoura - Douar Amizmiz',
    commune: 'Amizmiz',
    douar: 'Douar Azgour',
    directionProvinciale: 'Direction Provinciale d\'Al Haouz',
    phone: '+212 5 24 48 55 12',
    groupCount: 2,
    teacherCount: 2,
    studentCount: 44,
    boys: 21,
    girls: 23,
    latitude: 31.2167,
    longitude: -8.2500,
    mapEmbedUrl: 'https://maps.google.com/maps?q=31.2167,-8.2500&z=14&output=embed'
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: 'tch-1',
    name: 'Fatima-Zahra BENALI',
    phone: '+212 6 62 11 22 33',
    email: 'fz.benali@zakoura-edu.ma',
    schoolId: 'sch-1',
    schoolName: 'École Préscolaire Zakoura - Douar Asni',
    commune: 'Asni',
    groupCount: 1,
    groupNames: ['Groupe GS - Asni'],
    studentCount: 22,
    boys: 12,
    girls: 10,
    assignmentDate: '2023-09-15',
    status: 'actif',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    visitCount: 6,
    lastVisitDate: '2025-10-18',
    absenceCount: 1,
    progressionLevel: 88
  },
  {
    id: 'tch-2',
    name: 'Sanaa CHRAIBI',
    phone: '+212 6 63 44 55 66',
    email: 'sanaa.chraibi@zakoura-edu.ma',
    schoolId: 'sch-1',
    schoolName: 'École Préscolaire Zakoura - Douar Asni',
    commune: 'Asni',
    groupCount: 1,
    groupNames: ['Groupe MS - Asni'],
    studentCount: 20,
    boys: 10,
    girls: 10,
    assignmentDate: '2024-01-10',
    status: 'actif',
    photoUrl: 'https://images.unsplash.com/photo-1580894732413-80f2d4e7f1ff?w=150&auto=format&fit=crop&q=80',
    visitCount: 4,
    lastVisitDate: '2025-10-12',
    absenceCount: 0,
    progressionLevel: 92
  },
  {
    id: 'tch-3',
    name: 'Mohamed BOUKHARIS',
    phone: '+212 6 64 77 88 99',
    email: 'm.boukharis@zakoura-edu.ma',
    schoolId: 'sch-2',
    schoolName: 'Unité Préscolaire - Douar Tahanaout',
    commune: 'Tahanaout',
    groupCount: 2,
    groupNames: ['Groupe MS A - Tahanaout', 'Groupe GS B - Tahanaout'],
    studentCount: 38,
    boys: 20,
    girls: 18,
    assignmentDate: '2022-10-01',
    status: 'actif',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    visitCount: 7,
    lastVisitDate: '2025-10-22',
    absenceCount: 2,
    progressionLevel: 84
  },
  {
    id: 'tch-4',
    name: 'Khadija EL IDRISSI',
    phone: '+212 6 65 00 11 22',
    email: 'khadija.elidrissi@zakoura-edu.ma',
    schoolId: 'sch-2',
    schoolName: 'Unité Préscolaire - Douar Tahanaout',
    commune: 'Tahanaout',
    groupCount: 1,
    groupNames: ['Groupe PS - Tahanaout'],
    studentCount: 20,
    boys: 10,
    girls: 10,
    assignmentDate: '2023-09-01',
    status: 'actif',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    visitCount: 5,
    lastVisitDate: '2025-10-05',
    absenceCount: 1,
    progressionLevel: 90
  },
  {
    id: 'tch-5',
    name: 'Youssef AIT ALI',
    phone: '+212 6 66 33 44 55',
    email: 'youssef.aitali@zakoura-edu.ma',
    schoolId: 'sch-3',
    schoolName: 'École Préscolaire Communautaire - Oukaïmeden',
    commune: 'Oukaïmeden',
    groupCount: 2,
    groupNames: ['Groupe PS/MS - Oukaïmeden', 'Groupe GS - Oukaïmeden'],
    studentCount: 36,
    boys: 17,
    girls: 19,
    assignmentDate: '2023-11-01',
    status: 'actif',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    visitCount: 5,
    lastVisitDate: '2025-10-14',
    absenceCount: 3,
    progressionLevel: 78
  },
  {
    id: 'tch-6',
    name: 'Houda MANSOURI',
    phone: '+212 6 67 88 99 00',
    email: 'h.mansouri@zakoura-edu.ma',
    schoolId: 'sch-4',
    schoolName: 'Unité Zakoura - Douar Ourika Valley',
    commune: 'Ourika',
    groupCount: 2,
    groupNames: ['Groupe MS - Ourika', 'Groupe GS A - Ourika'],
    studentCount: 40,
    boys: 21,
    girls: 19,
    assignmentDate: '2024-02-15',
    status: 'actif',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    visitCount: 8,
    lastVisitDate: '2025-10-25',
    absenceCount: 0,
    progressionLevel: 95
  },
  {
    id: 'tch-7',
    name: 'Laila TOUMI',
    phone: '+212 6 68 12 34 56',
    email: 'laila.toumi@zakoura-edu.ma',
    schoolId: 'sch-5',
    schoolName: 'École Préscolaire Zakoura - Douar Amizmiz',
    commune: 'Amizmiz',
    groupCount: 1,
    groupNames: ['Groupe GS - Amizmiz'],
    studentCount: 22,
    boys: 11,
    girls: 11,
    assignmentDate: '2023-10-10',
    status: 'actif',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    visitCount: 4,
    lastVisitDate: '2025-10-08',
    absenceCount: 1,
    progressionLevel: 86
  }
];

export const initialGroups: Group[] = [
  {
    id: 'grp-1',
    name: 'Groupe GS - Asni',
    level: 'Grande Section (5-6 ans)',
    teacherId: 'tch-1',
    teacherName: 'Fatima-Zahra BENALI',
    schoolId: 'sch-1',
    schoolName: 'École Préscolaire Zakoura - Douar Asni',
    studentCount: 22,
    boys: 12,
    girls: 10,
    schedule: 'Lun - Ven: 08:30 - 11:30',
    room: 'Salle Polyvalente 1'
  },
  {
    id: 'grp-2',
    name: 'Groupe MS - Asni',
    level: 'Moyenne Section (4-5 ans)',
    teacherId: 'tch-2',
    teacherName: 'Sanaa CHRAIBI',
    schoolId: 'sch-1',
    schoolName: 'École Préscolaire Zakoura - Douar Asni',
    studentCount: 20,
    boys: 10,
    girls: 10,
    schedule: 'Lun - Ven: 13:30 - 16:30',
    room: 'Salle d\'Eveil'
  },
  {
    id: 'grp-3',
    name: 'Groupe MS A - Tahanaout',
    level: 'Moyenne Section (4-5 ans)',
    teacherId: 'tch-3',
    teacherName: 'Mohamed BOUKHARIS',
    schoolId: 'sch-2',
    schoolName: 'Unité Préscolaire - Douar Tahanaout',
    studentCount: 18,
    boys: 10,
    girls: 8,
    schedule: 'Lun - Ven: 08:30 - 11:30',
    room: 'Salle A1'
  },
  {
    id: 'grp-4',
    name: 'Groupe GS B - Tahanaout',
    level: 'Grande Section (5-6 ans)',
    teacherId: 'tch-3',
    teacherName: 'Mohamed BOUKHARIS',
    schoolId: 'sch-2',
    schoolName: 'Unité Préscolaire - Douar Tahanaout',
    studentCount: 20,
    boys: 10,
    girls: 10,
    schedule: 'Lun - Ven: 13:30 - 16:30',
    room: 'Salle A1'
  },
  {
    id: 'grp-5',
    name: 'Groupe PS - Tahanaout',
    level: 'Petite Section (3-4 ans)',
    teacherId: 'tch-4',
    teacherName: 'Khadija EL IDRISSI',
    schoolId: 'sch-2',
    schoolName: 'Unité Préscolaire - Douar Tahanaout',
    studentCount: 20,
    boys: 10,
    girls: 10,
    schedule: 'Lun - Ven: 08:30 - 11:30',
    room: 'Salle A2'
  },
  {
    id: 'grp-6',
    name: 'Groupe PS/MS - Oukaïmeden',
    level: 'Multi-Niveaux PS/MS',
    teacherId: 'tch-5',
    teacherName: 'Youssef AIT ALI',
    schoolId: 'sch-3',
    schoolName: 'École Préscolaire Communautaire - Oukaïmeden',
    studentCount: 18,
    boys: 8,
    girls: 10,
    schedule: 'Lun - Ven: 08:30 - 11:30',
    room: 'Salle unique'
  },
  {
    id: 'grp-7',
    name: 'Groupe GS - Oukaïmeden',
    level: 'Grande Section (5-6 ans)',
    teacherId: 'tch-5',
    teacherName: 'Youssef AIT ALI',
    schoolId: 'sch-3',
    schoolName: 'École Préscolaire Communautaire - Oukaïmeden',
    studentCount: 18,
    boys: 9,
    girls: 9,
    schedule: 'Lun - Ven: 13:30 - 16:30',
    room: 'Salle unique'
  },
  {
    id: 'grp-8',
    name: 'Groupe MS - Ourika',
    level: 'Moyenne Section (4-5 ans)',
    teacherId: 'tch-6',
    teacherName: 'Houda MANSOURI',
    schoolId: 'sch-4',
    schoolName: 'Unité Zakoura - Douar Ourika Valley',
    studentCount: 20,
    boys: 11,
    girls: 9,
    schedule: 'Lun - Ven: 08:30 - 11:30',
    room: 'Salle B1'
  },
  {
    id: 'grp-9',
    name: 'Groupe GS A - Ourika',
    level: 'Grande Section (5-6 ans)',
    teacherId: 'tch-6',
    teacherName: 'Houda MANSOURI',
    schoolId: 'sch-4',
    schoolName: 'Unité Zakoura - Douar Ourika Valley',
    studentCount: 20,
    boys: 10,
    girls: 10,
    schedule: 'Lun - Ven: 13:30 - 16:30',
    room: 'Salle B1'
  },
  {
    id: 'grp-10',
    name: 'Groupe GS - Amizmiz',
    level: 'Grande Section (5-6 ans)',
    teacherId: 'tch-7',
    teacherName: 'Laila TOUMI',
    schoolId: 'sch-5',
    schoolName: 'École Préscolaire Zakoura - Douar Amizmiz',
    studentCount: 22,
    boys: 11,
    girls: 11,
    schedule: 'Lun - Ven: 08:30 - 11:30',
    room: 'Salle C1'
  }
];

export const initialVisits: Visit[] = [
  {
    id: 'vst-101',
    date: '2025-10-25',
    teacherId: 'tch-6',
    teacherName: 'Houda MANSOURI',
    schoolId: 'sch-4',
    schoolName: 'Unité Zakoura - Douar Ourika Valley',
    groupId: 'grp-8',
    groupName: 'Groupe MS - Ourika',
    startTime: '09:00',
    endTime: '11:00',
    durationMinutes: 120,
    objective: 'Évaluation des activités de pré-lecture, de graphisme et de socialisation des enfants de moyenne section.',
    observations: 'L\'enseignante maîtrise la gestion du groupe classe. Les ateliers ludiques de découpage et de tri par forme sont bien structurés.',
    strengths: [
      'Excellente dynamique de groupe et climat bienveillant',
      'Bonne utilisation du coin contes et des supports imagés Zakoura',
      'Participation très active des filles et des garçons'
    ],
    improvementPoints: [
      'Gestion du temps lors des transitions entre ateliers',
      'Renforcer la verbalisation individuelle en dialecte/arabe classique'
    ],
    recommendedActions: [
      'Intégrer une comptine de transition de 2 minutes',
      'Varier la difficulté des fiches graphiques pour les enfants avancés'
    ],
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAA3CAYAAADt7kXAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA',
    photoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
    attachments: ['Fiche_Obs_Ourika_2510.pdf'],
    status: 'réalisée',
    createdDate: '2025-10-25T11:15:00Z'
  },
  {
    id: 'vst-102',
    date: '2025-10-22',
    teacherId: 'tch-3',
    teacherName: 'Mohamed BOUKHARIS',
    schoolId: 'sch-2',
    schoolName: 'Unité Préscolaire - Douar Tahanaout',
    groupId: 'grp-3',
    groupName: 'Groupe MS A - Tahanaout',
    startTime: '08:30',
    endTime: '10:30',
    durationMinutes: 120,
    objective: 'Suivi des rituels du matin, météo, calendrier et activités logico-mathématiques.',
    observations: 'Séance bien préparée. Le matériel pédagogique fourni par la Fondation Zakoura est bien entretenu et accessible aux élèves.',
    strengths: [
      'Rituels très bien intégrés par tous les élèves',
      'Animateur enthousiaste et communicatif',
      'Bonne tenue du registre de présence'
    ],
    improvementPoints: [
      'Aménager le coin sciences avec des éléments naturels locaux'
    ],
    recommendedActions: [
      'Organiser une sortie guidée autour du douar pour récolter des feuilles/cailloux',
      'Installer un tableau des responsabilités quotidiennes'
    ],
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAA3CAYAAADt7kXAAAAAAXNSR0IArs4c6Q==',
    status: 'réalisée',
    createdDate: '2025-10-22T10:45:00Z'
  },
  {
    id: 'vst-103',
    date: '2025-10-18',
    teacherId: 'tch-1',
    teacherName: 'Fatima-Zahra BENALI',
    schoolId: 'sch-1',
    schoolName: 'École Préscolaire Zakoura - Douar Asni',
    groupId: 'grp-1',
    groupName: 'Groupe GS - Asni',
    startTime: '10:00',
    endTime: '11:30',
    durationMinutes: 90,
    objective: 'Contrôle des compétences grapho-motrices et éveil scientifique.',
    observations: 'Les enfants effectuent correctement la boucle et le quadrillage. L\'éducatrice montre beaucoup de patience.',
    strengths: [
      'Posture assise et tenue du crayon vérifiées régulièrement',
      'Atmosphère calme et propice à la concentration'
    ],
    improvementPoints: [
      'Proposer davantage de manipulation de pâte à modeler avant le tracé papier'
    ],
    recommendedActions: [
      'Mettre en place la pâte à modeler lors du premier quart d\'heure'
    ],
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAA3CAYAAADt7kXAAA==',
    status: 'réalisée',
    createdDate: '2025-10-18T11:40:00Z'
  },
  {
    id: 'vst-104',
    date: '2025-10-14',
    teacherId: 'tch-5',
    teacherName: 'Youssef AIT ALI',
    schoolId: 'sch-3',
    schoolName: 'École Préscolaire Communautaire - Oukaïmeden',
    groupId: 'grp-6',
    groupName: 'Groupe PS/MS - Oukaïmeden',
    startTime: '09:00',
    endTime: '11:00',
    durationMinutes: 120,
    objective: 'Vérification du déroulement des activités motrices et psychomotricité globale.',
    observations: 'Le cadre montagnard nécessite une gestion attentive du froid et de la ventilation de la salle. Travail satisfaisant.',
    strengths: [
      'Jeux collectifs très ludiques stimulants la coopération'
    ],
    improvementPoints: [
      'Veiller au port du gilet/manteau lors des jeux en extérieur'
    ],
    recommendedActions: [
      'Harmoniser l\'emploi du temps en tenant compte de la météo hivernale'
    ],
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAA3CAYAAADt7kXAAA==',
    status: 'réalisée',
    createdDate: '2025-10-14T11:10:00Z'
  }
];

export const initialAbsences: Absence[] = [
  {
    id: 'abs-1',
    schoolId: 'sch-3',
    schoolName: 'École Préscolaire Communautaire - Oukaïmeden',
    teacherId: 'tch-5',
    teacherName: 'Youssef AIT ALI',
    groupId: 'grp-6',
    groupName: 'Groupe PS/MS - Oukaïmeden',
    month: 'Octobre 2025',
    absenceCount: 3,
    dayCount: 3,
    startDate: '2025-10-07',
    endDate: '2025-10-09',
    justified: true,
    reason: 'Maladie - Certificat médical',
    observations: 'Éducateur arrêté pour état grippal aigu avec certificat médical visé.',
    dateLogged: '2025-10-07'
  },
  {
    id: 'abs-2',
    schoolId: 'sch-2',
    schoolName: 'Unité Préscolaire - Douar Tahanaout',
    teacherId: 'tch-3',
    teacherName: 'Mohamed BOUKHARIS',
    groupId: 'grp-3',
    groupName: 'Groupe MS A - Tahanaout',
    month: 'Octobre 2025',
    absenceCount: 2,
    dayCount: 2,
    startDate: '2025-10-15',
    endDate: '2025-10-16',
    justified: true,
    reason: 'Formation continue Zakoura',
    observations: 'Participation à la session régionale de renforcement pédagogique Zakoura à Marrakech.',
    dateLogged: '2025-10-15'
  },
  {
    id: 'abs-3',
    schoolId: 'sch-1',
    schoolName: 'École Préscolaire Zakoura - Douar Asni',
    teacherId: 'tch-1',
    teacherName: 'Fatima-Zahra BENALI',
    groupId: 'grp-1',
    groupName: 'Groupe GS - Asni',
    month: 'Octobre 2025',
    absenceCount: 1,
    dayCount: 1,
    startDate: '2025-10-20',
    endDate: '2025-10-20',
    justified: true,
    reason: 'Autorisation administrative',
    observations: 'Demande d\'autorisation d\'absence exceptionnelle validée par le coordinateur provincial.',
    dateLogged: '2025-10-20'
  },
  {
    id: 'abs-4',
    schoolId: 'sch-5',
    schoolName: 'École Préscolaire Zakoura - Douar Amizmiz',
    teacherId: 'tch-7',
    teacherName: 'Laila TOUMI',
    groupId: 'grp-10',
    groupName: 'Groupe GS - Amizmiz',
    month: 'Octobre 2025',
    absenceCount: 1,
    dayCount: 1,
    startDate: '2025-10-28',
    endDate: '2025-10-28',
    justified: false,
    reason: 'Absence non justifiée',
    observations: 'En retard de transmission du justificatif.',
    dateLogged: '2025-10-28'
  }
];

export const initialScheduleEvents: ScheduleEvent[] = [
  {
    id: 'ev-1',
    title: 'Visite de Supervision - Groupe GS Asni',
    day: 'Lundi',
    timeSlot: '08:30 - 11:30',
    schoolId: 'sch-1',
    schoolName: 'École Préscolaire Zakoura - Douar Asni',
    teacherId: 'tch-1',
    teacherName: 'Fatima-Zahra BENALI',
    groupId: 'grp-1',
    groupName: 'Groupe GS - Asni',
    room: 'Salle Polyvalente 1',
    type: 'visite_pedagogique',
    color: '#0284c7'
  },
  {
    id: 'ev-2',
    title: 'Atelier Graphisme & Rituels',
    day: 'Mardi',
    timeSlot: '08:30 - 11:30',
    schoolId: 'sch-2',
    schoolName: 'Unité Préscolaire - Douar Tahanaout',
    teacherId: 'tch-3',
    teacherName: 'Mohamed BOUKHARIS',
    groupId: 'grp-3',
    groupName: 'Groupe MS A - Tahanaout',
    room: 'Salle A1',
    type: 'cours',
    color: '#16a34a'
  },
  {
    id: 'ev-3',
    title: 'Réunion Pédagogique Mensuelle',
    day: 'Mercredi',
    timeSlot: '14:00 - 16:30',
    schoolId: 'sch-2',
    schoolName: 'Unité Préscolaire - Douar Tahanaout',
    teacherId: 'tch-3',
    teacherName: 'Mohamed BOUKHARIS',
    groupId: 'grp-3',
    groupName: 'Tous les éducateurs Tahanaout',
    room: 'Salle Réunion',
    type: 'reunion',
    color: '#9333ea'
  },
  {
    id: 'ev-4',
    title: 'Supervision & Observation - Ourika',
    day: 'Jeudi',
    timeSlot: '09:00 - 11:30',
    schoolId: 'sch-4',
    schoolName: 'Unité Zakoura - Douar Ourika Valley',
    teacherId: 'tch-6',
    teacherName: 'Houda MANSOURI',
    groupId: 'grp-8',
    groupName: 'Groupe MS - Ourika',
    room: 'Salle B1',
    type: 'visite_pedagogique',
    color: '#0284c7'
  },
  {
    id: 'ev-5',
    title: 'Formation Continue - Conte & Éveil',
    day: 'Vendredi',
    timeSlot: '09:00 - 12:00',
    schoolId: 'sch-1',
    schoolName: 'Centre Régional Zakoura',
    teacherId: 'tch-2',
    teacherName: 'Sanaa CHRAIBI',
    groupId: 'grp-2',
    groupName: 'Éducatrices Asni & Amizmiz',
    room: 'Grand Amphi',
    type: 'formation',
    color: '#ea580c'
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2025-10-28T08:15:00Z',
    action: 'Visite enregistrée',
    module: 'Visites',
    description: 'Nouvelle visite pédagogique réalisée pour Houda MANSOURI à Ourika.',
    user: 'Karim EL AMRANI'
  },
  {
    id: 'log-2',
    timestamp: '2025-10-25T14:30:00Z',
    action: 'Mise à jour École',
    module: 'Écoles',
    description: 'Mise à jour des effectifs élèves pour l\'École de Tahanaout (58 élèves).',
    user: 'Karim EL AMRANI'
  },
  {
    id: 'log-3',
    timestamp: '2025-10-20T10:00:00Z',
    action: 'Saisie d\'absence',
    module: 'Absences',
    description: 'Enregistrement de 1 jour d\'absence autorisée pour Fatima-Zahra BENALI.',
    user: 'Karim EL AMRANI'
  },
  {
    id: 'log-4',
    timestamp: '2025-10-15T09:00:00Z',
    action: 'Rapport généré',
    module: 'Rapports',
    description: 'Génération du rapport mensuel intermédiaire de supervision pour le mois d\'Octobre.',
    user: 'Karim EL AMRANI'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Visite à planifier',
    message: 'L\'enseignant Youssef AIT ALI à Oukaïmeden requiert une visite de suivi pédagogique.',
    date: 'Aujourd\'hui, 08:30',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Taux de visites atteint',
    message: 'Vous avez réalisé 87.5% de vos objectifs de visites pour le mois d\'Octobre.',
    date: 'Hier, 17:00',
    type: 'success',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Rapport mensuel prêt',
    message: 'Le modèle de rapport mensuel Word (.docx) est disponible pour le téléchargement.',
    date: '26 Octobre 2025',
    type: 'info',
    read: true
  }
];
