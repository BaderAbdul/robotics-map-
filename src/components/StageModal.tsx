// src/components/StageModal.tsx
import { useState, useEffect } from 'react';
import { X, BookOpen, Wrench, Sparkles, Loader2, PlayCircle, ExternalLink, Award } from 'lucide-react'; // استيراد Award
import type { Stage } from '../types';
import { fetchGeminiWithRetry } from '../services/gemini';

interface Props {
  stage: Stage;
  onClose: () => void;
}

export default function StageModal({ stage, onClose }: Props) {
  const [aiProjectIdea, setAiProjectIdea] = useState<string>("");
  const [isGeneratingProject, setIsGeneratingProject] = useState<boolean>(false);
  
  // -- ولاية التحدي البرمجي الجديدة --
  const [aiChallenge, setAiChallenge] = useState<string>("");
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState<boolean>(false);

  useEffect(() => {
    setAiProjectIdea("");
    setAiChallenge(""); // تصفير التحدي عند تغيير المرحلة
  }, [stage]);

  const generateAiProject = async () => {
    // ... (نفس الكود القديم للمشاريع)
    setIsGeneratingProject(true);
    setAiProjectIdea("");
    const prompt = `أعطني فكرة مشروع واحدة مبتكرة وممتعة لطلاب الجامعة لتطبيقها في مجال: "${stage.title}". يجب أن يكون المشروع عملياً ومناسباً للمبتدئين أو المتوسطين. قدم الفكرة في 3 أسطر كحد أقصى، واذكر القطع الرئيسية المطلوبة باختصار. تحدث بطريقة مشجعة.`;
    const result = await fetchGeminiWithRetry(prompt);
    if (result) setAiProjectIdea(result);
    setIsGeneratingProject(false);
  };

  // -- دالة توليد التحدي البرمجي الجديدة --
  const generateAiChallenge = async () => {
    setIsGeneratingChallenge(true);
    setAiChallenge("");
    
    const prompt = `المستخدم يدرس حالياً مرحلة تعليمية بعنوان: "${stage.title}". وصف المرحلة: "${stage.description}". قم بتوليد تحدي برمجي واحد قصير ومحدد جداً يختبر فهم المستخدم لهذه المفاهيم (مثلاً: اكتب دالة تقوم بـ X). لا تقدم الحل. قدم التحدي باللغة العربية بنبرة محفزة وقوية، في سطرين كحد أقصى.`;
    
    const result = await fetchGeminiWithRetry(prompt);
    if (result) setAiChallenge(result);
    setIsGeneratingChallenge(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-bl from-slate-900 to-slate-800`}>
            {/* ... (Header كود الـ كما هو) ... */}
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${stage.bgColor} ${stage.color}`}>
              {stage.icon && <stage.icon className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-slate-400">المرحلة {stage.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.difficultyColor}`}>
                  {stage.difficulty}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{stage.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar relative flex-grow">
          
          {/* ... (النظرة العامة ومصادر التعلم كما هي) ... */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-400" /> نظرة عامة</h3>
            <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">{stage.description}</p>
            {stage.hint && (
              <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg text-blue-300 text-sm font-medium flex items-start gap-2">
                 <span className="block mt-0.5">{stage.hint}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-red-400" /> مصادر التعلم
            </h3>
            <div className="grid gap-3">
              {stage.resources.map((res: any, idx: number) => (
                <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-500 transition-all group">
                  <div className="flex items-center gap-3">
                    {res.type === 'video' ? <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-red-400" /> : <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />}
                    <span className="text-slate-300 group-hover:text-white font-medium">{res.title}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white -rotate-90 rtl:rotate-180" />
                </a>
              ))}
            </div>
          </div>

          {/* المشاريع التطبيقية */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Wrench className="w-5 h-5 text-yellow-400" /> المشاريع التطبيقية</h3>
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 text-slate-200">
                <span className="text-xs font-bold text-slate-400 block mb-2">مشروع أساسي:</span>
                {stage.project}
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-5 rounded-xl border border-blue-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-sm font-bold text-blue-300 flex items-center gap-2"><Sparkles className="w-4 h-4" /> فكرة مبتكرة بالذكاء الاصطناعي</span>
                  {!aiProjectIdea && !isGeneratingProject && (
                    <button onClick={generateAiProject} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">ولد فكرة الآن</button>
                  )}
                </div>
                <div className="relative z-10">
                  {isGeneratingProject ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-3 text-blue-400">
                      <Loader2 className="w-8 h-8 animate-spin" /> 
                      <span className="text-sm font-medium animate-pulse">روبو يجهز فكرة المشروع... ⚡</span>
                    </div>
                  ) : aiProjectIdea ? (
                    <div className="text-slate-200 leading-relaxed text-sm bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">{aiProjectIdea}</div>
                  ) : (
                    <p className="text-slate-400 text-sm mt-2">اضغط للحصول على فكرة مشروع مخصصة.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- قسم التحدي البرمجي الجديد (AI Challenge) --- */}
          <div className="bg-slate-950 border-t-2 border-slate-700 -mx-6 -mb-6 p-6">
             <div className="bg-slate-800 rounded-xl border border-yellow-500/30 p-5 relative overflow-hidden shadow-xl shadow-yellow-950/20">
                <div className="absolute inset-0 bg-yellow-500 rounded-2xl blur opacity-5"></div>
                
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <h3 className="text-base font-bold text-yellow-300 mb-0 flex items-center gap-2.5">
                    <Award className="w-5 h-5" /> تحدي برمجي سريع 🎯
                  </h3>
                  {!aiChallenge && !isGeneratingChallenge && (
                    <button onClick={generateAiChallenge} className="text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2.5 rounded-xl transition-colors font-bold shadow-md shadow-yellow-900/30">
                        اقبل التحدي وولد سؤالاً
                    </button>
                  )}
                </div>

                <div className="relative z-10">
                  {isGeneratingChallenge ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-3 text-yellow-400">
                      <Loader2 className="w-8 h-8 animate-spin" /> 
                      <span className="text-sm font-medium animate-pulse">روبو يجهز التحدي الخاص بك... 🔥</span>
                    </div>
                  ) : aiChallenge ? (
                    <div className="text-slate-200 leading-relaxed text-xs font-mono bg-slate-900/60 p-4 rounded-lg border border-slate-700/50 whitespace-pre-line prose prose-invert prose-xs max-w-none">
                        {aiChallenge}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm mt-2">اضغط على الزر ليتحداك "روبو" بسؤال يختبر فهمك لهذه المرحلة.</p>
                  )}
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}