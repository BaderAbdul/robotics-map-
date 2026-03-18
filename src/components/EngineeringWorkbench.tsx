// src/components/EngineeringWorkbench.tsx
import { useState } from 'react';
import { Wrench, X, Terminal, ShoppingCart, Loader2, Sparkles, Clipboard, Check, Trash2, Cpu } from 'lucide-react';
// استيراد المكون الجديد
import InteractivePinout from './InteractivePinout';
import { Wrench, X, Terminal, ShoppingCart, Loader2, Sparkles, Clipboard, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGeminiWithRetry } from '../services/gemini';

type ToolTab = 'debugger' | 'bom' | 'pinout';

export default function EngineeringWorkbench() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ToolTab>('debugger');
  
  // -- ولاية مصحح الأكواد --
  const [codeToDebug, setCodeToDebug] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [debugResponse, setDebugResponse] = useState<string>("");
  const [isDebugging, setIsDebugging] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // -- ولاية مقترح القطع --
  const [bomProjectRequest, setBomProjectRequest] = useState<string>("");
  const [bomResponse, setBomResponse] = useState<string>("");
  const [isGeneratingBom, setIsGeneratingBom] = useState<boolean>(false);

  // دالة تصحيح الكود
  const handleDebug = async () => {
    if (!codeToDebug.trim()) return;
    setIsDebugging(true);
    setDebugResponse("");
    
    const systemPrompt = `أنت مهندس نظم مدمجة وأردوينو خبير. قمت بتحليل كود الأردوينو التالي الذي يواجه المستخدم مشكلة فيه:
    ---
    كود المستخدم:
    \`\`\`cpp
    ${codeToDebug}
    \`\`\`
    ---
    وصف المشكلة من المستخدم:
    ${problemDescription || 'لم يتم تقديم وصف للمشكلة.'}
    ---
    اكتشف الخطأ البرمجي (Bug) بدقة. اشرح الخطأ باللغة العربية بوضوح وبطريقة تعليمية مبسطة. قدم الكود المصحح بالكامل داخل قالب كود \`\`\`cpp ... \`\`\`.`;

    const aiResponse = await fetchGeminiWithRetry(codeToDebug, systemPrompt);
    if (aiResponse) setDebugResponse(aiResponse);
    setIsDebugging(false);
  };

  // دالة توليد قائمة القطع
  const handleGenerateBom = async () => {
    if (!bomProjectRequest.trim()) return;
    setIsGeneratingBom(true);
    setBomResponse("");

    const systemPrompt = `بناءً على طلب المستخدم التالي لصنع روبوت:
    ---
    طلب المستخدم:
    ${bomProjectRequest}
    ---
    قم بتوليد قائمة مشتريات (Bill of Materials - BOM) تقريبية ومبدئية. اذكر القطع الأساسية فقط المطلوبة لبدء المشروع (لا تذكر الأسلاك أو البراغي). قدم الإجابة على شكل قائمة نقطية بالعربية، واذكر بجوار كل قطعة الكمية التقريبية وسبب الحاجة إليها باختصار. تحدث بنبرة مشجعة هندسية.`;

    const aiResponse = await fetchGeminiWithRetry(bomProjectRequest, systemPrompt);
    if (aiResponse) setBomResponse(aiResponse);
    setIsGeneratingBom(false);
  };

  // تنسيق الكود المصحح لاستخراجه ونسخه
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
    setCodeToDebug("");
    setProblemDescription("");
    setDebugResponse("");
  }

  return (
    <div className="fixed bottom-6 left-24 z-40">
      {/* الزر العائم لصندوق العدة */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-700 hover:bg-slate-600' : 'bg-green-600 hover:bg-green-500'}`}
        title="صندوق عِدة المهندس الذكي"
      >
        <AnimatePresence mode="wait">
            {isOpen ? (
                <motion.div key="close" initial={{opacity:0, rotate:-90}} animate={{opacity:1, rotate:0}} exit={{opacity:0, rotate:90}} transition={{duration:0.2}}><X className="w-6 h-6 z-10" /></motion.div>
            ) : (
                <motion.div key="wrench" initial={{opacity:0, rotate:90}} animate={{opacity:1, rotate:0}} exit={{opacity:0, rotate:-90}} transition={{duration:0.2}}><Wrench className="w-6 h-6 z-10" /></motion.div>
            )}
        </AnimatePresence>
      </button>

      {/* لوحة صندوق العدة الجانبية */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-20 left-0 w-[450px] max-w-[90vw] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-slate-800/80 p-5 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2.5 rounded-xl">
                   <Wrench className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">عِدة المهندس الذكية</h4>
                  <p className="text-[11px] text-slate-400">أدوات مدعومة بالذكاء الاصطناعي لمشاريعك</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-800 bg-slate-900/50">
                <button onClick={() => setActiveTab('debugger')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-medium transition-colors border-b-2 ${activeTab === 'debugger' ? 'text-green-400 border-green-500 bg-green-950/20' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
                    <Terminal className="w-4 h-4" /> مصحح الأكواد
                </button>
                <button onClick={() => setActiveTab('bom')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-medium transition-colors border-b-2 ${activeTab === 'bom' ? 'text-teal-400 border-teal-500 bg-teal-950/20' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
                    <ShoppingCart className="w-4 h-4" /> مقترح القطع
                </button>
                {/* الزر الثالث الجديد */}
                <button onClick={() => setActiveTab('pinout')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-medium transition-colors border-b-2 ${activeTab === 'pinout' ? 'text-blue-400 border-blue-500 bg-blue-950/20' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>
                    <Cpu className="w-4 h-4" /> خريطة الأقطاب
                </button>
            </div>


            {/* Content Area */}
            <div className="p-6 overflow-y-auto flex-grow custom-scrollbar space-y-5">
                
                {/* 1. مصحح الأكواد AI Code Debugger */}
                {activeTab === 'debugger' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                             <label className="text-sm font-medium text-slate-300">الصق كود الأردوينو هنا (C++):</label>
                             <button onClick={clearDebugger} className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> مسح</button>
                        </div>
                        <textarea 
                            value={codeToDebug}
                            onChange={(e) => setCodeToDebug(e.target.value)}
                            placeholder="void setup() { ..."
                            className="w-full h-40 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-xs font-mono text-green-300 focus:outline-none focus:border-green-500 custom-scrollbar"
                            disabled={isDebugging}
                        />
                        <label className="text-sm font-medium text-slate-300 block">صف المشكلة (اختياري):</label>
                        <input 
                            type="text"
                            value={problemDescription}
                            onChange={(e) => setProblemDescription(e.target.value)}
                            placeholder="مثال: المحرك لا يدور، أو يظهر خطأ في السطر..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500"
                            disabled={isDebugging}
                        />
                        <button 
                            onClick={handleDebug} 
                            disabled={!codeToDebug.trim() || isDebugging}
                            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
                        >
                           {isDebugging ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري تحليل الكود وعمل السحر...</> : <><Sparkles className="w-5 h-5" /> صحح الكود بالعربي</>}
                        </button>

                        {/* نتيجة التصحيح */}
                        {debugResponse && (
                            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-6 space-y-3 bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                                <h5 className="text-sm font-bold text-white flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> تحليل ورأي "روبو":</h5>
                                <div className="text-slate-300 text-xs leading-relaxed space-y-2 whitespace-pre-line prose prose-invert prose-xs max-w-none">
                                    {debugResponse.replace(/```cpp[\s\S]*?```/, '')} {/* عرض الشرح فقط */}
                                </div>
                                
                                {extractCorrectedCode(debugResponse) && (
                                    <div className="relative mt-4">
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <button onClick={copyCodeToClipboard} className="bg-slate-700/80 hover:bg-slate-600 text-slate-300 p-1.5 rounded-lg transition-colors">
                                                {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Clipboard className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <pre className="bg-slate-950 p-4 rounded-lg text-[11px] font-mono text-green-300 overflow-x-auto custom-scrollbar border border-slate-700/50">
                                            {extractCorrectedCode(debugResponse)}
                                        </pre>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                )}

                {/* 2. المقترح الذكي للقطع (Smart BOM Generator) */}
                {activeTab === 'bom' && (
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-300 block">ماذا تريد أن تصنع؟</label>
                        <input 
                            type="text"
                            value={bomProjectRequest}
                            onChange={(e) => setBomProjectRequest(e.target.value)}
                            placeholder="مثال: روبوت يتجنب الحواجز، أو ذراع سلكية..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                            disabled={isGeneratingBom}
                        />
                        <button 
                            onClick={handleGenerateBom} 
                            disabled={!bomProjectRequest.trim() || isGeneratingBom}
                            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30"
                        >
                           {isGeneratingBom ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري تجهيز قائمة المشتريات...</> : <><Sparkles className="w-5 h-5" /> اقترح القطع اللازمة</>}
                        </button>

                        {/* نتيجة القائمة */}
                        {bomResponse && (
                            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-6 space-y-3 bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                                <h5 className="text-sm font-bold text-white flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-teal-400" /> القائمة المقترحة للمشروع:</h5>
                                <div className="text-slate-300 text-xs leading-relaxed space-y-2 prose prose-invert prose-xs max-w-none">
                                    {bomResponse}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
                {/* 3. خريطة الأقطاب التفاعلية */}
                {activeTab === 'pinout' && (
                    <InteractivePinout />
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}