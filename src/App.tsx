// src/App.tsx
import { useState } from 'react';
import { Bot, Map, ExternalLink, Code } from 'lucide-react';

import { Stage } from './types';
import { roadmapData } from './data/roadmapData'; 
import Chatbot from './components/Chatbot';
import StageModal from './components/StageModal';


export default function App() {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
      {/* Header */}
      <header className="relative pt-16 pb-12 text-center border-b border-slate-800/80">
         {/* ... الكود الخاص بالـ Header ... */}
         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">خارطة طريق الروبوتات</h1>
         <p className="text-lg text-slate-400">دليلك الشامل من الصفر وحتى احتراف بناء وبرمجة الروبوتات.</p>
      </header>

      {/* Timeline */}
      <main className="container mx-auto px-4 py-16 max-w-4xl flex-grow">
        <div className="space-y-12">
        {roadmapData.map((stage: Stage) => {
          const Icon = stage.icon;
            return (
              <div key={stage.id} className="relative flex items-center">
                <button onClick={() => setSelectedStage(stage)} className="w-full text-right p-6 rounded-2xl border border-slate-800/80 bg-slate-900/80 hover:bg-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stage.bgColor} ${stage.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${stage.difficultyColor}`}>
                      {stage.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{stage.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{stage.description}</p>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-8 text-center">
        <p className="text-slate-300 text-sm">مجتمع مطوري جوجل جامعة القصيم (GDG Qassim) &copy; 2026</p>
      </footer>

      {/* المكونات المستقلة */}
      {selectedStage && (
        <StageModal stage={selectedStage} onClose={() => setSelectedStage(null)} />
      )}
      
      <Chatbot />
    </div>
  );
}