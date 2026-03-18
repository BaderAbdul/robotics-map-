// src/components/InteractivePinout.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Hash, PowerOff } from 'lucide-react';

// تعريف بيانات الأقطاب
const pins = [
  // أقطاب الطاقة (يسار)
  { id: '3v3', name: '3.3V', type: 'power', icon: Zap, color: 'text-orange-400', bgColor: 'bg-orange-500', desc: 'مخرج طاقة 3.3 فولت للحساسات الدقيقة.' },
  { id: '5v', name: '5V', type: 'power', icon: Zap, color: 'text-red-400', bgColor: 'bg-red-500', desc: 'مخرج طاقة 5 فولت الأساسي لتشغيل معظم القطع.' },
  { id: 'gnd1', name: 'GND', type: 'gnd', icon: PowerOff, color: 'text-slate-400', bgColor: 'bg-slate-500', desc: 'القطب السالب (الأرضي) لإكمال الدائرة الكهربائية.' },
  { id: 'vin', name: 'Vin', type: 'power', icon: Zap, color: 'text-red-500', bgColor: 'bg-red-600', desc: 'مدخل طاقة لتشغيل اللوحة ببطارية خارجية (7-12 فولت).' },
  
  // أقطاب تناظرية (أسفل)
  { id: 'a0', name: 'A0', type: 'analog', icon: Activity, color: 'text-green-400', bgColor: 'bg-green-500', desc: 'مدخل تناظري لقراءة الحساسات المتغيرة (مثل الحرارة والضوء).' },
  { id: 'a1', name: 'A1', type: 'analog', icon: Activity, color: 'text-green-400', bgColor: 'bg-green-500', desc: 'مدخل تناظري (Analog In).' },
  { id: 'a2', name: 'A2', type: 'analog', icon: Activity, color: 'text-green-400', bgColor: 'bg-green-500', desc: 'مدخل تناظري (Analog In).' },
  
  // أقطاب رقمية و PWM (يمين)
  { id: 'd13', name: '13', type: 'digital', icon: Hash, color: 'text-blue-400', bgColor: 'bg-blue-500', desc: 'مخرج/مدخل رقمي (يحتوي على LED مدمج باللوحة).' },
  { id: 'd11', name: '~11', type: 'pwm', icon: Activity, color: 'text-purple-400', bgColor: 'bg-purple-500', desc: 'مخرج PWM (نبضات) للتحكم بسرعة المحركات أو إضاءة LED.' },
  { id: 'd9', name: '~9', type: 'pwm', icon: Activity, color: 'text-purple-400', bgColor: 'bg-purple-500', desc: 'مخرج PWM تناظري زائف.' },
  { id: 'd2', name: '2', type: 'digital', icon: Hash, color: 'text-blue-400', bgColor: 'bg-blue-500', desc: 'مخرج/مدخل رقمي (يدعم المقاطعة Interrupt).' },
];

export default function InteractivePinout() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const activePinData = pins.find(p => p.id === hoveredPin);

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-slate-400 text-xs text-center">مرر الماوس (أو المس) أي قطب على اللوحة لمعرفة وظيفته التحذيرية والاستخدام الصحيح.</p>
      
      {/* اللوحة التفاعلية (Arduino Mockup) */}
      <div className="relative w-48 h-64 bg-teal-900 border-2 border-teal-700 rounded-lg shadow-2xl shadow-teal-900/20 flex flex-col items-center justify-between p-4">
        <div className="absolute top-2 left-2 text-[10px] font-bold text-teal-600/50">ROBO-UNO</div>
        <div className="w-12 h-12 bg-slate-800 border border-slate-600 rounded flex items-center justify-center absolute top-4 right-4">
           <div className="w-6 h-6 bg-slate-400 rounded-full opacity-20"></div>
        </div>
        <div className="w-16 h-8 bg-slate-300 rounded-sm absolute bottom-4 left-[-10px] shadow-md"></div>

        {/* أقطاب اليسار (الطاقة) */}
        <div className="absolute left-1 top-16 flex flex-col gap-1.5">
          {pins.filter(p => ['power', 'gnd'].includes(p.type)).map(pin => (
            <div key={pin.id} className="flex items-center gap-2 group cursor-crosshair" onMouseEnter={() => setHoveredPin(pin.id)} onMouseLeave={() => setHoveredPin(null)}>
              <span className={`text-[9px] font-mono transition-colors ${hoveredPin === pin.id ? pin.color : 'text-slate-400'}`}>{pin.name}</span>
              <div className={`w-3 h-3 rounded-sm border ${hoveredPin === pin.id ? `${pin.bgColor} border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]` : 'bg-slate-800 border-slate-600'} transition-all`}></div>
            </div>
          ))}
        </div>

        {/* أقطاب اليمين (الرقمية و PWM) */}
        <div className="absolute right-1 top-16 flex flex-col gap-1.5 items-end">
          {pins.filter(p => ['digital', 'pwm'].includes(p.type)).map(pin => (
            <div key={pin.id} className="flex items-center gap-2 group cursor-crosshair" onMouseEnter={() => setHoveredPin(pin.id)} onMouseLeave={() => setHoveredPin(null)}>
              <div className={`w-3 h-3 rounded-sm border ${hoveredPin === pin.id ? `${pin.bgColor} border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]` : 'bg-slate-800 border-slate-600'} transition-all`}></div>
              <span className={`text-[9px] font-mono transition-colors ${hoveredPin === pin.id ? pin.color : 'text-slate-400'}`}>{pin.name}</span>
            </div>
          ))}
        </div>

        {/* أقطاب الأسفل (التناظرية) */}
        <div className="absolute bottom-2 right-12 flex gap-1.5">
          {pins.filter(p => p.type === 'analog').map(pin => (
            <div key={pin.id} className="flex flex-col items-center gap-1 group cursor-crosshair" onMouseEnter={() => setHoveredPin(pin.id)} onMouseLeave={() => setHoveredPin(null)}>
              <div className={`w-3 h-3 rounded-sm border ${hoveredPin === pin.id ? `${pin.bgColor} border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]` : 'bg-slate-800 border-slate-600'} transition-all`}></div>
              <span className={`text-[9px] font-mono transition-colors ${hoveredPin === pin.id ? pin.color : 'text-slate-400'}`}>{pin.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* بطاقة الشرح الديناميكية */}
      <div className="h-28 w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activePinData ? (
            <motion.div 
              key={activePinData.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="flex items-start gap-3 w-full"
            >
              <div className={`p-2 rounded-lg ${activePinData.bgColor} bg-opacity-20`}>
                <activePinData.icon className={`w-5 h-5 ${activePinData.color}`} />
              </div>
              <div>
                <h5 className={`text-sm font-bold mb-1 ${activePinData.color}`}>قطب {activePinData.name}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{activePinData.desc}</p>
              </div>
            </motion.div>
          ) : (
             <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-slate-500 font-medium">
                قم بتحديد أحد الأقطاب على اللوحة لعرض الشرح.
             </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}