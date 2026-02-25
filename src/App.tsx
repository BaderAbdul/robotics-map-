import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { 
  Bot, Cpu, Code, Zap, Eye, Server, Map, X, ExternalLink, 
  PlayCircle, BookOpen, Wrench, MessageSquare, Send, Sparkles, Loader2 
} from 'lucide-react';

// --- إعدادات Gemini API ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 

const fetchGeminiWithRetry = async (prompt: string, systemInstruction: string = "") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  }; 

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return `[تفاصيل العطل من جوجل]: ${errorData.error?.message || "خطأ غير معروف في السيرفر"}`;
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من صياغة إجابة.";
  } catch (error: any) {
    return `[عطل في الشبكة أو المتصفح]: ${error.message}`;
  }
};

// --- تعريف الأنواع ---
interface Resource {
  type: string;
  title: string;
  url: string;
}

interface Stage {
  id: number;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  difficulty: string;
  difficultyColor: string;
  description: string;
  resources: Resource[];
  project: string;
  hint?: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

// --- بيانات خارطة الطريق ---
const roadmapData: Stage[] = [
  {
    id: 1,
    title: 'أساسيات الإلكترونيات',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400',
    difficulty: 'مبتدئ',
    difficultyColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'قبل بناء أي روبوت، يجب أن تفهم كيف تتدفق الكهرباء. تعلم أساسيات الجهد، التيار، المقاومة، وكيفية استخدام لوحة التجارب (Breadboard).',
    resources: [
      { type: 'video', title: 'مقدمة في الإلكترونيات للمبتدئين', url: '#' },
      { type: 'article', title: 'كيف تقرأ الدوائر الكهربائية؟', url: '#' }
    ],
    project: 'إضاءة LED باستخدام زر ضغاط ومقاومة، وقياس الجهد بالملتيميتر.'
  },
  {
    id: 2,
    title: 'المتحكمات الدقيقة (Microcontrollers)',
    icon: Cpu,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400',
    difficulty: 'مبتدئ',
    difficultyColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'المتحكم هو "عقل" الروبوت. هنا تبدأ رحلتك مع Arduino و ESP32 لربط المكونات الإلكترونية بالبرمجة.',
    hint: '💡 تلميح: بناءً على ما تعلمناه في معسكر المتحكمات الدقيقة الأخير، هنا تبدأ رحلتك الحقيقية.',
    resources: [
      { type: 'video', title: 'مراجعة المعسكر: مقدمة في المتحكمات الدقيقة', url: '#' },
      { type: 'course', title: 'دورة أردوينو الشاملة', url: '#' }
    ],
    project: 'برمجة إشارة مرور ضوئية باستخدام Arduino Uno.'
  },
  {
    id: 3,
    title: 'أساسيات البرمجة للروبوتات',
    icon: Code,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400',
    difficulty: 'متوسط',
    difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'تعلم لغات البرمجة الأساسية للروبوتات. C/C++ لبرمجة المتحكمات الدقيقة (Low-level)، و Python للذكاء الاصطناعي وأنظمة الروبوتات المتقدمة.',
    resources: [
      { type: 'course', title: 'C++ for Hardware', url: '#' },
      { type: 'article', title: 'لماذا بايثون مهمة في الروبوتات؟', url: '#' }
    ],
    project: 'كتابة كود برمجي (Algorithm) لفرز الأرقام، كتمهيد لمنطق البرمجة.'
  },
  {
    id: 4,
    title: 'المحركات والمستشعرات',
    icon: Wrench,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400',
    difficulty: 'متوسط',
    difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'كيف يتحرك الروبوت وكيف يشعر بمحيطه؟ تعلم استخدام محركات DC، السيرفو، الخطوية (Stepper)، وحساسات المسافة (Ultrasonic) والخطوط (IR).',
    resources: [
      { type: 'video', title: 'كيف تختار المحرك المناسب لروبوتك؟', url: '#' },
      { type: 'course', title: 'دورة الحساسات التفاعلية', url: '#' }
    ],
    project: 'بناء روبوت متتبع للخط (Line Follower Robot) أو روبوت يتجنب الحواجز.'
  },
  {
    id: 5,
    title: 'أنظمة التشغيل المتقدمة (ROS & RPi)',
    icon: Server,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400',
    difficulty: 'متقدم',
    difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'الانتقال من الروبوتات البسيطة إلى الروبوتات الذكية. تعلم استخدام حواسيب اللوحة الواحدة (Raspberry Pi) ونظام تشغيل الروبوتات (ROS).',
    resources: [
      { type: 'course', title: 'مقدمة في ROS2', url: '#' },
      { type: 'article', title: 'الفرق بين Arduino و Raspberry Pi', url: '#' }
    ],
    project: 'إعداد بيئة ROS على Raspberry Pi وتحريك روبوت افتراضي (Turtlesim).'
  },
  {
    id: 6,
    title: 'الذكاء الاصطناعي ورؤية الحاسب',
    icon: Eye,
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
    borderColor: 'border-teal-400',
    difficulty: 'متقدم',
    difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'إعطاء الروبوت القدرة على الرؤية واتخاذ القرارات المعقدة باستخدام مكتبات مثل OpenCV ونماذج تعلم الآلة.',
    resources: [
      { type: 'video', title: 'أساسيات Computer Vision', url: '#' },
      { type: 'video', title: 'الأذرع الروبوتية في المصانع الذكية (محتوى GDG Qassim)', url: '#' }
    ],
    project: 'برمجة كاميرا للتعرف على الوجوه أو تتبع كرة ملونة وتوجيه الكاميرا نحوها.'
  }
];

export default function App() {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [aiProjectIdea, setAiProjectIdea] = useState<string>("");
  const [isGeneratingProject, setIsGeneratingProject] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'مرحباً بك في مجتمع GDG Qassim! أنا المساعد "روبو" 🤖. كيف يمكنني مساعدتك في مجال الروبوتات والإلكترونيات اليوم؟' }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    setAiProjectIdea("");
  }, [selectedStage]);

  const generateAiProject = async () => {
    if (!selectedStage) return;
    setIsGeneratingProject(true);
    setAiProjectIdea("");
    
    const prompt = `أعطني فكرة مشروع واحدة مبتكرة وممتعة لطلاب الجامعة لتطبيقها في مجال: "${selectedStage.title}". 
    يجب أن يكون المشروع عملياً ومناسباً للمبتدئين أو المتوسطين. 
    قدم الفكرة في 3 أسطر كحد أقصى، واذكر القطع الرئيسية المطلوبة باختصار. 
    تحدث باللغة العربية بطريقة مشجعة.`;
    
    const result = await fetchGeminiWithRetry(prompt);
    if (result) setAiProjectIdea(result);
    setIsGeneratingProject(false);
  };

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput("");
    setIsTyping(true);

    const systemPrompt = `أنت مساعد ذكي خبير في الروبوتات والإلكترونيات، واسمك "روبو". 
    أنت جزء من قسم الروبوتات في مجتمع مطوري جوجل بجامعة القصيم (GDG Qassim). 
    مهمتك مساعدة الطلاب في تعلم الروبوتات، الأردوينو، الإلكترونيات، والذكاء الاصطناعي. 
    أجب بإيجاز (لا تتجاوز 4 أسطر)، وبطريقة ودية ومحفزة باللغة العربية.`;

    const aiResponse = await fetchGeminiWithRetry(userMessage, systemPrompt);
    
    if (aiResponse) setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
  };

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
            {roadmapData.map((stage, index) => {
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

          {/* الحقوق مقسمة باحترافية */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 mb-4">
            <p className="text-slate-300 text-sm">
              برمجة وتطوير الموقع: <span className="text-blue-400 font-bold tracking-wide">بدر الدخيل الله</span> ⚡
            </p>
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <p className="text-slate-300 text-sm">
              إعداد المسار والمحتوى: <span className="text-teal-400 font-bold tracking-wide">فريق الروبوتات</span> 🤖
            </p>
          </div>

          {/* لوحة شرف مصغرة بأسماء الفريق */}
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


      {/* --- Modal / Popup Details --- */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div 
            className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-bl from-slate-900 to-slate-800`}>
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${selectedStage.bgColor} ${selectedStage.color}`}>
                  {selectedStage.icon && <selectedStage.icon className="w-8 h-8" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-400">المرحلة 0{selectedStage.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedStage.difficultyColor}`}>
                      {selectedStage.difficulty}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedStage.title}</h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStage(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" /> نظرة عامة
                </h3>
                <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  {selectedStage.description}
                </p>
                {selectedStage.hint && (
                  <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg text-blue-300 text-sm font-medium flex items-start gap-2">
                     <span className="block mt-0.5">{selectedStage.hint}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-red-400" /> مصادر التعلم
                </h3>
                <div className="grid gap-3">
                  {selectedStage.resources.map((res: Resource, idx: number) => (
                    <a 
                      key={idx}
                      href={res.url}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-500 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {res.type === 'video' ? <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-red-400" /> : <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />}
                        <span className="text-slate-300 group-hover:text-white font-medium">{res.title}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white -rotate-90 rtl:rotate-180" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-yellow-400" /> المشاريع التطبيقية
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 text-slate-200">
                    <span className="text-xs font-bold text-slate-400 block mb-2">مشروع أساسي:</span>
                    {selectedStage.project}
                  </div>

                  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-5 rounded-xl border border-blue-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <span className="text-sm font-bold text-blue-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> فكرة مبتكرة بالذكاء الاصطناعي
                      </span>
                      {!aiProjectIdea && !isGeneratingProject && (
                        <button 
                          onClick={generateAiProject}
                          className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-lg shadow-blue-900/50"
                        >
                          ولد فكرة الآن
                        </button>
                      )}
                    </div>

                    <div className="relative z-10">
                      {isGeneratingProject ? (
                        <div className="flex flex-col items-center justify-center py-6 gap-3 text-blue-400">
                          <Loader2 className="w-8 h-8 animate-spin" /> 
                          <span className="text-sm font-medium animate-pulse">روبو يقوم بتوصيل الأسلاك وتلحيم فكرة المشروع... ⚡</span>
                        </div>
                      ) : aiProjectIdea ? (
                        <div className="text-slate-200 leading-relaxed text-sm bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                          {aiProjectIdea}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-sm mt-2">اضغط على الزر للحصول على فكرة مشروع إضافية ومخصصة بواسطة "روبو".</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- Chatbot Section --- */}
      <div className="fixed bottom-6 left-6 z-40">
        {isChatOpen && (
          <div className="absolute bottom-16 left-0 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-left">
            <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-full relative">
                   <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-slate-800"></span>
                   <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">المساعد "روبو"</h4>
                  <p className="text-[10px] text-green-400 font-medium tracking-wide">متصل وجاهز للمساعدة</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-80 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
              {chatMessages.map((msg: ChatMessage, idx: number) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-slate-800/80 border-t border-slate-700 flex items-center gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="اسألني عن الأردوينو، الإلكترونيات..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-2.5 rounded-xl transition-all flex items-center justify-center shadow-md shadow-blue-900/20 active:scale-95"
              >
                <Send className="w-5 h-5 -ml-1 rtl:ml-0 rtl:-mr-1 rtl:rotate-180" />
              </button>
            </form>
          </div>
        )}

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
            isChatOpen ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/40'
          }`}
        >
          {!isChatOpen && (
            <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30"></span>
          )}
          {isChatOpen ? <X className="w-6 h-6 z-10" /> : <MessageSquare className="w-6 h-6 z-10" />}
        </button>
      </div>

    </div>
  );
}
