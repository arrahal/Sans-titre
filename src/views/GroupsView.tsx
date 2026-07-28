import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  School as SchoolIcon,
  User,
  Clock,
  Home,
  GraduationCap,
  Edit2,
  Trash2,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Group, School, Teacher } from '../types';
import { exportToExcel } from '../utils/excelExport';

interface GroupsViewProps {
  groups: Group[];
  schools: School[];
  teachers: Teacher[];
  onCreateGroup: (group: Partial<Group>) => Promise<void>;
  onUpdateGroup: (id: string, group: Partial<Group>) => Promise<void>;
  onDeleteGroup: (id: string) => Promise<void>;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  schools,
  teachers,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup
}) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Grande Section (5-6 ans)');
  const [teacherId, setTeacherId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [boys, setBoys] = useState(10);
  const [girls, setGirls] = useState(10);
  const [schedule, setSchedule] = useState('Lun - Ven: 08:30 - 11:30');
  const [room, setRoom] = useState('Salle A1');

  const openCreateModal = () => {
    setEditingGroup(null);
    setName('');
    setLevel('Grande Section (5-6 ans)');
    setTeacherId(teachers[0]?.id || '');
    setSchoolId(schools[0]?.id || '');
    setBoys(10);
    setGirls(10);
    setSchedule('Lun - Ven: 08:30 - 11:30');
    setRoom('Salle A1');
    setShowModal(true);
  };

  const openEditModal = (g: Group) => {
    setEditingGroup(g);
    setName(g.name);
    setLevel(g.level);
    setTeacherId(g.teacherId);
    setSchoolId(g.schoolId);
    setBoys(g.boys);
    setGirls(g.girls);
    setSchedule(g.schedule);
    setRoom(g.room);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selTeacher = teachers.find(t => t.id === teacherId);
    const selSchool = schools.find(s => s.id === schoolId);

    const payload: Partial<Group> = {
      name,
      level,
      teacherId,
      teacherName: selTeacher?.name || 'Enseignant',
      schoolId,
      schoolName: selSchool?.name || 'École Zakoura',
      boys: Number(boys),
      girls: Number(girls),
      studentCount: Number(boys) + Number(girls),
      schedule,
      room
    };

    if (editingGroup) {
      await onUpdateGroup(editingGroup.id, payload);
    } else {
      await onCreateGroup(payload);
    }
    setShowModal(false);
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.level.toLowerCase().includes(search.toLowerCase()) ||
    g.teacherName.toLowerCase().includes(search.toLowerCase()) ||
    g.schoolName.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportExcel = () => {
    const data = filteredGroups.map(g => ({
      ID: g.id,
      Nom: g.name,
      Niveau: g.level,
      Enseignant: g.teacherName,
      École: g.schoolName,
      'Total Élèves': g.studentCount,
      Garçons: g.boys,
      Filles: g.girls,
      Horaire: g.schedule,
      Salle: g.room
    }));
    exportToExcel(data, 'Groupes_Préscolaires_Zakoura');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" /> Groupes & Sections de Classe
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des niveaux (PS, MS, GS, CP), salles d'apprentissage et enseignants référents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Créer un Groupe
          </button>
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
            placeholder="Rechercher par groupe, niveau, enseignant ou école..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* GROUPS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {group.name}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded-full mt-1 inline-block">
                    {group.level}
                  </span>
                </div>
                <div className="text-right bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 block">{group.studentCount}</span>
                  <span className="text-[10px] text-slate-400">Élèves</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-800/40 p-3 rounded-xl mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>Enseignant : <strong className="text-slate-800 dark:text-slate-200">{group.teacherName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <SchoolIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="truncate">École : {group.schoolName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Horaire : {group.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-purple-500" />
                  <span>Salle : {group.room}</span>
                </div>
              </div>

              {/* Boys / Girls Split */}
              <div className="flex items-center justify-between text-xs p-2 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl mb-2">
                <span className="text-slate-500 font-medium">Répartition :</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  <span className="text-blue-600">{group.boys} Garçons</span> • <span className="text-pink-600">{group.girls} Filles</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => openEditModal(group)}
                className="px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Modifier
              </button>
              <button
                onClick={() => onDeleteGroup(group.id)}
                className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingGroup ? 'Modifier le Groupe' : 'Créer un Groupe Zakoura'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom du groupe</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Groupe Grande Section Asni"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Niveau pédagogique</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Petite Section (3-4 ans)">Petite Section (3-4 ans)</option>
                  <option value="Moyenne Section (4-5 ans)">Moyenne Section (4-5 ans)</option>
                  <option value="Grande Section (5-6 ans)">Grande Section (5-6 ans)</option>
                  <option value="Multi-Niveaux PS/MS">Multi-Niveaux PS/MS</option>
                  <option value="CP Préparatoire">CP Préparatoire</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enseignant référent</label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">École</label>
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Horaire</label>
                  <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="Lun - Ven: 08:30 - 11:30"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Salle</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Salle Polyvalente 1"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
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
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
