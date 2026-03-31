// src/components/EventsSection.tsx
import { Calendar, Clock, FileText, Users, Github, DownloadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

interface EventInfo {
  id: string;
  title: string;
  date: string;
  duration: string;
  level: string;
  status: 'completed' | 'upcoming' | 'ongoing';
  description: string;
  prerequisites: string[];
  materials: { name: string; url: string; icon: any }[];
}

// يمكنك لاحقاً نقل هذه البيانات لملف منفصل، وضعتها هنا لسهولة التعديل
const eventsData: EventInfo[] = [
  {
    id: "evt-01",
    title: "معسكر المتحكمات الدقيقة",
    date: "فبراير 2026",
    duration: "3 أيام",
    level: "مبتدئ",
    status: "completed",
    description: "معسكر تدريبي مكثف قدمه القسم لطلاب الجامعة، تناول أساسيات الإلكترونيات، برمجة الأردوينو، والتعامل مع الحساسات الأساسية والمحركات.",
    prerequisites: ["شغف التعلم", "لابتوب شخصي"],
    materials: [
      { name: "عرض التقديمي (PDF)", url: "https://canva.link/co3p3azerhj6wcz", icon: FileText },
     
    ]
  },
  {
    id: "evt-02",
    title: "معسكر إنترنت الأشياء (IoT)",
    date: "12-14 أبريل 2026",
    duration: "3 أيام",
    level: "متوسط",
    status: "upcoming",
    description: "انتقل بروبوتك إلى السحابة! سنتعلم في هذا المعسكر كيفية ربط لوحات ESP32 بالإنترنت، وبناء لوحات تحكم (Dashboards) تفاعلية للتحكم بالروبوت عن بُعد عبر بروتوكول MQTT و منصة Blynk.",
    prerequisites: ["أساسيات الأردوينو", "لابتوب"],
    materials: [
      { name: "رابط التسجيل (قريباً)", url: "#", icon: CalendarDays }
    ]
  }
];

export default function EventsSection() {
  return (
    <section className="py-12 relative z-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block">
          معسكرات وفعاليات القسم
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          سجل الأحداث، العروض التقديمية، ومواد المعسكرات التدريبية التي يقدمها فريق الروبوتات لتطوير مهارات الأعضاء.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {eventsData.map((event) => (
          <div key={event.id} className="bg-slate-900/60 backdrop-blur-md border border-slate-700/80 rounded-3xl p-6 hover:border-slate-500 transition-all shadow-xl flex flex-col h-full relative overflow-hidden group">
            
            {/* حالة الفعالية (Status Badge) */}
            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl font-bold text-xs flex items-center gap-1.5 shadow-md
              ${event.status === 'completed' ? 'bg-green-500/20 text-green-400 border-b border-l border-green-500/30' : 
                event.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-b border-l border-blue-500/30' : 
                'bg-orange-500/20 text-orange-400 border-b border-l border-orange-500/30'}`}
            >
              {event.status === 'completed' && <><CheckCircle2 className="w-3.5 h-3.5" /> مكتمل</>}
              {event.status === 'upcoming' && <><Calendar className="w-3.5 h-3.5" /> قريباً</>}
              {event.status === 'ongoing' && <><AlertCircle className="w-3.5 h-3.5 animate-pulse" /> مستمر الآن</>}
            </div>

            <h3 className="text-xl font-bold text-white mb-3 mt-2 group-hover:text-purple-300 transition-colors">
              {event.title}
            </h3>

            {/* تفاصيل الوقت والمستوى */}
            <div className="flex flex-wrap gap-3 mb-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {event.date}
              </span>
              <span className="flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-pink-400" /> {event.duration}
              </span>
              <span className="flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <Users className="w-3.5 h-3.5 text-teal-400" /> مستوى: {event.level}
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
              {event.description}
            </p>

            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 mt-auto">
              
              {/* المتطلبات */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-500 mb-2">يتطلب:</h4>
                <div className="flex flex-wrap gap-2">
                  {event.prerequisites.map((req, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* الملفات والمصادر */}
              {event.materials.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 mb-2">الملفات والمرفقات:</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.materials.map((mat, idx) => (
                      <a key={idx} href={mat.url} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-1.5 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-all">
                        <mat.icon className="w-3.5 h-3.5" />
                        {mat.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}