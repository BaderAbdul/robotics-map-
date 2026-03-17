import { useState } from 'react';
import { Bot, Map, ExternalLink, Code } from 'lucide-react';
import type { Stage } from './types';
import { roadmapData } from './data/roadmapData'; 
import Chatbot from './components/Chatbot';
import StageModal from './components/StageModal';

export default function App() {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* --- Header Section --- */}
      <header className="relative pt-16 pb-12 overflow-hidden border-b border-slate-800/80 bg-slate-950/50 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-700 rounded-2xl mb-6 shadow-xl shadow-blue-900/20 relative group cursor-default">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <Bot className="w-10 h-10 text-blue-400 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent drop-shadow-sm">
            خارطة طريق الروبوتات
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed">
            دليلك الشامل من الصفر وحتى احتراف بناء وبرمجة الروبوتات الذكية. مقدم لكم من قسم الروبوتات في مجتمع مطوري جوجل <span className="font-semibold text-white px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700">GDG Qassim</span>.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md rounded-full border border-slate-700 text-sm text-slate-300 shadow-lg">
            <Map className="w-4 h-4 text-yellow-400" />
            <span>انقر على أي مرحلة للبدء واستكشاف المصادر</span>
          </div>
        </div>
      </header>

      {/* --- Timeline Section --- */}
      <main className="container mx-auto px-4 py-16 max-w-4xl flex-grow">
        <div className="relative">
          <div className="absolute top-0 bottom-0 right-[28px] md:right-1/2 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-teal-500/50 rounded-full"></div>

          <div className="space-y-12">
            {roadmapData.map((stage: Stage, index: number) => {
              const Icon = stage.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={stage.id} className="relative flex items-center md:justify-between group">
                  <div className="absolute right-[16px] md:left-1/2 md:right-auto md:-translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border-4 border-slate-700 group-hover:border-blue-500 group-hover:scale-125 transition-all duration-300 z-10 shadow-lg shadow-slate-900"></div>
                  
                  <div className={`w-full pl-16 md:pl-0 md:w-[45%] ${isEven ? 'md:text-left md:mr-auto' : 'md:text-right md:ml-auto'}`}>
                    <button 
                      onClick={() => setSelectedStage(stage)}
                      className={`w-full text-right p-6 rounded-2xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-700 group relative overflow-hidden`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`inline-flex p-3 rounded-xl ${stage.bgColor} ${stage.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${stage.difficultyColor}`}>
                          {stage.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold tracking-wider text-slate-500">المرحلة 0{stage.id}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                        {stage.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {stage.description}
                      </p>
                      <div className="flex items-center text-sm text-blue-400 font-medium">
                        استكشف المصادر <ExternalLink className="w-4 h-4 mr-1 rotate-180" />
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/50 backdrop-blur-md py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-5">
            <span className="w-8 h-px bg-slate-700"></span>
            <Code className="w-4 h-4 text-slate-500" />
            <span className="w-8 h-px bg-slate-700"></span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 mb-4">
            <p className="text-slate-300 text-sm">
              برمجة وتطوير الموقع: <span className="text-blue-400 font-bold tracking-wide">بدر الدخيل الله</span> ⚡
            </p>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <p className="text-slate-300 text-sm">
              إعداد المسار والمحتوى: <span className="text-teal-400 font-bold tracking-wide">فريق الروبوتات</span> 🤖
            </p>
          </div>

          <div className="text-slate-400 text-[11px] leading-relaxed max-w-2xl mx-auto bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 mb-6">
            <p className="mb-1">
              <span className="font-semibold text-slate-300">قائدة القسم:</span> رغد العبيد &nbsp;|&nbsp; 
              <span className="font-semibold text-slate-300"> النائب:</span> كيان القفاري
            </p>
            <p>
              <span className="font-semibold text-slate-300">أعضاء القسم:</span> رهف الحربي، شاهر الحربي، منار النقيدان، مها المطرفي، بدر الدخيل الله
            </p>
          </div>

          <p className="text-slate-500 text-xs font-medium">
            مجتمع مطوري جوجل جامعة القصيم (GDG Qassim) &copy; 2026
          </p>
        </div>
      </footer>

      {/* --- Modals & Chatbot --- */}
      {selectedStage && (
        <StageModal stage={selectedStage} onClose={() => setSelectedStage(null)} />
      )}
      
      <Chatbot />
    </div>
  );
}