import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ShadingType } from 'docx';
import { SupervisorProfile, Teacher, School, Visit, Absence } from '../types';

export async function generateWordReport(options: {
  supervisorInfo: SupervisorProfile;
  month: string;
  stats: any;
  schools: School[];
  teachers: Teacher[];
  visits: Visit[];
}) {
  const { supervisorInfo, month, stats, schools, teachers, visits } = options;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // HEADER COVER PAGE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "FONDATION ZAKOURA",
                bold: true,
                size: 36,
                color: "1E3A8A",
                font: "Calibri"
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: "ÉDUCATION & DÉVELOPPEMENT HUMANITAIRE EN MILIEU RURAL",
                italics: true,
                size: 20,
                color: "16A34A",
                font: "Calibri"
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "RAPPORT DE SUPERVISION PÉDAGOGIQUE",
                bold: true,
                size: 32,
                color: "0F172A",
                font: "Calibri"
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: `Période : ${month}`,
                bold: true,
                size: 24,
                color: "2563EB",
                font: "Calibri"
              }),
            ],
          }),

          // SUPERVISOR METADATA TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        spacing: { after: 100 },
                        children: [
                          new TextRun({ text: "Superviseur : ", bold: true }),
                          new TextRun({ text: supervisorInfo.name }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 100 },
                        children: [
                          new TextRun({ text: "Projet : ", bold: true }),
                          new TextRun({ text: supervisorInfo.project }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 100 },
                        children: [
                          new TextRun({ text: "Province / Préfecture : ", bold: true }),
                          new TextRun({ text: supervisorInfo.province }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 300, before: 300 },
            children: [
              new TextRun({
                text: "1. SYNTHÈSE GLOBALE DES EFFECTIFS ET VISITES",
                bold: true,
                size: 24,
                color: "1E3A8A",
              }),
            ],
          }),

          // STATS TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Indicateur", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Valeur", bold: true })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Nombre d'écoles préscolaires" })] }),
                  new TableCell({ children: [new Paragraph({ text: `${stats?.totalSchools || schools.length}` })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Nombre d'enseignants" })] }),
                  new TableCell({ children: [new Paragraph({ text: `${stats?.totalTeachers || teachers.length}` })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Nombre d'élèves total" })] }),
                  new TableCell({ children: [new Paragraph({ text: `${stats?.totalStudents || 0}` })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Total visites réalisées" })] }),
                  new TableCell({ children: [new Paragraph({ text: `${stats?.totalVisits || visits.length}` })] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 200, before: 400 },
            children: [
              new TextRun({
                text: "2. COMPTES-RENDUS DE VISITES TERRAIN",
                bold: true,
                size: 24,
                color: "1E3A8A",
              }),
            ],
          }),

          ...visits.map(v => new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: `• Visite le ${v.date} - ${v.teacherName} (${v.schoolName}) : `, bold: true }),
              new TextRun({ text: `${v.objective}. Observations: ${v.observations}` }),
            ],
          })),

          new Paragraph({
            spacing: { before: 600 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "Fait pour valoir ce que de droit.\n", italics: true }),
              new TextRun({ text: `Signature : ${supervisorInfo.name}`, bold: true }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rapport_Zakoura_${month.replace(/\s+/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const generateWordReportDocx = generateWordReport;
