// src/components/StageModal.tsx
import { useState, useEffect } from 'react';
import { X, BookOpen, Wrench, Sparkles, Loader2, PlayCircle, ExternalLink, Award } from 'lucide-react';
import type { Stage } from '../types';
import { fetchGeminiWithRetry } from '../services/gemini';

interface Props {
  stage: Stage;
  onClose: () => void;
}

export default function StageModal({ stage, onClose }: Props) {
  const [aiProjectIdea, setAiProjectIdea] = useState<string>("");
  const [isGeneratingProject, setIsGeneratingProject] = useState<boolean>(false);
  const [aiChallenge, setAiChallenge] = useState<string>("");
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState<boolean>(false);

  useEffect(() => {
    setAiProjectIdea("");
    setAiChallenge("");
  }, [stage]);

  const generateAiProject = async () => {
    setIsGeneratingProject(true);
    setAiProjectIdea("");
    const prompt = `أعطني فكرة مشروع واحدة مبتكرة لطلاب الجامعة لتطبيقها في مجال: "${stage.title}". اذكر القطع الرئيسية المطلوبة باختصار. تحدث بطريقة مشجعة. 3 أسطر كحد أقصى.`;
    const result = await fetchGeminiWithRetry(prompt);
    if (result) setAiProjectIdea(result);
    setIsGeneratingProject(false);
  };

  const generateAiChallenge = async () => {
    setIsGeneratingChallenge(true);
    setAiChallenge("");
    const prompt = `المستخدم يدرس حالياً مرحلة: "${stage.title}". قم بتوليد تحدي برمجي أو هندسي واحد قصير يختبر فهمه. لا تقدم الحل. قدم التحدي بالعربية بنبرة محفزة في سطرين.`;
    const result = await fetchGeminiWithRetry(prompt);
    if (result) setAiChallenge(result);
    setIsGeneratingChallenge(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      {/* تصغير العرض والارتفاع ليتناسب مع الجوال */}
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header - تقليل الحواف والخطوط للجوال */}
        <div className={`p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-bl from-slate-900 to-slate-800`}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${stage.bgColor} ${stage.color}`}>
              {stage.icon && <stage.icon className="w-6 h-6 sm:w-8 sm:h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs sm:text-sm font-bold text-slate-400">المرحلة {stage.id}</span>
                <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.difficultyColor}`}>
                  {stage.difficulty}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white leading-tight">{stage.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors shrink-0">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content - تقليل المسافات الداخلية */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 sm:space-y-8 custom-scrollbar relative flex-grow">
          
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /> نظرة عامة
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-3 sm:p-4 rounded-xl border border-slate-700/50">{stage.description}</p>
            {stage.hint && (
              <div className="mt-3 p-2.5 sm:p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg text-blue-300 text-xs sm:text-sm font-medium flex items-start gap-2">
                 <span className="block mt-0.5">{stage.hint}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
              <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> مصادر التعلم
            </h3>
            <div className="grid gap-2 sm:gap-3">
              {stage.resources.map((res: any, idx: number) => (
                <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-500 transition-all group gap-3">
                  <div className="flex items-start sm:items-center gap-2.5 overflow-hidden">
                    {/* إضافة shrink-0 لتمنع انضغاط الأيقونة في الجوال */}
                    {res.type === 'video' ? <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-slate-400 group-hover:text-red-400 mt-0.5 sm:mt-0" /> : <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-slate-400 group-hover:text-blue-400 mt-0.5 sm:mt-0" />}
                    {/* إضافة line-clamp للنصوص الطويلة جداً */}
                    <span className="text-slate-300 group-hover:text-white text-xs sm:text-sm font-medium line-clamp-2 sm:line-clamp-1">{res.title}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-slate-500 group-hover:text-white -rotate-90 rtl:rotate-180" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" /> المشاريع التطبيقية
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-slate-800/40 p-3 sm:p-4 rounded-xl border border-slate-700 text-slate-200 text-sm">
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 block mb-1.5 sm:mb-2">مشروع أساسي:</span>
                {stage.project}
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 sm:p-5 rounded-xl border border-blue-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2 sm:mb-3 relative z-10 gap-2">
                  <span className="text-xs sm:text-sm font-bold text-blue-300 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> فكرة AI</span>
                  {!aiProjectIdea && !isGeneratingProject && (
                    <button onClick={generateAiProject} className="text-[10px] sm:text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors shrink-0">ولد فكرة</button>
                  )}
                </div>
                <div className="relative z-10">
                  {isGeneratingProject ? (
                    <div className="flex flex-col items-center justify-center py-4 sm:py-6 gap-2 sm:gap-3 text-blue-400">
                      <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" /> 
                      <span className="text-xs sm:text-sm font-medium animate-pulse">روبو يجهز الفكرة... ⚡</span>
                    </div>
                  ) : aiProjectIdea ? (
                    <div className="text-slate-200 leading-relaxed text-xs sm:text-sm bg-slate-900/50 p-3 sm:p-4 rounded-lg border border-slate-700/50">{aiProjectIdea}</div>
                  ) : (
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">اضغط للحصول على فكرة مشروع.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border-t-2 border-slate-700 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 p-4 sm:p-6">
             <div className="bg-slate-800 rounded-xl border border-yellow-500/30 p-4 sm:p-5 relative overflow-hidden shadow-xl shadow-yellow-950/20">
                <div className="absolute inset-0 bg-yellow-500 rounded-2xl blur opacity-5"></div>
                <div className="flex items-center justify-between mb-2 sm:mb-3 relative z-10 gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-yellow-300 mb-0 flex items-center gap-1.5 sm:gap-2.5">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> تحدي برمجي 🎯
                  </h3>
                  {!aiChallenge && !isGeneratingChallenge && (
                    <button onClick={generateAiChallenge} className="text-[10px] sm:text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors font-bold shrink-0">
                        اقبل التحدي
                    </button>
                  )}
                </div>
                <div className="relative z-10">
                  {isGeneratingChallenge ? (
                    <div className="flex flex-col items-center justify-center py-4 sm:py-6 gap-2 text-yellow-400">
                      <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" /> 
                      <span className="text-xs sm:text-sm font-medium animate-pulse">يتم التجهيز... 🔥</span>
                    </div>
                  ) : aiChallenge ? (
                    <div className="text-slate-200 leading-relaxed text-[11px] sm:text-xs font-mono bg-slate-900/60 p-3 sm:p-4 rounded-lg border border-slate-700/50 whitespace-pre-line">
                        {aiChallenge}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs mt-1 sm:mt-2">اضغط ليختبرك "روبو" بسؤال.</p>
                  )}
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}