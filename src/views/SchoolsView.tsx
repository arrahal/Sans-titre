import React, { useState } from 'react';
import {
  School as SchoolIcon,
  Plus,
  Search,
  MapPin,
  Phone,
  Users,
  Layers,
  GraduationCap,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { School } from '../types';
import { exportToExcel } from '../utils/excelExport';

interface SchoolsViewProps {
  schools: School[];
  onCreateSchool: (school: Partial<School>) => Promise<void>;
  onUpdateSchool: (id: string, school: Partial<School>) => Promise<void>;
  onDeleteSchool: (id: string) => Promise<void>;
}

export const SchoolsView: React.FC<SchoolsViewProps> = ({
  schools,
  onCreateSchool,
  onUpdateSchool,
  onDeleteSchool
}) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [commune, setCommune] = useState('');
  const [douar, setDouar] = useState('');
  const [directionProvinciale, setDirectionProvinciale] = useState('Direction Provinciale d\'Al Haouz');
  const [phone, setPhone] = useState('');
  const [groupCount, setGroupCount] = useState(2);
  const [teacherCount, setTeacherCount] = useState(2);
  const [boys, setBoys] = useState(20);
  const [girls, setGirls] = useState(20);
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');

  const openCreateModal = () => {
    setEditingSchool(null);
    setName('');
    setCommune('Asni');
    setDouar('Douar Centre');
    setDirectionProvinciale('Direction Provinciale d\'Al Haouz');
    setPhone('+212 5 24 48 00 00');
    setGroupCount(2);
    setTeacherCount(2);
    setBoys(20);
    setGirls(20);
    setMapEmbedUrl('https://maps.google.com/maps?q=31.2501,-7.9823&z=14&output=embed');
    setShowModal(true);
  };

  const openEditModal = (s: School) => {
    setEditingSchool(s);
    setName(s.name);
    setCommune(s.commune);
    setDouar(s.douar);
    setDirectionProvinciale(s.directionProvinciale);
    setPhone(s.phone);
    setGroupCount(s.groupCount);
    setTeacherCount(s.teacherCount);
    setBoys(s.boys);
    setGirls(s.girls);
    setMapEmbedUrl(s.mapEmbedUrl || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<School> = {
      name,
      commune,
      douar,
      directionProvinciale,
      phone,
      groupCount: Number(groupCount),
      teacherCount: Number(teacherCount),
      boys: Number(boys),
      girls: Number(girls),
      studentCount: Number(boys) + Number(girls),
      mapEmbedUrl
    };

    if (editingSchool) {
      await onUpdateSchool(editingSchool.id, payload);
    } else {
      await onCreateSchool(payload);
    }
    setShowModal(false);
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.commune.toLowerCase().includes(search.toLowerCase()) ||
    s.douar.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportExcel = () => {
    const exportData = filteredSchools.map(s => ({
      ID: s.id,
      Nom: s.name,
      Commune: s.commune,
      Douar: s.douar,
      Direction: s.directionProvinciale,
      Téléphone: s.phone,
      'Groupes Total': s.groupCount,
      Enseignants: s.teacherCount,
      'Élèves Total': s.studentCount,
      Garçons: s.boys,
      Filles: s.girls
    }));
    exportToExcel(exportData, 'Ecoles_Préscolaires_Zakoura');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SchoolIcon className="w-6 h-6 text-emerald-600" /> Écoles & Unités Préscolaires Zakoura
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cartographie, effectifs et infrastructures éducatives du réseau rural
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Ajouter une École
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une école par nom, commune ou douar..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* SCHOOLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchools.map((school) => (
          <div
            key={school.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {school.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <MapPin className="w-3.5 h-3.5" /> Commune : {school.commune}
                    </span>
                    <span>•</span>
                    <span>Douar : {school.douar}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold text-slate-400 block">{school.directionProvinciale}</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 justify-end mt-1">
                    <Phone className="w-3 h-3" /> {school.phone}
                  </span>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl mb-4">
                <div>
                  <span className="text-[10px] text-slate-400 block">Groupes</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-blue-500" /> {school.groupCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Enseignants</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-500" /> {school.teacherCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Élèves</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-500" /> {school.studentCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Garçons/Filles</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {school.boys}G / {school.girls}F
                  </span>
                </div>
              </div>

              {/* Embedded Google Map Preview */}
              {school.mapEmbedUrl ? (
                <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                  <iframe
                    src={school.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title={`Google Map - ${school.name}`}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 shadow">
                    <MapPin className="w-3 h-3 text-rose-500" /> GPS Localisé
                  </div>
                </div>
              ) : (
                <div className="h-24 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400">
                  <MapPin className="w-4 h-4 mr-1 text-slate-400" /> Pas de lien Google Maps
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(school.name + ' ' + school.commune)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline dark:text-blue-400 font-medium flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ouvrir dans Google Maps
              </a>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(school)}
                  className="px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Modifier
                </button>
                <button
                  onClick={() => onDeleteSchool(school.id)}
                  className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT SCHOOL MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingSchool ? 'Modifier l\'École' : 'Ajouter une École Zakoura'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom de l'école / unité</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: École Préscolaire Zakoura - Douar Asni"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Commune</label>
                  <input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder="Asni / Tahanaout"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Douar</label>
                  <input
                    type="text"
                    value={douar}
                    onChange={(e) => setDouar(e.target.value)}
                    placeholder="Douar Ait Ziad"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Direction Provinciale</label>
                  <input
                    type="text"
                    value={directionProvinciale}
                    onChange={(e) => setDirectionProvinciale(e.target.value)}
                    placeholder="DP Al Haouz"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+212 5..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Groupes</label>
                  <input
                    type="number"
                    value={groupCount}
                    onChange={(e) => setGroupCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enseignants</label>
                  <input
                    type="number"
                    value={teacherCount}
                    onChange={(e) => setTeacherCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Google Maps (Iframe Embed)</label>
                <input
                  type="text"
                  value={mapEmbedUrl}
                  onChange={(e) => setMapEmbedUrl(e.target.value)}
                  placeholder="https://maps.google.com/maps?q=..."
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
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
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
