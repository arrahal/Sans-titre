import React, { useState } from 'react';
import { Star, X, Award, CheckCircle, FileText } from 'lucide-react';
import { Teacher } from '../types';

interface TeacherEvaluationModalProps {
  teacher: Teacher;
  onClose: () => void;
  onSaveEvaluation: (teacherId: string, score: number, criteriaScores: Record<number, number>) => void;
}

export const EVALUATION_CRITERIA = [
  { id: 0, fr: 'Tenue générale & Présentation', ar: 'المظهر العام والنظافة الشخصية' },
  { id: 1, fr: 'Hygiène & Propreté de la classe', ar: 'نظافة القاعة والترتيب' },
  { id: 2, fr: 'Discipline & Respect du règlement', ar: 'الانضباط والالتزام' },
  { id: 3, fr: 'Ponctualité & Gestion du temps', ar: 'احترام الوقت والمواعيد' },
  { id: 4, fr: 'Préparation & Fiche pédagogique', ar: 'تحضير البطاقة الجذاذة البيداغوجية' },
  { id: 5, fr: 'Climat de classe & Bienveillance', ar: 'العلاقة الإيجابية مع الأطفال' },
  { id: 6, fr: 'Atteinte des objectifs de la séance', ar: 'تحقيق الأهداف المسطرة' },
  { id: 7, fr: 'Évaluation formative des apprenants', ar: 'التقييم التكويني والملاحظة' },
  { id: 8, fr: 'Créativité & Variété des ateliers', ar: 'الابتكار وتنويع الوسائل' },
  { id: 9, fr: 'Approche pédagogique Zakoura', ar: 'المقاربة البيداغوجية المعتمدة' },
  { id: 10, fr: 'Participation active des élèves', ar: 'مشاركة الأطفال والتفاعل' },
  { id: 11, fr: 'Gestion & Correction des erreurs', ar: 'معالجة وتصحيح الأخطاء' },
  { id: 12, fr: 'Réalisation des activités du programme', ar: 'إنجاز الأنشطة المبرمجة' },
  { id: 13, fr: 'Réinvestissement & Autonomie', ar: 'إعادة توظيف وترسيخ المكتسبات' },
];

export const TeacherEvaluationModal: React.FC<TeacherEvaluationModalProps> = ({
  teacher,
  onClose,
  onSaveEvaluation
}) => {
  const [scores, setScores] = useState<Record<number, number>>({
    0: 3, 1: 3, 2: 3, 3: 3, 4: 2, 5: 3, 6: 2, 7: 2, 8: 3, 9: 3, 10: 2, 11: 2, 12: 3, 13: 2
  });

  const handleSetStar = (index: number, val: number) => {
    setScores(prev => ({ ...prev, [index]: val }));
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = EVALUATION_CRITERIA.length * 3; // 42 max
  const percentage = Math.round((totalScore / maxScore) * 100);

  const handleSave = () => {
    onSaveEvaluation(teacher.id, percentage, scores);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Évaluation Pédagogique 14 Critères — تقييم الأداء
              </h3>
              <p className="text-xs text-slate-400">
                {teacher.name} ({teacher.schoolName})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Summary Badge Header */}
        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 border-b border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-900 dark:text-blue-200 block">
              Score Global de Qualité Pédagogique
            </span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {percentage}% <span className="text-xs font-normal text-slate-500">({totalScore} / {maxScore} pts)</span>
            </span>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              percentage >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
              percentage >= 60 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
              'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {percentage >= 80 ? 'Excellent (ممتاز)' : percentage >= 60 ? 'Satisfaisant (مرضٍ)' : 'Aide Requis (يحتاج مواكبة)'}
            </span>
          </div>
        </div>

        {/* Body Grid of 14 Criteria */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EVALUATION_CRITERIA.map((crit) => {
              const currentVal = scores[crit.id] || 0;
              return (
                <div
                  key={crit.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {crit.id + 1}. {crit.fr}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-arabic" dir="rtl">
                        {crit.ar}
                      </p>
                    </div>
                  </div>

                  {/* 4 Star Level Selector (0: Non acquis, 1: En cours, 2: Acquis, 3: Maîtrisé) */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleSetStar(crit.id, val)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentVal >= val && val > 0
                              ? 'bg-amber-400 text-slate-900 scale-105'
                              : currentVal === 0 && val === 0
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-slate-300'
                          }`}
                          title={`Niveau ${val}`}
                        >
                          <Star className={`w-3.5 h-3.5 ${currentVal >= val && val > 0 ? 'fill-slate-900' : ''}`} />
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      {currentVal}/3 pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            Formulaire de grille officielle Fondation Zakoura (INDH)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Enregistrer l'Évaluation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
