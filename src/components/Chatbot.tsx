// src/components/Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Bot, X, MessageSquare, Send } from 'lucide-react';
import type { ChatMessage } from '../types';
import { fetchGeminiWithRetry } from '../services/gemini';

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  // استرجاع المحادثات السابقة من التخزين المحلي إن وجدت
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('roboChatMessages');
    return saved ? JSON.parse(saved) : [
      { role: 'ai', text: 'مرحباً بك في مجتمع GDG Qassim! أنا المساعد "روبو" 🤖. كيف يمكنني مساعدتك اليوم؟' }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // حفظ المحادثات عند أي تغيير
  useEffect(() => {
    localStorage.setItem('roboChatMessages', JSON.stringify(chatMessages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput("");
    setIsTyping(true);

    const systemPrompt = `أنت مساعد ذكي خبير في الروبوتات والإلكترونيات، واسمك "روبو". 
    أنت جزء من قسم الروبوتات في مجتمع مطوري جوجل بجامعة القصيم (GDG Qassim). 
    مهمتك مساعدة الطلاب في تعلم الروبوتات. أجب بإيجاز (لا تتجاوز 4 أسطر)، وبطريقة ودية.`;

    const aiResponse = await fetchGeminiWithRetry(userMessage, systemPrompt);
    
    if (aiResponse) setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {isChatOpen && (
        <div className="absolute bottom-16 left-0 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          {/* Header المحادثة */}
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

          {/* منطقة الرسائل */}
          <div className="h-80 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
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

          {/* صندوق الإدخال */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-800/80 border-t border-slate-700 flex items-center gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="اسألني عن الأردوينو، الإلكترونيات..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              disabled={isTyping}
            />
            <button type="submit" disabled={!chatInput.trim() || isTyping} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all flex items-center justify-center">
              <Send className="w-5 h-5 -ml-1 rtl:ml-0 rtl:-mr-1 rtl:rotate-180" />
            </button>
          </form>
        </div>
      )}

      {/* زر فتح الدردشة */}
      <button onClick={() => setIsChatOpen(!isChatOpen)} className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${isChatOpen ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-600 hover:bg-blue-500'}`}>
        {!isChatOpen && <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30"></span>}
        {isChatOpen ? <X className="w-6 h-6 z-10" /> : <MessageSquare className="w-6 h-6 z-10" />}
      </button>
    </div>
  );
}