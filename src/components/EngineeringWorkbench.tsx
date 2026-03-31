// src/components/EngineeringWorkbench.tsx
import { useState } from 'react';
import { Wrench, X, ShoppingCart, Loader2, Sparkles, Clipboard, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGeminiWithRetry } from '../services/gemini';
import InteractivePinout from './InteractivePinout';

type ToolTab = 'debugger' | 'bom' | 'pinout';

export default function EngineeringWorkbench() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ToolTab>('debugger');
  
  const [codeToDebug, setCodeToDebug] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [debugResponse, setDebugResponse] = useState<string>("");
  const [isDebugging, setIsDebugging] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const [bomProjectRequest, setBomProjectRequest] = useState<string>("");
  const [bomResponse, setBomResponse] = useState<string>("");
  const [isGeneratingBom, setIsGeneratingBom] = useState<boolean>(false);

  const handleDebug = async () => {
    if (!codeToDebug.trim()) return;
    setIsDebugging(true);
    setDebugResponse("");
    const systemPrompt = `أنت مهندس نظم مدمجة. حلل الكود:\n\`\`\`cpp\n${codeToDebug}\n\`\`\`\nوصف المشكلة: ${problemDescription}\nاكتشف الخطأ واشرحه بالعربية باختصار، وقدم الكود المصحح في قالب \`\`\`cpp\`.`;
    const aiResponse = await fetchGeminiWithRetry(codeToDebug, systemPrompt);
    if (aiResponse) setDebugResponse(aiResponse);
    setIsDebugging(false);
  };

  const handleGenerateBom = async () => {
    if (!bomProjectRequest.trim()) return;
    setIsGeneratingBom(true);
    setBomResponse("");
    const systemPrompt = `طلب المستخدم: ${bomProjectRequest}\nولد قائمة مشتريات (BOM) أساسية كقائمة نقطية بالعربية مع ذكر الكمية وسبب الحاجة باختصار.`;
    const aiResponse = await fetchGeminiWithRetry(bomProjectRequest, systemPrompt);
    if (aiResponse) setBomResponse(aiResponse);
    setIsGeneratingBom(false);
  };

  const extractCorrectedCode = (text: string) => {
    const match = text.match(/```cpp([\s\S]*?)```/);
    return match ? match[1].trim() : "";
  };

  const copyCodeToClipboard = () => {
    const code = extractCorrectedCode(debugResponse);
    if(code) {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const clearDebugger = () => {
    setCodeToDebug(""); setProblemDescription(""); setDebugResponse("");
  }

  return (
    // الزر الآن في اليمين بشكل صحيح
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-10 z-50">
      
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-700 hover:bg-slate-600' : 'bg-green-600 hover:bg-green-500'}`}
      >
        <AnimatePresence mode="wait">
            {isOpen ? (
                <motion.div key="close" initial={{opacity:0, rotate:-90}} animate={{opacity:1, rotate:0}} exit={{opacity:0, rotate:90}} transition={{duration:0.2}}><X className="w-5 h-5 sm:w-6 sm:h-6 z-10" /></motion.div>
            ) : (
                <motion.div key="wrench" initial={{opacity:0, rotate:90}} animate={{opacity:1, rotate:0}} exit={{opacity:0, rotate:-90}} transition={{duration:0.2}}><Wrench className="w-5 h-5 sm:w-6 sm:h-6 z-10" /></motion.div>
            )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            // تعديل الأنميشن ليظهر من الأسفل بدلاً من اليسار
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            // السر هنا: تم تغيير left-0 إلى right-0 لتبقى النافذة داخل الشاشة
            className="absolute bottom-16 sm:bottom-20 right-0 origin-bottom-right w-[calc(100vw-2rem)] sm:w-[450px] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh] sm:max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-slate-800/80 p-3 sm:p-5 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-green-500/20 p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
                   <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">عِدة المهندس الذكية</h4>
                  <p className="text-[9px] sm:text-[11px] text-slate-400">أدوات مدعومة بالذكاء الاصطناعي</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 p-1.5 rounded-lg transition-colors">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 sm:gap-6 border-b border-slate-800/80 px-2 sm:px-6 pt-3 sm:pt-4 bg-slate-900/80 overflow-x-auto custom-scrollbar">
                <button onClick={() => setActiveTab('debugger')} className={`pb-2 sm:pb-3 text-[11px] sm:text-sm font-medium transition-colors border-b-2 relative whitespace-nowrap px-1 ${activeTab === 'debugger' ? 'text-teal-400 border-teal-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
                    مصحح الأكواد
                </button>
                <button onClick={() => setActiveTab('bom')} className={`pb-2 sm:pb-3 text-[11px] sm:text-sm font-medium transition-colors border-b-2 relative whitespace-nowrap px-1 ${activeTab === 'bom' ? 'text-teal-400 border-teal-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
                    مقترح القطع
                </button>
                <button onClick={() => setActiveTab('pinout')} className={`pb-2 sm:pb-3 text-[11px] sm:text-sm font-medium transition-colors border-b-2 relative whitespace-nowrap px-1 ${activeTab === 'pinout' ? 'text-teal-400 border-teal-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
                    عارض تفاعلي للوحة
                </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow custom-scrollbar space-y-4 sm:space-y-5">
                
                {/* 1. المصحح */}
                {activeTab === 'debugger' && (
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                             <label className="text-xs sm:text-sm font-medium text-slate-300">الصق كود الأردوينو هنا (C++):</label>
                             <button onClick={clearDebugger} className="text-[10px] sm:text-xs text-slate-500 hover:text-red-400 flex items-center gap-1"><Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> مسح</button>
                        </div>
                        <textarea 
                            value={codeToDebug} onChange={(e) => setCodeToDebug(e.target.value)}
                            placeholder="void setup() { ..."
                            className="w-full h-32 sm:h-40 bg-slate-950/50 border border-slate-700 rounded-xl p-3 sm:p-4 text-[11px] sm:text-xs font-mono text-green-300 focus:outline-none focus:border-green-500 custom-scrollbar"
                            disabled={isDebugging}
                        />
                        <input 
                            type="text" value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)}
                            placeholder="صف المشكلة (اختياري)..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-green-500"
                            disabled={isDebugging}
                        />
                        <button 
                            onClick={handleDebug} disabled={!codeToDebug.trim() || isDebugging}
                            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-base"
                        >
                           {isDebugging ? <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> السحر يعمل...</> : <><Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> صحح الكود</>}
                        </button>

                        {debugResponse && (
                            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 bg-slate-800/50 p-4 sm:p-5 rounded-xl border border-slate-700">
                                <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" /> تحليل "روبو":</h5>
                                <div className="text-slate-300 text-[11px] sm:text-xs leading-relaxed whitespace-pre-line">
                                    {debugResponse.replace(/```cpp[\s\S]*?```/, '')}
                                </div>
                                {extractCorrectedCode(debugResponse) && (
                                    <div className="relative mt-3 sm:mt-4">
                                        <button onClick={copyCodeToClipboard} className="absolute top-2 left-2 bg-slate-700/80 hover:bg-slate-600 text-slate-300 p-1.5 rounded-md transition-colors z-10">
                                            {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                                        </button>
                                        <pre className="bg-slate-950 p-3 sm:p-4 rounded-lg text-[10px] sm:text-[11px] font-mono text-green-300 overflow-x-auto custom-scrollbar border border-slate-700/50 pt-8">
                                            {extractCorrectedCode(debugResponse)}
                                        </pre>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                )}

                {/* 2. المقترح */}
                {activeTab === 'bom' && (
                    <div className="space-y-3 sm:space-y-4">
                        <label className="text-xs sm:text-sm font-medium text-slate-300 block">ماذا تريد أن تصنع؟</label>
                        <input 
                            type="text" value={bomProjectRequest} onChange={(e) => setBomProjectRequest(e.target.value)}
                            placeholder="مثال: ذراع روبوتية..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
                            disabled={isGeneratingBom}
                        />
                        <button 
                            onClick={handleGenerateBom} disabled={!bomProjectRequest.trim() || isGeneratingBom}
                            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-base"
                        >
                           {isGeneratingBom ? <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> جاري التجهيز...</> : <><ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> اقترح القطع</>}
                        </button>

                        {bomResponse && (
                            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 bg-slate-800/50 p-4 sm:p-5 rounded-xl border border-slate-700">
                                <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2"><ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" /> القائمة المقترحة:</h5>
                                <div className="text-slate-300 text-[11px] sm:text-xs leading-relaxed space-y-2 whitespace-pre-line">
                                    {bomResponse}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* 3. اللوحة */}
                {activeTab === 'pinout' && (
                    <div className="-mx-2 sm:mx-0">
                        <InteractivePinout />
                    </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}