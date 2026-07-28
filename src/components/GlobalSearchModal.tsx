import React, { useState, useEffect } from 'react';
import { Search, X, Users, School as SchoolIcon, Layers, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Teacher, School, Group, Visit, ActiveTab } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  schools: School[];
  groups: Group[];
  visits: Visit[];
  onNavigateTab: (tab: ActiveTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  teachers,
  schools,
  groups,
  visits,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredTeachers = q ? teachers.filter(t => t.name.toLowerCase().includes(q) || t.commune.toLowerCase().includes(q) || t.schoolName.toLowerCase().includes(q)) : [];
  const filteredSchools = q ? schools.filter(s => s.name.toLowerCase().includes(q) || s.commune.toLowerCase().includes(q) || s.douar.toLowerCase().includes(q)) : [];
  const filteredGroups = q ? groups.filter(g => g.name.toLowerCase().includes(q) || g.level.toLowerCase().includes(q) || g.teacherName.toLowerCase().includes(q)) : [];
  const filteredVisits = q ? visits.filter(v => v.teacherName.toLowerCase().includes(q) || v.objective.toLowerCase().includes(q) || v.schoolName.toLowerCase().includes(q)) : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom d'enseignant, école, commune, visite..."
            autoFocus
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {!query && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Saisissez un mot-clé pour lancer la recherche globale sur la Fondation Zakoura
            </div>
          )}

          {/* Teachers Section */}
          {filteredTeachers.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Enseignants ({filteredTeachers.length})
              </h4>
              <div className="space-y-1">
                {filteredTeachers.slice(0, 4).map(t => (
                  <button
                    key={t.id}
                    onClick={() => { onNavigateTab('teachers'); onClose(); }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-[11px] text-slate-500">{t.schoolName} • Commune {t.commune}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Schools Section */}
          {filteredSchools.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <SchoolIcon className="w-3.5 h-3.5 text-emerald-500" /> Écoles ({filteredSchools.length})
              </h4>
              <div className="space-y-1">
                {filteredSchools.slice(0, 4).map(s => (
                  <button
                    key={s.id}
                    onClick={() => { onNavigateTab('schools'); onClose(); }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{s.name}</p>
                      <p className="text-[11px] text-slate-500">Commune: {s.commune} | Douar: {s.douar} | {s.studentCount} élèves</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Groups Section */}
          {filteredGroups.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Groupes ({filteredGroups.length})
              </h4>
              <div className="space-y-1">
                {filteredGroups.slice(0, 4).map(g => (
                  <button
                    key={g.id}
                    onClick={() => { onNavigateTab('groups'); onClose(); }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{g.name} ({g.level})</p>
                      <p className="text-[11px] text-slate-500">Enseignant: {g.teacherName} | {g.schoolName}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Visits Section */}
          {filteredVisits.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ClipboardCheck className="w-3.5 h-3.5 text-amber-500" /> Visites ({filteredVisits.length})
              </h4>
              <div className="space-y-1">
                {filteredVisits.slice(0, 4).map(v => (
                  <button
                    key={v.id}
                    onClick={() => { onNavigateTab('visits'); onClose(); }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">Visite pour {v.teacherName} - {v.date}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{v.objective}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredTeachers.length === 0 && filteredSchools.length === 0 && filteredGroups.length === 0 && filteredVisits.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Aucun résultat trouvé pour "{query}".
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Appuyez sur <kbd className="font-mono bg-white dark:bg-slate-900 border px-1 rounded">Échap</kbd> pour fermer</span>
          <span>Fondation Zakoura - Recherche Global</span>
        </div>
      </div>
    </div>
  );
};
