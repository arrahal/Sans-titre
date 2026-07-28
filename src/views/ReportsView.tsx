import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
  Users,
  Award,
  Lightbulb,
  FileSpreadsheet,
  FileBox
} from 'lucide-react';
import { SupervisorProfile, School, Teacher, Visit, Absence } from '../types';
import { generateWordReport } from '../utils/docxExport';
import { generatePdfReport } from '../utils/pdfExport';

interface ReportsViewProps {
  supervisorInfo: SupervisorProfile;
  stats: any;
  schools: School[];
  teachers: Teacher[];
  visits: Visit[];
  absences: Absence[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  supervisorInfo,
  stats,
  schools,
  teachers,
  visits,
  absences
}) => {
  const [reportMonth, setReportMonth] = useState('Novembre 2025');
  const [periodType, setPeriodType] = useState<'mensuel' | 'trimestriel'>('mensuel');
  const [generating, setGenerating] = useState(false);

  const handleExportWord = async () => {
    try {
      setGenerating(true);
      await generateWordReport({
        supervisorInfo,
        month: reportMonth,
        stats,
        schools,
        teachers,
        visits
      });
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la génération du document Word.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportPdf = () => {
    generatePdfReport({
      supervisorInfo,
      month: reportMonth,
      stats,
      schools,
      teachers,
      visits
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" /> Générateur de Rapports Pédagogiques Officiels
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Génération automatique des rapports mensuels & trimestriels structurés aux normes de la Fondation Zakoura
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportWord}
            disabled={generating}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Export Word (.docx)
          </button>
          <button
            onClick={handleExportPdf}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Export PDF Officiel
          </button>
        </div>
      </div>

      {/* Configuration Cards */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Période du rapport
          </label>
          <select
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="Septembre 2025">Septembre 2025</option>
            <option value="Octobre 2025">Octobre 2025</option>
            <option value="Novembre 2025">Novembre 2025</option>
            <option value="Décembre 2025">Décembre 2025</option>
            <option value="Janvier 2026">Janvier 2026</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Type de Synthèse
          </label>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPeriodType('mensuel')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                periodType === 'mensuel' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setPeriodType('trimestriel')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                periodType === 'trimestriel' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Trimestriel
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <span className="text-[11px] font-bold text-blue-900 dark:text-blue-200 block">Compilation automatique</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400">Toutes les données sont injectées en direct</span>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE PREVIEW OF THE REPORT */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-12 space-y-8 max-w-4xl mx-auto">
        {/* Report Header */}
        <div className="border-b-2 border-blue-900 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-blue-900 dark:text-blue-400 uppercase tracking-widest">
              FONDATION ZAKOURA - DIRECTION PÉDAGOGIQUE
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              RAPPORT DE SUPERVISION {periodType.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-500 font-medium">Période : {reportMonth}</p>
          </div>
          <div className="text-right text-xs text-slate-600 dark:text-slate-400">
            <p className="font-bold text-slate-900 dark:text-white">{supervisorInfo.name}</p>
            <p>{supervisorInfo.province}</p>
            <p className="text-[10px] text-emerald-600 font-semibold">{supervisorInfo.project}</p>
          </div>
        </div>

        {/* 1. Synthèse Générale */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1">
            1. Synthèse Générale des Données
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Écoles Unités</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{stats?.totalSchools || 0}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Enseignants</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{stats?.totalTeachers || 0}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Total Élèves</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{stats?.totalStudents || 0}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Visites Terrain</span>
              <span className="text-lg font-bold text-emerald-600">{stats?.totalVisits || 0}</span>
            </div>
          </div>
        </div>

        {/* 2. Écoles et Réseau Visités */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1">
            2. Réseau des Écoles Couvertes
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {schools.map(s => (
              <li key={s.id} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                <span className="text-slate-400">{s.studentCount} Élèves</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Points Forts & Recommandations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Points Forts Observés
            </h4>
            <ul className="list-disc list-inside space-y-1 text-emerald-900 dark:text-emerald-200">
              <li>Assiduité constante du corps éducatif dans les douars.</li>
              <li>Excellente maîtrise des comptines et rituels préscolaires Zakoura.</li>
              <li>Implication remarquable des associations de parents d'élèves localement.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50">
            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" /> Recommandations Stratégiques
            </h4>
            <ul className="list-disc list-inside space-y-1 text-blue-900 dark:text-blue-200">
              <li>Organiser un atelier de formation continue sur le graphisme ludique.</li>
              <li>Renforcer la dotation en matériel de peinture et d'arts plastiques.</li>
              <li>Suivre attentivement la régularité des présences pendant les périodes de cueillette.</li>
            </ul>
          </div>
        </div>

        {/* Signature Box */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
          <div className="text-xs text-slate-400">
            <p>Fait à {supervisorInfo.province.split(' ')[1] || 'Marrakech'}, le {new Date().toLocaleDateString('fr-FR')}</p>
            <p>Document officiel - Fondation Zakoura</p>
          </div>

          <div className="text-center border-t border-dashed border-slate-300 pt-2 min-w-[180px]">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Signature du Superviseur</p>
            <p className="text-[10px] text-slate-400 mt-1">{supervisorInfo.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
