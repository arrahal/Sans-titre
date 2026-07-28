import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SupervisorProfile, Teacher, School, Visit, Absence } from '../types';

interface PdfReportOptions {
  supervisorInfo: SupervisorProfile;
  month: string;
  stats?: any;
  schools: School[];
  teachers: Teacher[];
  visits: Visit[];
}

export function generatePdfReport(options: PdfReportOptions | SupervisorProfile, schools?: School[], teachers?: Teacher[], visits?: Visit[], absences?: Absence[]) {
  let supervisor: SupervisorProfile;
  let monthStr: string;
  let schoolsList: School[];
  let teachersList: Teacher[];
  let visitsList: Visit[];

  if ('supervisorInfo' in options) {
    supervisor = options.supervisorInfo;
    monthStr = options.month;
    schoolsList = options.schools;
    teachersList = options.teachers;
    visitsList = options.visits;
  } else {
    supervisor = options;
    monthStr = `${supervisor.selectedMonth || 'Novembre'} ${supervisor.selectedYear || '2025'}`;
    schoolsList = schools || [];
    teachersList = teachers || [];
    visitsList = visits || [];
  }

  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(30, 58, 138); // Deep Blue
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('FONDATION ZAKOURA', 14, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('RAPPORT MENSUEL DE SUPERVISION PÉDAGOGIQUE', 14, 27);

  // Metadata Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 42, 182, 32, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Superviseur :`, 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`${supervisor.name}`, 50, 50);

  doc.setFont('helvetica', 'bold');
  doc.text(`Projet :`, 20, 57);
  doc.setFont('helvetica', 'normal');
  doc.text(`${supervisor.project}`, 50, 57);

  doc.setFont('helvetica', 'bold');
  doc.text(`Province :`, 20, 64);
  doc.setFont('helvetica', 'normal');
  doc.text(`${supervisor.province}`, 50, 64);

  doc.setFont('helvetica', 'bold');
  doc.text(`Période :`, 20, 71);
  doc.setFont('helvetica', 'normal');
  doc.text(`${monthStr}`, 50, 71);

  // Summary Table
  let totalStudents = 0;
  schoolsList.forEach(s => {
    totalStudents += s.studentCount;
  });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Indicateurs Globaux de Performance', 14, 85);

  autoTable(doc, {
    startY: 90,
    head: [['Indicateur Pédagogique', 'Valeur Mésurée']],
    body: [
      ['Écoles Unités Préscolaires', schoolsList.length.toString()],
      ['Corps Enseignant Actif', teachersList.length.toString()],
      ['Effectif Total Élèves', totalStudents.toString()],
      ['Visites Terrain Réalisées', visitsList.length.toString()]
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 130;

  // Visits Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Extrait des Visites de Supervision', 14, finalY + 12);

  const visitRows = visitsList.map(v => [
    v.date,
    v.teacherName,
    v.schoolName,
    v.objective,
    v.status
  ]);

  autoTable(doc, {
    startY: finalY + 16,
    head: [['Date', 'Enseignant', 'École', 'Objectif', 'Statut']],
    body: visitRows,
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8 }
  });

  // Footer Signature
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Document officiel généré par l'Espace Superviseur Zakoura le ${new Date().toLocaleDateString('fr-FR')}`, 14, pageHeight - 15);
  doc.setFont('helvetica', 'bold');
  doc.text(`Signature : ${supervisor.name}`, 140, pageHeight - 15);

  doc.save(`Rapport_Supervision_Zakoura_${monthStr.replace(/\s+/g, '_')}.pdf`);
}
