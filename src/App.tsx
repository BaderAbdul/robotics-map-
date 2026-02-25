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
  }; // <--- هذا هو القوس الذي كان مفقوداً لإغلاق الدائرة

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // إذا رفضت جوجل الطلب، اقرأ سبب الرفض بدقة
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

// --- تعريف الأنواع (TypeScript Types) ---
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
  description: string;
  resources: Resource[];
  project: string;
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
    description: 'المتحكم هو "عقل" الروبوت. هنا تبدأ رحلتك مع Arduino و ESP32 لربط المكونات الإلكترونية بالبرمجة.',
    resources: [
      { type: 'video', title: 'تسجيل معسكر: مقدمة في المتحكمات الدقيقة (GDG_QU)', url: '#' },
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
    description: 'إعطاء الروبوت القدرة على الرؤية واتخاذ القرارات المعقدة باستخدام مكتبات مثل OpenCV ونماذج تعلم الآلة.',
    resources: [
      { type: 'video', title: 'أساسيات Computer Vision', url: '#' },
      { type: 'video', title: 'الأذرع الروبوتية في المصانع الذكية (محتوى GDG_QU)', url: '#' }
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
    { role: 'ai', text: 'مرحباً بك في مجتمع GDG_QU! أنا المساعد "روبو" 🤖. كيف يمكنني مساعدتك في مجال الروبوتات اليوم؟' }
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
    if (result) {
        setAiProjectIdea(result);
    }
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
    أنت جزء من قسم الروبوتات في مجتمع مطوري جوجل (GDG_QU). 
    مهمتك مساعدة الطلاب في تعلم الروبوتات، الأردوينو، الإلكترونيات، والذكاء الاصطناعي. 
    أجب بإيجاز (لا تتجاوز 4 أسطر)، وبطريقة ودية ومحفزة باللغة العربية.`;

    const aiResponse = await fetchGeminiWithRetry(userMessage, systemPrompt);
    
    if (aiResponse) {
        setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }
    setIsTyping(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
      
      {/* --- Header Section --- */}
      <header className="relative pt-16 pb-12 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-700 rounded-2xl mb-6 shadow-xl shadow-blue-900/20">
            <Bot className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
            خارطة طريق الروبوتات
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6">
            دليلك الشامل من الصفر وحتى احتراف بناء وبرمجة الروبوتات الذكية. مقدم لكم من قسم الروبوتات في مجتمع مطوري جوجل <span className="font-semibold text-white">GDG_QU</span>.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 text-sm text-slate-300">
            <Map className="w-4 h-4 text-yellow-400" />
            <span>انقر على أي مرحلة للبدء واستكشاف المصادر</span>
          </div>
        </div>
      </header>

      {/* --- Timeline Section --- */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="relative">
          <div className="absolute top-0 bottom-0 right-[28px] md:right-1/2 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-teal-500/50 rounded-full"></div>

          <div className="space-y-12">
            {roadmapData.map((stage, index) => {
              const Icon = stage.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={stage.id} className="relative flex items-center md:justify-between group">
                  <div className="absolute right-[16px] md:left-1/2 md:right-auto md:-translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border-4 border-slate-700 group-hover:border-blue-500 group-hover:scale-125 transition-all duration-300 z-10"></div>
                  
                  <div className={`w-full pl-16 md:pl-0 md:w-[45%] ${isEven ? 'md:text-left md:mr-auto' : 'md:text-right md:ml-auto'}`}>
                    <button 
                      onClick={() => setSelectedStage(stage)}
                      className={`w-full text-right p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden`}
                    >
                      <div className={`inline-flex p-3 rounded-xl ${stage.bgColor} ${stage.color} mb-4`}>
                        <Icon className="w-6 h-6" />
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

      {/* --- Modal / Popup Details --- */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div 
            className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-bl from-slate-900 to-slate-800`}>
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${selectedStage.bgColor} ${selectedStage.color}`}>
                  {selectedStage.icon && <selectedStage.icon className="w-8 h-8" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-400 block mb-1">المرحلة 0{selectedStage.id}</span>
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
                <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                  {selectedStage.description}
                </p>
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
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-800 hover:bg-slate-800 hover:border-slate-600 transition-all group"
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

                  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-xl border border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> اقتراح إضافي بالذكاء الاصطناعي
                      </span>
                      {!aiProjectIdea && !isGeneratingProject && (
                        <button 
                          onClick={generateAiProject}
                          className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          ولد فكرة الآن
                        </button>
                      )}
                    </div>

                    {isGeneratingProject ? (
                      <div className="flex items-center gap-2 text-slate-400 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> جاري التفكير في مشروع مميز...
                      </div>
                    ) : aiProjectIdea ? (
                      <div className="text-slate-200 leading-relaxed text-sm">
                        {aiProjectIdea}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">احصل على فكرة مشروع إضافية مخصصة لك بواسطة الذكاء الاصطناعي.</p>
                    )}
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
          <div className="absolute bottom-16 left-0 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-left">
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">المساعد "روبو"</h4>
                  <p className="text-xs text-green-400">متصل الآن</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-80 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar bg-slate-900/50">
              {chatMessages.map((msg: ChatMessage, idx: number) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
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
                  <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-slate-800 border-t border-slate-700 flex items-center gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="اسألني عن الروبوتات..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-2 rounded-xl transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5 -ml-1 rtl:ml-0 rtl:-mr-1 rtl:rotate-180" />
              </button>
            </form>
          </div>
        )}

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 ${
            isChatOpen ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
          }`}
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>

    </div>
  );
}
