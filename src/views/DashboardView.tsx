import React from 'react';
import {
  Users,
  School as SchoolIcon,
  Layers,
  GraduationCap,
  ClipboardCheck,
  UserX,
  TrendingUp,
  Percent,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { ActiveTab } from '../types';

interface DashboardViewProps {
  stats: any;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ stats, onNavigateTab }) => {
  if (!stats) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        Chargement des statistiques pédagogiques...
      </div>
    );
  }

  const {
    totalTeachers,
    totalSchools,
    totalGroups,
    totalStudents,
    totalBoys,
    totalGirls,
    totalVisits,
    totalAbsences,
    visitRealizationRate,
    monthlyEvolution,
    genderDistribution,
    absencesByMonth,
    visitsPerTeacher,
    groupsPerSchool
  } = stats;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Title Bar with Strategic Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Tableau de Bord Stratégique
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Suivi opérationnel des écoles, enseignants, effectifs et visites de la Fondation Zakoura
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('visits')}
            className="px-4 py-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Saisir une visite</span>
          </button>
        </div>
      </div>

      {/* STATS CARDS GRID (GEOMETRIC BALANCE 5-COLUMN SYSTEM) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Teachers Card - Blue */}
        <div
          onClick={() => onNavigateTab('teachers')}
          className="bg-blue-600 text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:bg-blue-700 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs opacity-90 font-medium">
            <span>Enseignants</span>
            <Users className="w-4 h-4 opacity-80" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold">{totalTeachers}</span>
          </div>
          <p className="text-[10px] opacity-80 font-medium">Éducateurs affectés</p>
        </div>

        {/* Schools & Groups Card - Emerald */}
        <div
          onClick={() => onNavigateTab('schools')}
          className="bg-emerald-500 text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:bg-emerald-600 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs opacity-90 font-medium">
            <span>Écoles / Groupes</span>
            <SchoolIcon className="w-4 h-4 opacity-80" />
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold">{totalSchools}</span>
            <span className="text-xs opacity-80">({totalGroups} grp)</span>
          </div>
          <p className="text-[10px] opacity-80 font-medium">Unités préscolaires</p>
        </div>

        {/* Students Card - Amber */}
        <div className="bg-amber-400 text-slate-900 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs opacity-90 font-semibold">
            <span>Total Élèves</span>
            <GraduationCap className="w-4 h-4 opacity-80" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold">{totalStudents}</span>
          </div>
          <p className="text-[10px] font-semibold opacity-90">♂ {totalBoys} Garçons / ♀ {totalGirls} Filles</p>
        </div>

        {/* Visits Realization Card - Rose */}
        <div
          onClick={() => onNavigateTab('visits')}
          className="bg-rose-500 text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:bg-rose-600 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs opacity-90 font-medium">
            <span>Visites Réalisées</span>
            <ClipboardCheck className="w-4 h-4 opacity-80" />
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold">{visitRealizationRate}%</span>
            <span className="text-xs opacity-80">({totalVisits} v.)</span>
          </div>
          <p className="text-[10px] opacity-80 font-medium">Taux de réalisation</p>
        </div>

        {/* Absences Card - Slate 800 */}
        <div
          onClick={() => onNavigateTab('absences')}
          className="bg-slate-800 text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:bg-slate-700 transition-colors flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-xs opacity-90 font-medium">
            <span>Absences Total</span>
            <UserX className="w-4 h-4 opacity-80 text-rose-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold">{totalAbsences} <span className="text-xs font-normal opacity-80">jours</span></span>
          </div>
          <p className="text-[10px] opacity-80 font-medium">Journées déclarées</p>
        </div>
      </div>

      {/* RECHARTS GRAPHS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: Evolution du nombre d'élèves */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Évolution du nombre d'élèves
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Historique Mensuel</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEvolution}>
                <defs>
                  <linearGradient id="colorEleves" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="eleves" name="Nombre d'élèves" stroke="#2563eb" fillOpacity={1} fill="url(#colorEleves)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Répartition Garçons / Filles */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" /> Répartition Garçons / Filles
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Parité Préscolaire</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genderDistribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Absences par mois */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-500" /> Absences Enseignants par Mois
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Jours Cumulés</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={absencesByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Jours d'absence" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: Visites par enseignant */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-600" /> Visites Réalisées par Enseignant
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Couverture Terrain</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitsPerTeacher}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="visites" name="Visites" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 5: Nombre de groupes par école */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <SchoolIcon className="w-4 h-4 text-indigo-600" /> Structure du Réseau : Groupes & Élèves par École
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Répartition Écoles</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupsPerSchool}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="groupes" name="Nombre de groupes" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="eleves" name="Nombre d'élèves" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
