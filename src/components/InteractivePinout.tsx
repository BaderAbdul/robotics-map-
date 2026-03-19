// src/components/InteractivePinout.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Hash, PowerOff } from 'lucide-react';

const pins = [
  // أقطاب الطاقة
  { id: '3v3', name: '3.3V', type: 'power', icon: Zap, color: 'text-orange-400', glow: 'shadow-[0_0_15px_#f97316]', desc: 'مخرج طاقة 3.3 فولت للحساسات الدقيقة.' },
  { id: '5v', name: '5V', type: 'power', icon: Zap, color: 'text-red-400', glow: 'shadow-[0_0_15px_#ef4444]', desc: 'مخرج طاقة 5 فولت الأساسي لتشغيل معظم القطع.' },
  { id: 'gnd1', name: 'GND', type: 'gnd', icon: PowerOff, color: 'text-slate-400', glow: 'shadow-[0_0_15px_#94a3b8]', desc: 'القطب السالب (الأرضي) لإكمال الدائرة الكهربائية.' },
  { id: 'vin', name: 'Vin', type: 'power', icon: Zap, color: 'text-red-500', glow: 'shadow-[0_0_15px_#ef4444]', desc: 'مدخل طاقة لتشغيل اللوحة ببطارية خارجية.' },
  
  // أقطاب تناظرية
  { id: 'a0', name: 'A0', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري (Analog In).' },
  { id: 'a1', name: 'A1', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري لقراءة الحساسات المتغيرة.' },
  { id: 'a2', name: 'A2', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري لقراءة الحساسات المتغيرة.' },
  
  // أقطاب رقمية و PWM
  { id: 'd13', name: '13', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج رقمي (يحتوي على LED مدمج باللوحة).' },
  { id: 'd11', name: '~11', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM (نبضات) للتحكم بسرعة المحركات.' },
  { id: 'd9', name: '~9', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM تناظري زائف (Pulse Width Modulation) للتحكم الدقيق.' },
  { id: 'd2', name: '2', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي (يدعم المقاطعة).' },
];

export default function InteractivePinout() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const activePinData = pins.find(p => p.id === hoveredPin);

  const PinSocket = ({ pin }: { pin: any }) => {
    const isHovered = hoveredPin === pin.id;
    return (
      <div 
        className="w-5 h-5 bg-[#0f172a] border border-slate-700/50 rounded-sm flex items-center justify-center cursor-pointer group relative transition-transform hover:scale-110 z-20"
        onMouseEnter={() => setHoveredPin(pin.id)} 
        onMouseLeave={() => setHoveredPin(null)}
      >
        {/* النقطة المضيئة (Glowing Dot) */}
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isHovered ? `bg-white ${pin.glow}` : 'bg-slate-700'}`}></div>
        
        {/* اسم القطب يظهر عند التمرير مثل الصورة */}
        <AnimatePresence>
          {isHovered && (
             <motion.div 
               initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: -15 }} exit={{ opacity: 0, y: -5 }}
               className={`absolute px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-700 whitespace-nowrap z-30 ${pin.color} ${pin.glow}`}
             >
               {pin.name}
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <p className="text-slate-400 text-xs text-center leading-relaxed">
        الآن هذا هو الأردوينو الحقيقي! مرر الماوس فوق المنافذ (Sockets) لمعرفة وظيفتها.
      </p>
      
      {/* حاوية اللوحة مع تأثير المنظور 3D */}
      <div className="relative w-full h-[280px] flex items-center justify-center" style={{ perspective: '1000px' }}>
        
        {/* اللوحة نفسها (مائلة بتقنية CSS 3D) */}
        <div 
          className="relative w-[320px] h-[220px] bg-[#1e5a60] rounded-xl shadow-[-20px_20px_30px_rgba(0,0,0,0.5)] border-2 border-[#164246] p-4 transition-transform duration-500 hover:rotate-x-[50deg] hover:rotate-z-[-25deg]"
          style={{ transform: 'rotateX(55deg) rotateZ(-30deg)', transformStyle: 'preserve-3d' }}
        >
          {/* تفاصيل اللوحة */}
          <div className="absolute top-2 left-2 text-[10px] font-extrabold text-white/30 tracking-widest">ARDUINO UNO</div>
          <div className="absolute bottom-2 right-2 text-[8px] font-bold text-white/20">GDG QASSIM</div>

          {/* منفذ الـ USB */}
          <div className="w-14 h-12 bg-slate-300 border border-slate-400 rounded-sm absolute bottom-2 left-[-10px] flex items-center justify-center" style={{ transform: 'translateZ(10px)' }}>
             <div className="w-10 h-6 bg-slate-100 rounded-sm border border-slate-300"></div>
          </div>

          {/* شريحة ATmega328P */}
          <div className="w-24 h-7 bg-[#0f172a] rounded-sm absolute center flex items-center justify-center shadow-lg" style={{ transform: 'translateZ(5px)' }}>
              <span className="text-[6px] font-mono text-slate-500">ATMEGA328P</span>
          </div>

          {/* صف المنافذ العلوي */}
          <div className="absolute top-2 right-2 flex flex-col items-end" style={{ transform: 'translateZ(8px)' }}>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-sm border border-white/10 backdrop-blur-sm">
              {pins.filter(p => ['digital', 'pwm'].includes(p.type)).map(pin => <PinSocket key={pin.id} pin={pin} />)}
            </div>
          </div>

          {/* صف المنافذ السفلي الأيمن */}
          <div className="absolute bottom-2 right-2 flex flex-col items-end" style={{ transform: 'translateZ(8px)' }}>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-sm border border-white/10 backdrop-blur-sm">
              {pins.filter(p => p.type === 'analog').map(pin => <PinSocket key={pin.id} pin={pin} />)}
            </div>
          </div>

          {/* صف المنافذ السفلي الأيسر */}
          <div className="absolute bottom-2 left-16 flex flex-col items-start" style={{ transform: 'translateZ(8px)' }}>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-sm border border-white/10 backdrop-blur-sm">
              {pins.filter(p => ['power', 'gnd'].includes(p.type)).map(pin => <PinSocket key={pin.id} pin={pin} />)}
            </div>
          </div>
        </div>
      </div>

      {/* بطاقة الشرح المطابقة للصورة المرفقة */}
      <div className="h-32 w-full bg-[#0b1120] border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex items-center shadow-xl">
        <AnimatePresence mode="wait">
          {activePinData ? (
            <motion.div 
              key={activePinData.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full gap-4"
            >
              <div className="flex-1 space-y-2">
                <h5 className="text-sm font-bold text-slate-300">
                  العنوان: <span className={`${activePinData.color} tracking-wider`}>قطب {activePinData.name}</span>
                </h5>
                <p className="text-xs text-slate-400 font-medium">الوصف:</p>
                <p className="text-sm text-slate-200 leading-relaxed font-bold">{activePinData.desc}</p>
              </div>
              <div className={`p-4 rounded-xl bg-slate-900 border border-slate-700/50 shadow-inner ${activePinData.glow}`}>
                <activePinData.icon className={`w-8 h-8 ${activePinData.color}`} />
              </div>
            </motion.div>
          ) : (
             <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-slate-500 font-medium text-center w-full">
                قم بتحديد أحد المنافذ على اللوحة لعرض الشرح.
             </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}