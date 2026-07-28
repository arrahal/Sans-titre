import React, { useState } from 'react';
import {
  UserX,
  Plus,
  Search,
  Calendar,
  FileCheck,
  FileX,
  FileText,
  Paperclip,
  Trash2,
  X,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { Absence, Teacher, School } from '../types';
import { exportToExcel } from '../utils/excelExport';

interface AbsencesViewProps {
  absences: Absence[];
  teachers: Teacher[];
  schools: School[];
  onCreateAbsence: (absence: Partial<Absence>) => Promise<void>;
  onDeleteAbsence: (id: string) => Promise<void>;
}

export const AbsencesView: React.FC<AbsencesViewProps> = ({
  absences,
  teachers,
  schools,
  onCreateAbsence,
  onDeleteAbsence
}) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [teacherId, setTeacherId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayCount, setDayCount] = useState(1);
  const [reason, setReason] = useState('Raisons de santé / Certificat médical');
  const [justified, setJustified] = useState(true);
  const [documentUrl, setDocumentUrl] = useState('');

  const openCreateModal = () => {
    setTeacherId(teachers[0]?.id || '');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setDayCount(1);
    setReason('Maladie / Certificat médical');
    setJustified(true);
    setDocumentUrl('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selTeacher = teachers.find(t => t.id === teacherId);
    const selSchool = schools.find(s => s.id === selTeacher?.schoolId);

    await onCreateAbsence({
      teacherId,
      teacherName: selTeacher?.name || 'Enseignant',
      schoolId: selTeacher?.schoolId || schools[0]?.id || '',
      schoolName: selTeacher?.schoolName || 'École Zakoura',
      startDate,
      endDate,
      dayCount: Number(dayCount),
      reason,
      justified,
      documentUrl
    });

    setShowModal(false);
  };

  const filteredAbsences = absences.filter(a =>
    a.teacherName.toLowerCase().includes(search.toLowerCase()) ||
    a.schoolName.toLowerCase().includes(search.toLowerCase()) ||
    a.reason.toLowerCase().includes(search.toLowerCase())
  );

  const totalAbsenceDays = absences.reduce((sum, a) => sum + (a.dayCount || a.absenceCount || 1), 0);
  const justifiedCount = absences.filter(a => a.justified).length;
  const unjustifiedCount = absences.filter(a => !a.justified).length;

  const handleExportExcel = () => {
    const data = filteredAbsences.map(a => ({
      ID: a.id,
      Enseignant: a.teacherName,
      École: a.schoolName,
      'Date Début': a.startDate,
      'Date Fin': a.endDate,
      'Nombre de Jours': a.dayCount,
      Motif: a.reason,
      'Statut Justificatif': a.justified ? 'Justifiée' : 'Non justifiée'
    }));
    exportToExcel(data, 'Registre_Absences_Zakoura');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserX className="w-6 h-6 text-rose-600" /> Suivi de Présence & Registre d'Absences
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des autorisations, justifications médicales et régularité des éducateurs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Déclarer une Absence
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs opacity-90 block">Cumul Jours d'Absence</span>
            <span className="text-2xl font-extrabold">{totalAbsenceDays} Jours</span>
          </div>
          <AlertTriangle className="w-8 h-8 opacity-40" />
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs opacity-90 block">Absences Justifiées</span>
            <span className="text-2xl font-extrabold">{justifiedCount}</span>
          </div>
          <FileCheck className="w-8 h-8 opacity-40" />
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs opacity-90 block">Absences Non Justifiées</span>
            <span className="text-2xl font-extrabold">{unjustifiedCount}</span>
          </div>
          <FileX className="w-8 h-8 opacity-40" />
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par enseignant, école ou motif d'absence..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* ABSENCES TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Enseignant(e)</th>
                <th className="p-4">École</th>
                <th className="p-4">Période</th>
                <th className="p-4 text-center">Jours</th>
                <th className="p-4">Motif</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAbsences.map(absence => (
                <tr key={absence.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {absence.teacherName}
                  </td>
                  <td className="p-4 text-blue-600 dark:text-blue-400 font-medium">
                    {absence.schoolName}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {absence.startDate} au {absence.endDate}
                  </td>
                  <td className="p-4 text-center font-extrabold text-slate-900 dark:text-white">
                    {absence.dayCount || absence.absenceCount || 1} j
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {absence.reason}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full inline-flex items-center gap-1 ${
                        absence.justified
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {absence.justified ? <FileCheck className="w-3 h-3" /> : <FileX className="w-3 h-3" />}
                      {absence.justified ? 'Justifiée' : 'Non justifiée'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onDeleteAbsence(absence.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DECLARE ABSENCE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Déclarer une Absence d'Enseignant
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enseignant(e)</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.schoolName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date début</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date fin</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Jours</label>
                  <input
                    type="number"
                    value={dayCount}
                    onChange={(e) => setDayCount(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Motif de l'absence</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="ex: Raisons de santé / Congé maladie"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="justifiedCheck"
                  checked={justified}
                  onChange={(e) => setJustified(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="justifiedCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Absence dûment justifiée avec document médical ou administratif
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Enregistrer l'Absence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
