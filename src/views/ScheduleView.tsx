import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  User,
  School as SchoolIcon,
  Trash2,
  Edit2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ScheduleEvent, School, Teacher, Group } from '../types';

interface ScheduleViewProps {
  scheduleEvents: ScheduleEvent[];
  schools: School[];
  teachers: Teacher[];
  groups: Group[];
  onCreateEvent: (event: Partial<ScheduleEvent>) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'] as const;
const TIME_SLOTS = ['08:30 - 10:00', '10:15 - 11:45', '13:30 - 15:00', '15:15 - 16:45'];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  scheduleEvents,
  schools,
  teachers,
  groups,
  onCreateEvent,
  onDeleteEvent
}) => {
  const [viewMode, setViewMode] = useState<'jour' | 'semaine' | 'mois'>('semaine');
  const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>('Lundi');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [day, setDay] = useState<typeof DAYS[number]>('Lundi');
  const [timeSlot, setTimeSlot] = useState('08:30 - 11:30');
  const [schoolId, setSchoolId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [type, setType] = useState<'visite_pedagogique' | 'cours' | 'reunion' | 'formation'>('visite_pedagogique');

  const openCreateModal = () => {
    setTitle('Visite de Supervision');
    setDay('Lundi');
    setTimeSlot('08:30 - 11:30');
    setSchoolId(schools[0]?.id || '');
    setTeacherId(teachers[0]?.id || '');
    setGroupId(groups[0]?.id || '');
    setType('visite_pedagogique');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selSchool = schools.find(s => s.id === schoolId);
    const selTeacher = teachers.find(t => t.id === teacherId);
    const selGroup = groups.find(g => g.id === groupId);

    let color = '#0284c7';
    if (type === 'cours') color = '#16a34a';
    if (type === 'reunion') color = '#9333ea';
    if (type === 'formation') color = '#ea580c';

    await onCreateEvent({
      title,
      day,
      timeSlot,
      schoolId,
      schoolName: selSchool?.name || 'École Zakoura',
      teacherId,
      teacherName: selTeacher?.name || 'Enseignant',
      groupId,
      groupName: selGroup?.name || 'Groupe',
      room: selGroup?.room || 'Salle 1',
      type,
      color
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" /> Emploi du Temps & Planning Pédagogique
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Programmation des visites terrain, cours préscolaires et regroupements pédagogiques
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('jour')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'jour'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setViewMode('semaine')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'semaine'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('mois')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'mois'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mois
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Planifier
          </button>
        </div>
      </div>

      {/* Day selector for 'jour' view */}
      {viewMode === 'jour' && (
        <div className="flex items-center justify-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          {DAYS.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDay === d
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* WEEKLY TIMETABLE GRID */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        {viewMode === 'semaine' ? (
          <div className="min-w-[700px] grid grid-cols-6 divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800">
            {DAYS.map(d => {
              const dayEvents = scheduleEvents.filter(e => e.day === d);
              return (
                <div key={d} className="flex flex-col min-h-[450px]">
                  {/* Day Header */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">{d}</span>
                    <span className="text-[10px] text-slate-400">{dayEvents.length} activité(s)</span>
                  </div>

                  {/* Day Slots */}
                  <div className="p-2 space-y-2 flex-1 bg-slate-50/20 dark:bg-slate-950/20">
                    {dayEvents.length === 0 ? (
                      <div className="text-[11px] text-slate-400 text-center py-8 italic">Aucune séance</div>
                    ) : (
                      dayEvents.map(event => (
                        <div
                          key={event.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-sm hover:shadow transition-shadow relative group"
                          style={{ borderLeftWidth: '4px', borderLeftColor: event.color || '#0284c7' }}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {event.timeSlot}
                            </span>
                            <button
                              onClick={() => onDeleteEvent(event.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-50 rounded transition-opacity"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                            {event.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                            {event.teacherName}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {event.schoolName}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : viewMode === 'jour' ? (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-2">
              Planning du {selectedDay}
            </h3>
            {scheduleEvents.filter(e => e.day === selectedDay).length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">Aucun événement planifié pour ce jour</div>
            ) : (
              scheduleEvents.filter(e => e.day === selectedDay).map(ev => (
                <div key={ev.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {ev.timeSlot}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{ev.title}</h4>
                    <p className="text-xs text-slate-500">{ev.teacherName} • {ev.schoolName}</p>
                  </div>
                  <button onClick={() => onDeleteEvent(ev.id)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            Aperçu mensuel : {scheduleEvents.length} activités globales planifiées pour le mois en cours.
          </div>
        )}
      </div>

      {/* CREATE EVENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ajouter une Séance au Planning
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Intitulé de l'activité</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Visite de supervision pédagogique"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Jour</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {DAYS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Créneau horaire</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="08:30 - 11:30"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Type d'activité</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="visite_pedagogique">Visite de supervision</option>
                    <option value="cours">Cours préscolaire</option>
                    <option value="reunion">Réunion pédagogique</option>
                    <option value="formation">Formation continue</option>
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enseignant</label>
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Groupe</label>
                  <select
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
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
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Ajouter au Planning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
