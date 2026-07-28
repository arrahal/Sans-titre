import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Printer,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  X,
  FileSpreadsheet,
  FileText,
  Award,
  Star
} from 'lucide-react';
import { Teacher, School } from '../types';
import { exportToExcel, parseExcelFile } from '../utils/excelExport';
import { generatePdfReport } from '../utils/pdfExport';
import { TeacherEvaluationModal } from '../components/TeacherEvaluationModal';

interface TeachersViewProps {
  teachers: Teacher[];
  schools: School[];
  onCreateTeacher: (teacher: Partial<Teacher>) => Promise<void>;
  onUpdateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  onDeleteTeacher: (id: string) => Promise<void>;
}

export const TeachersView: React.FC<TeachersViewProps> = ({
  teachers,
  schools,
  onCreateTeacher,
  onUpdateTeacher,
  onDeleteTeacher
}) => {
  const [search, setSearch] = useState('');
  const [filterSchool, setFilterSchool] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [evaluatingTeacher, setEvaluatingTeacher] = useState<Teacher | null>(null);

  const handleSaveEvaluation = async (teacherId: string, score: number) => {
    await onUpdateTeacher(teacherId, {
      progressionLevel: score,
      lastVisitDate: new Date().toISOString().split('T')[0]
    });
  };

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [commune, setCommune] = useState('');
  const [boys, setBoys] = useState(10);
  const [girls, setGirls] = useState(10);
  const [assignmentDate, setAssignmentDate] = useState('');
  const [status, setStatus] = useState<'actif' | 'inactif' | 'en_formation'>('actif');
  const [photoUrl, setPhotoUrl] = useState('');

  const openCreateModal = () => {
    setEditingTeacher(null);
    setName('');
    setPhone('');
    setEmail('');
    setSchoolId(schools[0]?.id || '');
    setCommune(schools[0]?.commune || 'Asni');
    setBoys(10);
    setGirls(10);
    setAssignmentDate(new Date().toISOString().split('T')[0]);
    setStatus('actif');
    setPhotoUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
    setShowModal(true);
  };

  const openEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setPhone(t.phone);
    setEmail(t.email);
    setSchoolId(t.schoolId);
    setCommune(t.commune);
    setBoys(t.boys);
    setGirls(t.girls);
    setAssignmentDate(t.assignmentDate);
    setStatus(t.status);
    setPhotoUrl(t.photoUrl || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSchool = schools.find(s => s.id === schoolId);
    const payload: Partial<Teacher> = {
      name,
      phone,
      email,
      schoolId,
      schoolName: selectedSchool?.name || 'École Zakoura',
      commune: commune || selectedSchool?.commune || 'Centre',
      boys: Number(boys),
      girls: Number(girls),
      studentCount: Number(boys) + Number(girls),
      assignmentDate,
      status,
      photoUrl
    };

    if (editingTeacher) {
      await onUpdateTeacher(editingTeacher.id, payload);
    } else {
      await onCreateTeacher(payload);
    }
    setShowModal(false);
  };

  // Filter & Search Logic
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                          t.commune.toLowerCase().includes(search.toLowerCase()) ||
                          t.schoolName.toLowerCase().includes(search.toLowerCase());
    const matchesSchool = !filterSchool || t.schoolId === filterSchool;
    const matchesStatus = !filterStatus || t.status === filterStatus;
    return matchesSearch && matchesSchool && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Excel Import
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseExcelFile(file);
      for (const r of rows) {
        if (r.Nom || r.name) {
          await onCreateTeacher({
            name: r.Nom || r.name,
            phone: r.Téléphone || r.phone || '+212 6 00 00 00 00',
            email: r.Email || r.email || 'enseignant@zakoura.ma',
            commune: r.Commune || r.commune || 'Asni',
            boys: Number(r.Garçons || 10),
            girls: Number(r.Filles || 10),
            status: 'actif'
          });
        }
      }
      alert('Importation Excel réussie !');
    } catch (err) {
      alert('Erreur lors de l\'importation de l\'Excel.');
    }
  };

  const handleExcelExport = () => {
    const exportData = filteredTeachers.map(t => ({
      ID: t.id,
      Nom: t.name,
      Téléphone: t.phone,
      Email: t.email,
      École: t.schoolName,
      Commune: t.commune,
      'Nb Groupes': t.groupCount,
      'Élèves Total': t.studentCount,
      Garçons: t.boys,
      Filles: t.girls,
      'Date Affectation': t.assignmentDate,
      Statut: t.status,
      Visites: t.visitCount,
      Absences: t.absenceCount,
      'Progression (%)': t.progressionLevel
    }));
    exportToExcel(exportData, 'Liste_Enseignants_Zakoura');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Gestion des Enseignants & Éducateurs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Recherche, suivi des visites, présence et progression du corps professoral
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Excel Import */}
          <label className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
            <Upload className="w-4 h-4 text-emerald-600" /> Import Excel
            <input type="file" accept=".xlsx, .xls" onChange={handleExcelImport} className="hidden" />
          </label>

          {/* Excel Export */}
          <button
            onClick={handleExcelExport}
            className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>

          {/* Add Teacher Button */}
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Ajouter un Enseignant
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche instantanée par nom, école ou commune..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterSchool}
            onChange={(e) => setFilterSchool(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 rounded-xl focus:outline-none"
          >
            <option value="">Toutes les écoles</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 rounded-xl focus:outline-none"
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="en_formation">En formation</option>
          </select>
        </div>
      </div>

      {/* TEACHERS GRID / TABLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
          >
            <div>
              {/* Card Header Info */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                    alt={teacher.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {teacher.name}
                    </h3>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                      {teacher.schoolName}
                    </p>
                    <p className="text-[10px] text-slate-400">Commune : {teacher.commune}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    teacher.status === 'actif'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : teacher.status === 'en_formation'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {teacher.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{teacher.email}</span>
                </div>
              </div>

              {/* Indicators: Visites, Absences, Progression */}
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block">Visites</span>
                  <span className="text-base font-extrabold text-blue-900 dark:text-blue-200">{teacher.visitCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50">
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block">Absences</span>
                  <span className="text-base font-extrabold text-rose-900 dark:text-rose-200">{teacher.absenceCount} j</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">Progression</span>
                  <span className="text-base font-extrabold text-emerald-900 dark:text-emerald-200">{teacher.progressionLevel}%</span>
                </div>
              </div>

              {/* Progression Progress Bar */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Dernière visite: {teacher.lastVisitDate || 'Aucune'}</span>
                  <span>{teacher.studentCount} Élèves ({teacher.boys}G / {teacher.girls}F)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${teacher.progressionLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setEvaluatingTeacher(teacher)}
                className="px-2.5 py-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 dark:text-amber-300 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-amber-500" /> Évaluer (14 Critères)
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(teacher)}
                  className="px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Modifier
                </button>
                <button
                  onClick={() => onDeleteTeacher(teacher.id)}
                  className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Page {currentPage} sur {totalPages} ({filteredTeachers.length} enseignants)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT TEACHER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingTeacher ? 'Modifier Enseignant' : 'Ajouter un Enseignant Zakoura'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Fatima-Zahra BENALI"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+212 6..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@zakoura.ma"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">École d'affectation</label>
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Commune</label>
                  <input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder="Asni / Ourika"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Garçons</label>
                  <input
                    type="number"
                    value={boys}
                    onChange={(e) => setBoys(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Filles</label>
                  <input
                    type="number"
                    value={girls}
                    onChange={(e) => setGirls(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date d'affectation</label>
                  <input
                    type="date"
                    value={assignmentDate}
                    onChange={(e) => setAssignmentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Statut</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="actif">Actif</option>
                    <option value="en_formation">En formation</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Photo (Optionnelle)</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
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
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 14 CRITERIA EVALUATION MODAL */}
      {evaluatingTeacher && (
        <TeacherEvaluationModal
          teacher={evaluatingTeacher}
          onClose={() => setEvaluatingTeacher(null)}
          onSaveEvaluation={handleSaveEvaluation}
        />
      )}
    </div>
  );
};
