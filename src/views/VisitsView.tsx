import React, { useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  School as SchoolIcon,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  FileSpreadsheet,
  X,
  Trash2,
  Check
} from 'lucide-react';
import { Visit, Teacher, School, Group } from '../types';
import { DigitalSignaturePad } from '../components/DigitalSignaturePad';
import { exportToExcel } from '../utils/excelExport';

interface VisitsViewProps {
  visits: Visit[];
  teachers: Teacher[];
  schools: School[];
  groups: Group[];
  onCreateVisit: (visit: Partial<Visit>) => Promise<void>;
  onDeleteVisit: (id: string) => Promise<void>;
}

export const VisitsView: React.FC<VisitsViewProps> = ({
  visits,
  teachers,
  schools,
  groups,
  onCreateVisit,
  onDeleteVisit
}) => {
  const [search, setSearch] = useState('');
  const [activeView, setActiveView] = useState<'timeline' | 'grid'>('timeline');
  const [showModal, setShowModal] = useState(false);
  const [selectedVisitDetail, setSelectedVisitDetail] = useState<Visit | null>(null);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [teacherId, setTeacherId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [objective, setObjective] = useState('');
  const [observations, setObservations] = useState('');
  const [strengthsText, setStrengthsText] = useState('');
  const [improvementsText, setImprovementsText] = useState('');
  const [actionsText, setActionsText] = useState('');
  const [signatureDataUrl, setSignatureDataUrl] = useState('');

  const openCreateModal = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setTeacherId(teachers[0]?.id || '');
    setSchoolId(schools[0]?.id || '');
    setGroupId(groups[0]?.id || '');
    setStartTime('09:00');
    setEndTime('11:00');
    setDurationMinutes(120);
    setObjective('Évaluation des pratiques de gestion de classe et ateliers de pré-lecture');
    setObservations('Séance bien structurée avec une bonne participation des élèves.');
    setStrengthsText('Gestion bienveillante du groupe;Matériel pédagogique bien disposé;Excellente dynamique');
    setImprovementsText('Transitions entre ateliers à fluidifier;Susciter davantage la parole spontanée');
    setActionsText('Appliquer le rituel de comptine de transition;Varier la difficulté des fiches graphiques');
    setSignatureDataUrl('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selTeacher = teachers.find(t => t.id === teacherId);
    const selSchool = schools.find(s => s.id === schoolId);
    const selGroup = groups.find(g => g.id === groupId);

    const strengths = strengthsText.split(';').map(s => s.trim()).filter(Boolean);
    const improvementPoints = improvementsText.split(';').map(s => s.trim()).filter(Boolean);
    const recommendedActions = actionsText.split(';').map(s => s.trim()).filter(Boolean);

    await onCreateVisit({
      date,
      teacherId,
      teacherName: selTeacher?.name || 'Enseignant',
      schoolId,
      schoolName: selSchool?.name || 'École Zakoura',
      groupId,
      groupName: selGroup?.name || 'Groupe',
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes),
      objective,
      observations,
      strengths,
      improvementPoints,
      recommendedActions,
      signatureDataUrl,
      status: 'réalisée'
    });

    setShowModal(false);
  };

  const filteredVisits = visits.filter(v =>
    v.teacherName.toLowerCase().includes(search.toLowerCase()) ||
    v.schoolName.toLowerCase().includes(search.toLowerCase()) ||
    v.objective.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportExcel = () => {
    const data = filteredVisits.map(v => ({
      ID: v.id,
      Date: v.date,
      Enseignant: v.teacherName,
      École: v.schoolName,
      Groupe: v.groupName,
      Durée: `${v.durationMinutes} min`,
      Objectif: v.objective,
      Observations: v.observations,
      'Points Forts': v.strengths.join(', '),
      'Points à Améliorer': v.improvementPoints.join(', '),
      Actions: v.recommendedActions.join(', '),
      Statut: v.status
    }));
    exportToExcel(data, 'Visites_Supervision_Zakoura');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-600" /> Visites de Supervision Pédagogique
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consignation des comptes-rendus de visite, observations, signatures numériques et plans d'action
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle View Mode */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveView('timeline')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeView === 'timeline'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveView('grid')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeView === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cartes
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Consigner une Visite
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
            placeholder="Rechercher par enseignant, école ou objectif de visite..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* TIMELINE VIEW */}
      {activeView === 'timeline' ? (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {filteredVisits.map((visit) => (
            <div key={visit.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-6 top-4 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-md" />

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{visit.teacherName}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                        {visit.status}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{visit.schoolName} ({visit.groupName})</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {visit.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {visit.startTime} - {visit.endTime} ({visit.durationMinutes} min)</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Objectif : </span>
                    <span className="text-slate-600 dark:text-slate-400">{visit.objective}</span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Observations : </span>
                    <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl mt-1 leading-relaxed">{visit.observations}</p>
                  </div>

                  {/* Strengths, Improvements, Actions Chips */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                      <h5 className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Points Forts
                      </h5>
                      <ul className="list-disc list-inside text-[11px] text-emerald-900 dark:text-emerald-200 space-y-0.5">
                        {visit.strengths.map((st, i) => <li key={i}>{st}</li>)}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                      <h5 className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Points à Améliorer
                      </h5>
                      <ul className="list-disc list-inside text-[11px] text-amber-900 dark:text-amber-200 space-y-0.5">
                        {visit.improvementPoints.map((imp, i) => <li key={i}>{imp}</li>)}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                      <h5 className="text-[11px] font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-blue-600" /> Actions Recommandées
                      </h5>
                      <ul className="list-disc list-inside text-[11px] text-blue-900 dark:text-blue-200 space-y-0.5">
                        {visit.recommendedActions.map((act, i) => <li key={i}>{act}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Digital Signature Footer */}
                  {visit.signatureDataUrl && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">Signature numérique du viseur:</span>
                        <img src={visit.signatureDataUrl} alt="Signature" className="h-8 object-contain border bg-white rounded p-0.5" />
                      </div>
                      <button
                        onClick={() => onDeleteVisit(visit.id)}
                        className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVisits.map(v => (
            <div key={v.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{v.teacherName}</h4>
                  <p className="text-xs text-blue-600">{v.schoolName}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">{v.date}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{v.objective}</p>
              <div className="pt-2 border-t flex justify-between items-center">
                <span className="text-[10px] text-emerald-600 font-bold">{v.status}</span>
                <button onClick={() => onDeleteVisit(v.id)} className="text-rose-500 text-xs flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE VISIT MODAL WITH DIGITAL SIGNATURE */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-600" /> Saisie Fiche de Visite Pédagogique
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Heure début</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:00"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Heure fin</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="11:00"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Durée (min)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enseignant(e)</label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">École</label>
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Groupe</label>
                  <select
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Objectif de la visite</label>
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  required
                  placeholder="ex: Évaluation de l'animation des coins de jeu et pré-mathématiques"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Observations générales</label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Points forts (Séparés par point-virgule ;)</label>
                <input
                  type="text"
                  value={strengthsText}
                  onChange={(e) => setStrengthsText(e.target.value)}
                  placeholder="Atmosphère calme;Excellents rituels;Supports Zakoura utilisés"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Points à améliorer (Séparés par ;)</label>
                <input
                  type="text"
                  value={improvementsText}
                  onChange={(e) => setImprovementsText(e.target.value)}
                  placeholder="Gestion du bruit pendant les transitions;Animer davantage les histoires"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Actions recommandées (Séparés par ;)</label>
                <input
                  type="text"
                  value={actionsText}
                  onChange={(e) => setActionsText(e.target.value)}
                  placeholder="Introduire des marottes pour les contes;Varier le rythme des ateliers"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Digital Signature Pad */}
              <DigitalSignaturePad onSave={(dataUrl) => setSignatureDataUrl(dataUrl)} />

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
                  Valider et Enregistrer la Visite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
