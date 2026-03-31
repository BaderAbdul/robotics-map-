// src/App.tsx
import { useState, useEffect } from 'react';
import { Bot, Map, ExternalLink, Code, CheckCircle2, Circle, ChevronDown, Rocket, CalendarDays, Users } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import type { Stage } from './types';
import { roadmapData } from './data/roadmapData'; 
import Chatbot from './components/Chatbot';
import StageModal from './components/StageModal';
import EngineeringWorkbench from './components/EngineeringWorkbench';
import EventsSection from './components/EventsSection';

export default function App() {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // -- نظام تتبع الإنجاز --
  const [completedStages, setCompletedStages] = useState<string[]>(() => {
    const saved = localStorage.getItem('roboCompletedStages');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('roboCompletedStages', JSON.stringify(completedStages));
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [completedStages]);

  const toggleCompletion = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation(); 
    const stringId = id.toString();
    setCompletedStages(prev => 
      prev.includes(stringId) ? prev.filter(s => s !== stringId) : [...prev, stringId]
    );
  };

  const progressPercentage = Math.round((completedStages.length / roadmapData.length) * 100);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // -- تقسيم المسارات الأربعة --
  const mainStages = roadmapData.filter(s => s.branch === 'main');
  const hwStages = roadmapData.filter(s => s.branch === 'hardware');
  const iotStages = roadmapData.filter(s => s.branch === 'iot'); 
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

      {/* ============== شريط التنقل (Navbar) ============== */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg' : 'bg-transparent pt-4'}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-700 shadow-inner shadow-blue-500/20">
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white leading-none tracking-wide text-lg">GDG <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-teal-400">Qassim</span></span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider">قسم الروبوتات</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <a href="#roadmap" className="hover:text-blue-400 transition-colors flex items-center gap-1.5"><Map className="w-4 h-4"/> الخارطة</a>
            <a href="#events" className="hover:text-pink-400 transition-colors flex items-center gap-1.5"><CalendarDays className="w-4 h-4"/> الفعاليات</a>
            <a href="#team" className="hover:text-teal-400 transition-colors flex items-center gap-1.5"><Users className="w-4 h-4"/> الفريق</a>
          </div>
        </div>
      </nav>

      {/* ============== الواجهة الترحيبية (Hero Section) ============== */}
      <header className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden border-b border-slate-800/80 bg-slate-950/50 backdrop-blur-sm min-h-[85vh] flex items-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-300 mb-8 shadow-inner shadow-blue-500/10">
            <Rocket className="w-4 h-4" /> المنصة الرسمية لمهندسي المستقبل
          </motion.div>
          
          <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6, delay:0.1}} className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 text-white tracking-tight leading-tight">
             مرحباً بك في عالم <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 via-teal-400 to-green-400 drop-shadow-sm"> الروبوتات الذكية </span>
          </motion.h1>
          
          <motion.p initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6, delay:0.2}} className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            مجتمع مطوري جوجل بجامعة القصيم يضع بين يديك خارطة طريق هندسية متكاملة. من إضاءة مصباحك الأول، وحتى برمجة روبوتات مستقلة تعتمد على الذكاء الاصطناعي وإنترنت الأشياء.
          </motion.p>
          
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6, delay:0.3}} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#roadmap" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2">
              <Map className="w-5 h-5"/> ابدأ التعلم الآن
            </a>
            <a href="#events" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2">
              <CalendarDays className="w-5 h-5"/> استكشف المعسكرات
            </a>
          </motion.div>

          {/* شريط الإنجاز العائم */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1, delay:0.8}} className="max-w-xl mx-auto bg-slate-900/80 border border-slate-700 p-4 sm:p-5 rounded-3xl backdrop-blur-md shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-3xl pointer-events-none"></div>
            <div className="flex justify-between items-end mb-3">
              <div className="text-right">
                 <h4 className="font-bold text-white text-sm sm:text-base">تقدمك في الخارطة</h4>
                 <p className="text-[11px] sm:text-xs text-slate-400 mt-1">أكملت {completedStages.length} من أصل {roadmapData.length} مرحلة</p>
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-green-400 to-teal-400">{progressPercentage}%</span>
            </div>
            <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-l from-green-400 via-teal-400 to-blue-500 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
              </motion.div>
            </div>
          </motion.div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-500 hidden sm:block">
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* ============== قسم الخارطة (Roadmap) ============== */}
      <main id="roadmap" className="container mx-auto px-4 py-16 sm:py-24 max-w-[1400px] flex-grow overflow-x-hidden scroll-mt-20">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">خارطة الطريق التفاعلية</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">تدرج في التعلم عبر مسار منهجي. انقر على أي مرحلة لاكتشاف المصادر والمشاريع التطبيقية.</p>
        </div>

        {/* المسار الأساسي */}
        <div className="relative mb-16 sm:mb-24 max-w-5xl mx-auto">
          <div className="absolute top-0 bottom-0 right-[24px] md:right-1/2 w-0.5 bg-gradient-to-b from-blue-500/50 to-purple-500/50 rounded-full translate-x-1/2 md:translate-x-0"></div>
          <div className="space-y-6 sm:space-y-12">
            {mainStages.map((stage, index) => <StageCard key={stage.id} stage={stage} index={index} isMain={true} />)}
          </div>
        </div>

        {/* عقدة التشعب */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="flex flex-col items-center justify-center mb-12 sm:mb-20 text-center"
        >
          <div className="w-1 h-12 sm:h-16 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
          <div className="px-5 sm:px-8 py-3 sm:py-4 bg-slate-800 border-2 border-slate-700 rounded-full text-white font-bold flex items-center gap-2 sm:gap-3 shadow-2xl shadow-purple-900/20 text-sm sm:text-lg z-10">
            <Map className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 shrink-0" />
            تفرع إلى تخصصك الدقيق!
          </div>
          {/* خطوط التفرع */}
          <div className="flex justify-center w-full max-w-3xl mt-4 sm:mt-6 gap-2 sm:gap-4 relative h-10 sm:h-12">
             <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-orange-500/50 via-cyan-500/50 to-teal-500/50 rounded-full"></div>
             <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50 rounded-b-full"></div>
             <div className="absolute top-0 left-1/2 w-1 h-full bg-cyan-500/50 -translate-x-1/2 rounded-b-full"></div>
             <div className="absolute top-0 right-0 w-1 h-full bg-teal-500/50 rounded-b-full"></div>
          </div>
        </motion.div>

        {/* الـ Grid لـ 3 أعمدة (يظهر مسار الـ IoT الآن!) */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 sm:gap-8 relative">
          
          <div className="relative p-5 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/40 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-8 text-orange-400 bg-orange-400/10 py-3 sm:py-4 rounded-2xl border border-orange-500/20">
              الهاردوير والدوائر
            </h3>
            <div>{hwStages.map((stage, index) => <StageCard key={stage.id} stage={stage} index={index} />)}</div>
          </div>

          <div className="relative p-5 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/40 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-8 text-cyan-400 bg-cyan-400/10 py-3 sm:py-4 rounded-2xl border border-cyan-500/20">
              إنترنت الأشياء (IoT)
            </h3>
            <div>{iotStages.map((stage, index) => <StageCard key={stage.id} stage={stage} index={index} />)}</div>
          </div>

          <div className="relative p-5 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/40 shadow-xl md:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-8 text-teal-400 bg-teal-400/10 py-3 sm:py-4 rounded-2xl border border-teal-500/20">
              البرمجيات والذكاء
            </h3>
            <div>{aiStages.map((stage, index) => <StageCard key={stage.id} stage={stage} index={index} />)}</div>
          </div>

        </div>
      </main>

      {/* ============== قسم الفعاليات والمعسكرات ============== */}
      <section id="events" className="container mx-auto px-4 py-16 sm:py-24 max-w-[1400px] scroll-mt-20 relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
         <EventsSection />
      </section>

      {/* ============== الفوتر (الفريق والحقوق) ============== */}
      <footer id="team" className="mt-auto border-t border-slate-800 bg-slate-950 pt-12 pb-24 sm:pb-12 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-2xl border border-slate-800 mb-6 shadow-lg">
             <Bot className="w-8 h-8 text-slate-400" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">فريق الروبوتات</h3>
          <p className="text-slate-400 text-sm mb-8">نعمل معاً لنشر ثقافة الصناعة والابتكار</p>

          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4 mb-10 text-right">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
               <span className="text-xs text-slate-500 font-bold mb-2 tracking-wider">القيادة التنفيذية</span>
               <p className="text-slate-300 text-sm font-medium leading-loose">
                  الرئيس: <span className="text-white font-bold">رغد العبيد</span> <br/>
                  النائب: <span className="text-white font-bold">كيان القفاري</span>
               </p>
            </div>
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
               <span className="text-xs text-slate-500 font-bold mb-2 tracking-wider">أعضاء ومهندسي القسم</span>
               <p className="text-slate-300 text-sm font-medium leading-loose">
                  رهف الحربي، شاهر الحربي <br/>
                  منار النقيدان، مها المطرفي، بدر الدخيل الله
               </p>
            </div>
          </div>

          <div className="w-16 h-1 bg-slate-800 mx-auto rounded-full mb-6"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 mb-4">
            <p className="text-slate-400 text-sm">
              تم برمجة وتطوير المنصة بواسطة: <span className="text-blue-400 font-bold tracking-wide">بدر الدخيل الله</span> ⚡
            </p>
          </div>
          
          <p className="text-slate-500 text-xs font-medium">
            جميع الحقوق محفوظة - مجتمع مطوري جوجل بجامعة القصيم (GDG Qassim) &copy; 2026
          </p>
        </div>
      </footer>

      {/* المكونات العائمة (Modals & Tools) */}
      {selectedStage && <StageModal stage={selectedStage} onClose={() => setSelectedStage(null)} />}
      <EngineeringWorkbench />
      <Chatbot />
    </div>
  );
}