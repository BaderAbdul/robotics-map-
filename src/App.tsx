// src/App.tsx
import { useState, useEffect } from 'react';
import { Bot, Map, ExternalLink, Code, CheckCircle2, Circle } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import type { Stage } from './types';
import { roadmapData } from './data/roadmapData'; 
import Chatbot from './components/Chatbot';
import StageModal from './components/StageModal';
import EngineeringWorkbench from './components/EngineeringWorkbench';
import EventsSection from './components/EventsSection';

export default function App() {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  
  // -- نظام تتبع الإنجاز (Progress Tracker) --
  const [completedStages, setCompletedStages] = useState<string[]>(() => {
    const saved = localStorage.getItem('roboCompletedStages');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('roboCompletedStages', JSON.stringify(completedStages));
  }, [completedStages]);

  const toggleCompletion = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation(); 
    const stringId = id.toString();
    setCompletedStages(prev => 
      prev.includes(stringId) ? prev.filter(s => s !== stringId) : [...prev, stringId]
    );
  };

  const progressPercentage = Math.round((completedStages.length / roadmapData.length) * 100);

  // -- مؤشر القراءة (Scroll Progress Bar) --
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // -- تقسيم المسارات الأربعة --
  const mainStages = roadmapData.filter(s => s.branch === 'main');
  const hwStages = roadmapData.filter(s => s.branch === 'hardware');
  const iotStages = roadmapData.filter(s => s.branch === 'iot'); // مسارنا الجديد!
  const aiStages = roadmapData.filter(s => s.branch === 'ai');

  // -- مكون البطاقة المخصص --
  const StageCard = ({ stage, index, isMain = false }: { stage: Stage, index: number, isMain?: boolean }) => {
    const Icon = stage.icon;
    const isCompleted = completedStages.includes(stage.id.toString());
    const isEven = isMain && index % 2 === 0;
    const formattedId = stage.id.toString().length === 1 ? `0${stage.id}` : stage.id;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`relative flex items-center group ${isMain ? 'md:justify-between' : 'w-full mb-8'}`}
      >
        {isMain && (
          <div className="absolute right-[24px] md:left-1/2 md:right-auto md:-translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border-4 border-slate-700 group-hover:border-blue-500 group-hover:scale-125 transition-all duration-300 z-10 shadow-lg shadow-slate-900 translate-x-1/2 md:translate-x-0">
             {isCompleted && <div className="absolute inset-0 bg-green-500 rounded-full blur-sm"></div>}
          </div>
        )}
        
        <div className={`w-full ${isMain ? `pl-12 md:pl-0 pr-16 md:pr-0 md:w-[45%] ${isEven ? 'md:text-left md:mr-auto' : 'md:text-right md:ml-auto'}` : ''}`}>
          <button 
            onClick={() => setSelectedStage(stage)}
            className={`w-full text-right p-4 sm:p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden
              ${isCompleted 
                ? 'bg-green-900/10 border-green-500/50 hover:bg-green-900/20 hover:border-green-400' 
                : 'bg-slate-900/80 hover:bg-slate-800'} ${stage.borderColor ? `border-${stage.borderColor.split('-')[1]}-500/30` : 'border-slate-800/80'}`}
          >
            <div 
              onClick={(e) => toggleCompletion(e, stage.id)}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 cursor-pointer text-slate-500 hover:text-green-400 transition-colors"
              title={isCompleted ? "إلغاء الإنجاز" : "تحديد كمكتمل"}
            >
              {isCompleted ? <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" /> : <Circle className="w-6 h-6 sm:w-8 sm:h-8" />}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className={`inline-flex p-2.5 sm:p-3 rounded-xl ${isCompleted ? 'bg-green-500/20 text-green-400' : `${stage.bgColor} ${stage.color}`}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              </div>
              <span className={`text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${stage.difficultyColor} whitespace-nowrap`}>
                {stage.difficulty}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-500">المرحلة {formattedId}</span>
            </div>

            <h3 className={`text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 transition-colors pr-2 sm:pr-0 ${isCompleted ? 'text-green-300' : 'text-white group-hover:text-blue-400'}`}>
              {stage.title}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4 leading-relaxed pr-2 sm:pr-0">{stage.description}</p>
            
            <div className={`flex items-center text-xs sm:text-sm font-medium pr-2 sm:pr-0 ${isCompleted ? 'text-green-400' : 'text-blue-400'}`}>
              {isCompleted ? 'تم الإنجاز بنجاح 🎉' : 'استكشف المصادر'} { !isCompleted && <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 rotate-180" /> }
            </div>
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] text-slate-200 font-sans flex flex-col overflow-x-hidden">
      
      <motion.div 
        className="fixed top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 z-50 origin-right"
        style={{ scaleX }}
      />

      <header className="relative pt-16 sm:pt-20 pb-8 sm:pb-12 overflow-hidden border-b border-slate-800/80 bg-slate-950/50 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-slate-900 border border-slate-700 rounded-2xl mb-4 sm:mb-6 shadow-xl shadow-blue-900/20 relative group cursor-default">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 relative z-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-l from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent drop-shadow-sm leading-tight">
            خارطة طريق الروبوتات
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed px-2">
            دليلك الشامل من الصفر وحتى احتراف بناء وبرمجة الروبوتات الذكية. مقدم لكم من قسم الروبوتات في مجتمع مطوري جوجل <span className="font-semibold text-white px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-slate-800 rounded-md border border-slate-700 whitespace-nowrap">GDG Qassim</span>.
          </p>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-800/80 backdrop-blur-md rounded-full border border-slate-700 text-xs sm:text-sm text-slate-300 shadow-lg mb-6 sm:mb-8">
            <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 shrink-0" />
            <span>انقر على أي مرحلة للبدء واستكشاف المصادر</span>
          </div>
          
          <div className="max-w-md mx-auto bg-slate-900/80 border border-slate-700 p-3 sm:p-4 rounded-2xl backdrop-blur-sm shadow-xl mx-2 sm:mx-auto">
            <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-300 mb-1.5 sm:mb-2">
              <span>نسبة الإنجاز في المسار:</span>
              <span className="text-green-400">{progressPercentage}%</span>
            </div>
            <div className="h-2 sm:h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-l from-green-400 to-teal-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* تم توسيع الـ max-w ليتسع لـ 3 أعمدة بشكل مريح */}
      <main className="container mx-auto px-4 py-10 sm:py-16 max-w-[1400px] flex-grow overflow-x-hidden">
        
        {/* المسار الأساسي */}
        <div className="relative mb-12 sm:mb-20 max-w-5xl mx-auto">
          <div className="absolute top-0 bottom-0 right-[24px] md:right-1/2 w-0.5 bg-gradient-to-b from-blue-500/50 to-purple-500/50 rounded-full translate-x-1/2 md:translate-x-0"></div>
          <div className="space-y-6 sm:space-y-12">
            {mainStages.map((stage, index) => <StageCard key={stage.id} stage={stage} index={index} isMain={true} />)}
          </div>
        </div>

        {/* عقدة التشعب الدالة على التخصصات الثلاثة */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="flex flex-col items-center justify-center mb-10 sm:mb-16 text-center"
        >
          <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
          <div className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/80 border border-slate-700 rounded-full text-slate-300 font-bold flex items-center gap-1.5 sm:gap-2 shadow-lg text-xs sm:text-base z-10">
            <Map className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />
            هنا يتشعب مسارك! اختر تخصصك
          </div>
          {/* خطوط متفرعة لـ 3 اتجاهات */}
          <div className="flex justify-center w-full max-w-2xl mt-3 sm:mt-4 gap-2 sm:gap-4 relative h-8 sm:h-10">
             <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-orange-500/50 via-cyan-500/50 to-teal-500/50 rounded-full"></div>
             <div className="absolute top-0 left-0 w-0.5 h-full bg-orange-500/50"></div>
             <div className="absolute top-0 left-1/2 w-0.5 h-full bg-cyan-500/50 -translate-x-1/2"></div>
             <div className="absolute top-0 right-0 w-0.5 h-full bg-teal-500/50"></div>
          </div>
        </motion.div>

        {/* الـ Grid الجديد لـ 3 أعمدة */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 sm:gap-8 relative">
          
          {/* مسار الهاردوير */}
          <div className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800/50 bg-slate-900/30">
            <h3 className="text-lg sm:text-xl font-bold text-center mb-6 text-orange-400 bg-orange-400/10 py-2 sm:py-3 rounded-xl border border-orange-500/20">
              الهاردوير والدوائر
            </h3>
            <div>{hwStages.map((stage, index) => <StageCard key={stage.id} stage={stage} index={index} />)}</div>
          </div>

          {/* مسار إنترنت الأشياء (IoT) - يظهر الآن! */}
          <div className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800/50 bg-slate-900/30">
            <h3 className="text-lg sm:text-xl font-bold text-center mb-6 text-cyan-400 bg-cyan-400/10 py-2 sm:py-3 rounded-xl border border-cyan-500/20">
              إنترنت الأشياء (IoT)
            </h3>
            <div>{iotStages.map((stage, index) => <StageCard key={stage.id} stage={stage} index={index} />)}</div>
          </div>

          {/* مسار الذكاء الاصطناعي والبرمجيات */}
          <div className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800/50 bg-slate-900/30 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold text-center mb-6 text-teal-400 bg-teal-400/10 py-2 sm:py-3 rounded-xl border border-teal-500/20">
              البرمجيات والذكاء الاصطناعي
            </h3>
            <div>{aiStages.map((stage, index) => <StageCard key={stage.id} stage={stage} index={index} />)}</div>
          </div>

        </div>
      </main>

    {/* ============== قسم الفعاليات والمعسكرات ============== */}
   <div className="container mx-auto px-4 pb-16 max-w-[1400px]">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>
      <EventsSection />
   </div>

      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/50 backdrop-blur-md py-6 sm:py-8 pb-24 sm:pb-8">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4 sm:mb-5">
            <span className="w-6 sm:w-8 h-px bg-slate-700"></span>
            <Code className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
            <span className="w-6 sm:w-8 h-px bg-slate-700"></span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-1.5 sm:gap-2 md:gap-6 mb-4">
            <p className="text-slate-300 text-xs sm:text-sm">
              برمجة وتطوير الموقع: <span className="text-blue-400 font-bold tracking-wide">بدر الدخيل الله</span> ⚡
            </p>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <p className="text-slate-300 text-xs sm:text-sm">
              إعداد المسار والمحتوى: <span className="text-teal-400 font-bold tracking-wide">فريق الروبوتات</span> 🤖
            </p>
          </div>
          <div className="text-slate-400 text-[10px] sm:text-[11px] leading-relaxed max-w-2xl mx-auto bg-slate-800/30 p-2.5 sm:p-3 rounded-xl border border-slate-700/50 mb-4 sm:mb-6">
            <p className="mb-1">
              <span className="font-semibold text-slate-300">قائدة القسم:</span> رغد العبيد &nbsp;|&nbsp; 
              <span className="font-semibold text-slate-300"> النائب:</span> كيان القفاري
            </p>
            <p>
              <span className="font-semibold text-slate-300">أعضاء القسم:</span> رهف الحربي، شاهر الحربي، منار النقيدان، مها المطرفي، بدر الدخيل الله
            </p>
          </div>
          <p className="text-slate-500 text-[10px] sm:text-xs font-medium">
            مجتمع مطوري جوجل جامعة القصيم (GDG Qassim) &copy; 2026
          </p>
        </div>
      </footer>

      {selectedStage && <StageModal stage={selectedStage} onClose={() => setSelectedStage(null)} />}
      <EngineeringWorkbench />
      <Chatbot />
    </div>
  );
}