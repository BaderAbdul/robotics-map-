// src/components/StageModal.tsx
import { useState, useEffect } from 'react';
import { X, BookOpen, PlayCircle, Wrench, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { Stage } from '../types';
import { fetchGeminiWithRetry } from '../services/gemini';

interface Props {
  stage: Stage;
  onClose: () => void;
}

export default function StageModal({ stage, onClose }: Props) {
  const [aiProjectIdea, setAiProjectIdea] = useState<string>("");
  const [isGeneratingProject, setIsGeneratingProject] = useState<boolean>(false);

  useEffect(() => {
    setAiProjectIdea(""); // تصفير الفكرة عند فتح مرحلة جديدة
  }, [stage]);

  const generateAiProject = async () => {
    setIsGeneratingProject(true);
    setAiProjectIdea("");
    
    const prompt = `أعطني فكرة مشروع واحدة مبتكرة وممتعة لطلاب الجامعة لتطبيقها في مجال: "${stage.title}". 
    يجب أن يكون المشروع عملياً ومناسباً للمبتدئين أو المتوسطين. 
    قدم الفكرة في 3 أسطر كحد أقصى، واذكر القطع الرئيسية المطلوبة باختصار. تحدث بطريقة مشجعة.`;
    
    const result = await fetchGeminiWithRetry(prompt);
    if (result) setAiProjectIdea(result);
    setIsGeneratingProject(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className={`p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-bl from-slate-900 to-slate-800`}>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${stage.bgColor} ${stage.color}`}>
              {stage.icon && <stage.icon className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-slate-400">المرحلة 0{stage.id}</span>
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

        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          {/* ... قسم النظرة العامة ومصادر التعلم ... */}
          {/* (استخدم نفس كود الـ HTML الخاص بك للـ Modal هنا) */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-400" /> نظرة عامة</h3>
            <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">{stage.description}</p>
          </div>

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
        </div>
      </div>
    </div>
  );
}