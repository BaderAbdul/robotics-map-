// src/components/InteractivePinout.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Hash, PowerOff } from 'lucide-react';

const pins = [
  // أقطاب الطاقة (Bottom Left)
  { id: '3v3', name: '3.3V', type: 'power', icon: Zap, color: 'text-orange-400', bgColor: 'bg-orange-500', desc: 'مخرج طاقة 3.3 فولت للحساسات الدقيقة.' },
  { id: '5v', name: '5V', type: 'power', icon: Zap, color: 'text-red-400', bgColor: 'bg-red-500', desc: 'مخرج طاقة 5 فولت الأساسي لتشغيل معظم القطع.' },
  { id: 'gnd1', name: 'GND', type: 'gnd', icon: PowerOff, color: 'text-slate-400', bgColor: 'bg-slate-500', desc: 'القطب السالب (الأرضي) لإكمال الدائرة الكهربائية.' },
  { id: 'vin', name: 'Vin', type: 'power', icon: Zap, color: 'text-red-500', bgColor: 'bg-red-600', desc: 'مدخل طاقة لتشغيل اللوحة ببطارية خارجية (7-12 فولت).' },
  
  // أقطاب تناظرية (Bottom Right)
  { id: 'a0', name: 'A0', type: 'analog', icon: Activity, color: 'text-green-400', bgColor: 'bg-green-500', desc: 'مدخل تناظري (Analog In).' },
  { id: 'a1', name: 'A1', type: 'analog', icon: Activity, color: 'text-green-400', bgColor: 'bg-green-500', desc: 'مدخل تناظري لقراءة الحساسات المتغيرة.' },
  { id: 'a2', name: 'A2', type: 'analog', icon: Activity, color: 'text-green-400', bgColor: 'bg-green-500', desc: 'مدخل تناظري لقراءة الحساسات المتغيرة.' },
  
  // أقطاب رقمية و PWM (Top Right)
  { id: 'd13', name: '13', type: 'digital', icon: Hash, color: 'text-blue-400', bgColor: 'bg-blue-500', desc: 'مخرج رقمي (يحتوي على LED مدمج باللوحة).' },
  { id: 'd11', name: '~11', type: 'pwm', icon: Activity, color: 'text-purple-400', bgColor: 'bg-purple-500', desc: 'مخرج PWM (نبضات) للتحكم بسرعة المحركات.' },
  { id: 'd9', name: '~9', type: 'pwm', icon: Activity, color: 'text-purple-400', bgColor: 'bg-purple-500', desc: 'مخرج PWM تناظري زائف.' },
  { id: 'd2', name: '2', type: 'digital', icon: Hash, color: 'text-blue-400', bgColor: 'bg-blue-500', desc: 'مخرج/مدخل رقمي (يدعم المقاطعة).' },
];

export default function InteractivePinout() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const activePinData = pins.find(p => p.id === hoveredPin);

  // دالة لرسم منفذ أسود (Pin Socket)
  const PinSocket = ({ pin }: { pin: any }) => {
    const isHovered = hoveredPin === pin.id;
    return (
      <div 
        className="w-4 h-4 bg-slate-950 border border-slate-700 rounded-sm flex items-center justify-center cursor-crosshair group relative"
        onMouseEnter={() => setHoveredPin(pin.id)} 
        onMouseLeave={() => setHoveredPin(null)}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${isHovered ? `${pin.bgColor} shadow-[0_0_10px_#fff]` : 'bg-slate-600'} transition-all duration-150`}></div>
        {/* التسمية التوضيحية البصرية (Label) */}
        <span className={`absolute -top-4 text-[9px] font-mono font-bold transition-colors ${isHovered ? pin.color : 'text-slate-400'}`}>
          {pin.name}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-slate-400 text-xs text-center leading-relaxed">الآن هذا هو الأردوينو الحقيقي! مرر الماوس فوق المنافذ (Sockets) لمعرفة وظيفتها.</p>
      
      {/* نموذج Arduino Uno R3 واقعي (مصمم بـ CSS) */}
      <div className="relative w-[380px] h-[260px] bg-[#008184] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] border-2 border-[#006a6c] p-4 overflow-visible origin-center scale-90 sm:scale-100">
        
        {/* لون النحاس الخفي وتفاصيل الـ PCB */}
        <div className="absolute inset-0 bg-[radial-gradient(#00979c_1px,transparent_1px)] bg-[size:10px_10px] opacity-30 rounded-xl"></div>
        <div className="absolute top-3 left-4 text-[11px] font-extrabold text-white/50 tracking-widest">ARDUINO UNO R3</div>
        <div className="absolute bottom-3 right-4 text-[9px] font-bold text-white/20">GDG QASSIM EDITION</div>

        {/* --- المكونات المادية الكبيرة (منافذ الطاقة والـ USB) --- */}
        
        {/* مقبس الطاقة الأسود (Power Jack) */}
        <div className="w-10 h-14 bg-black border-2 border-slate-800 rounded-r-md absolute top-[-5px] left-[-2px] shadow-lg flex items-center justify-center">
           <div className="w-6 h-6 bg-slate-900 rounded-full border border-slate-700"></div>
        </div>

        {/* منفذ الـ USB الفضي */}
        <div className="w-16 h-12 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 border border-slate-400 rounded-sm absolute bottom-4 left-[-10px] shadow-2xl flex items-center justify-center">
           <div className="w-12 h-8 bg-slate-100 rounded-sm border border-slate-300 flex items-center justify-center">
             <div className="w-8 h-4 bg-slate-300 rounded-sm"></div>
           </div>
        </div>

        {/* شريحة ATmega328P (المتحكم الرئيسي الطويل) */}
        <div className="w-28 h-8 bg-slate-950 border border-slate-800 rounded-sm absolute center flex items-center justify-center p-1 shadow-inner">
           <div className="w-24 h-5 bg-slate-900 rounded-sm border-t border-slate-700 flex items-center justify-center">
              <span className="text-[7px] font-mono text-slate-500">ATMEGA328P</span>
              <div className="w-1.5 h-1.5 bg-slate-700 rounded-full absolute top-1 left-1"></div>
           </div>
        </div>

        {/* --- منافذ التوصيل (Header Sockets) - أماكن الأقطاب الفعلية --- */}

        {/* صف المنافذ العلوي (Digital / PWM) */}
        <div className="absolute top-2 right-4 flex flex-col items-end">
          <span className="text-[9px] font-bold text-white/70 mb-1">DIGITAL (PWM ~)</span>
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-sm shadow-md">
            {pins.filter(p => ['digital', 'pwm'].includes(p.type)).map(pin => (
              <PinSocket key={pin.id} pin={pin} />
            ))}
          </div>
        </div>

        {/* صف المنافذ السفلي الأيمن (Analog In) */}
        <div className="absolute bottom-2 right-4 flex flex-col items-end">
          <span className="text-[9px] font-bold text-white/70 mb-1">ANALOG IN</span>
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-sm shadow-md">
            {pins.filter(p => p.type === 'analog').map(pin => (
              <PinSocket key={pin.id} pin={pin} />
            ))}
          </div>
        </div>

        {/* صف المنافذ السفلي الأيسر (Power) */}
        <div className="absolute bottom-2 left-20 flex flex-col items-start">
          <span className="text-[9px] font-bold text-white/70 mb-1">POWER</span>
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-sm shadow-md">
            {pins.filter(p => ['power', 'gnd'].includes(p.type)).map(pin => (
              <PinSocket key={pin.id} pin={pin} />
            ))}
          </div>
        </div>

        {/* زر Reset الأحمر */}
        <div className="w-4 h-4 bg-red-600 rounded-full absolute bottom-4 left-6 border-2 border-red-800 shadow-md"></div>

      </div>

      {/* بطاقة الشرح الديناميكية */}
      <div className="h-28 w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex items-center justify-center shadow-inner">
        <AnimatePresence mode="wait">
          {activePinData ? (
            <motion.div 
              key={activePinData.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
              className="flex items-start gap-4 w-full"
            >
              <div className={`p-3 rounded-xl ${activePinData.bgColor} bg-opacity-20 border border-${activePinData.bgColor.split('-')[1]}-500/30`}>
                <activePinData.icon className={`w-6 h-6 ${activePinData.color}`} />
              </div>
              <div className="flex-1">
                <h5 className={`text-sm font-bold mb-1.5 ${activePinData.color}`}>قطب {activePinData.name}</h5>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{activePinData.desc}</p>
              </div>
            </motion.div>
          ) : (
             <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 opacity-50" /> قم بتحديد أحد المنافذ على اللوحة لعرض الشرح.
             </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}