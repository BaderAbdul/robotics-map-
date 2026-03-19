// src/components/InteractivePinout.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Hash, PowerOff, Unplug, RefreshCcw, Wifi, Cable } from 'lucide-react';

// تعريف بيانات جميع الأقطاب الـ 32 للوحة Arduino Uno R3
const pins = [
  // ==========================================
  // --- الصف العلوي (الديجيتال) - من اليمين لليسار ---
  // ==========================================
  
  // البلوك العلوي الأيمن (8 أقطاب من RX0 إلى 7)
  { id: 'rx', name: 'RX<-0', group: 'top_right', type: 'com', icon: Cable, textClass: 'text-slate-300', glow: 'shadow-[0_0_15px_#cbd5e1]', desc: 'قطب استقبال البيانات التسلسلي (Serial RX).' },
  { id: 'tx', name: 'TX->1', group: 'top_right', type: 'com', icon: Cable, textClass: 'text-slate-300', glow: 'shadow-[0_0_15px_#cbd5e1]', desc: 'قطب إرسال البيانات التسلسلي (Serial TX).' },
  { id: 'd2', name: '2', group: 'top_right', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج/مدخل رقمي (يدعم المقاطعة INT0).' },
  { id: 'd3', name: '~3', group: 'top_right', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج رقمي (PWM / يدعم المقاطعة INT1).' },
  { id: 'd4', name: '4', group: 'top_right', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج/مدخل رقمي.' },
  { id: 'd5', name: '~5', group: 'top_right', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج رقمي (PWM).' },
  { id: 'd6', name: '~6', group: 'top_right', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج رقمي (PWM).' },
  { id: 'd7', name: '7', group: 'top_right', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج/مدخل رقمي.' },

  // البلوك العلوي الأيسر (10 أقطاب من 8 إلى SCL)
  { id: 'd8', name: '8', group: 'top_left', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج/مدخل رقمي.' },
  { id: 'd9', name: '~9', group: 'top_left', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج رقمي (PWM).' },
  { id: 'd10', name: '~10', group: 'top_left', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج رقمي (PWM / SPI SS).' },
  { id: 'd11', name: '~11', group: 'top_left', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج رقمي (PWM / SPI MOSI).' },
  { id: 'd12', name: '12', group: 'top_left', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج/مدخل رقمي (SPI MISO).' },
  { id: 'd13', name: '13', group: 'top_left', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج رقمي (يحتوي على LED مدمج L).' },
  { id: 'gnd3', name: 'GND', group: 'top_left', type: 'gnd', icon: PowerOff, textClass: 'text-slate-500', glow: 'shadow-[0_0_10px_#475569]', desc: 'القطب السالب (الأرضي).' },
  { id: 'aref', name: 'AREF', group: 'top_left', type: 'com', icon: Activity, textClass: 'text-slate-300', glow: 'shadow-[0_0_15px_#cbd5e1]', desc: 'الجهد المرجعي للمداخل التناظرية (AREF).' },
  { id: 'sda', name: 'SDA', group: 'top_left', type: 'com', icon: Wifi, textClass: 'text-slate-300', glow: 'shadow-[0_0_15px_#cbd5e1]', desc: 'قطب بيانات I2C (Serial Data SDA).' },
  { id: 'scl', name: 'SCL', group: 'top_left', type: 'com', icon: Wifi, textClass: 'text-slate-300', glow: 'shadow-[0_0_15px_#cbd5e1]', desc: 'قطب ساعة I2C (Serial Clock SCL).' },

  // ==========================================
  // --- الصف السفلي (Power/Analog) - من اليسار لليمين ---
  // ==========================================
  
  // البلوك السفلي الأيسر - الطاقة (NC إلى VIN)
  { id: 'nc', name: 'NC', group: 'bottom_power', type: 'gnd', icon: Unplug, textClass: 'text-slate-500', glow: 'shadow-[0_0_10px_#475569]', desc: 'غير متصل (No Connection).' },
  { id: 'ioref', name: 'IOREF', group: 'bottom_power', type: 'gnd', icon: Zap, textClass: 'text-slate-500', glow: 'shadow-[0_0_10px_#475569]', desc: 'IOREF.' },
  { id: 'reset', name: 'RESET', group: 'bottom_power', type: 'com', icon: RefreshCcw, textClass: 'text-slate-300', glow: 'shadow-[0_0_15px_#cbd5e1]', desc: 'إعادة التشغيل (RESET).' },
  { id: '3v3', name: '3.3V', group: 'bottom_power', type: 'power', icon: Zap, textClass: 'text-red-400', glow: 'shadow-[0_0_15px_#f87171]', desc: 'مخرج طاقة 3.3 فولت للحساسات.' },
  { id: '5v', name: '5V', group: 'bottom_power', type: 'power', icon: Zap, textClass: 'text-red-400', glow: 'shadow-[0_0_15px_#f87171]', desc: 'مخرج طاقة 5 فولت الأساسي.' },
  { id: 'gnd1', name: 'GND', group: 'bottom_power', type: 'gnd', icon: PowerOff, textClass: 'text-slate-500', glow: 'shadow-[0_0_10px_#475569]', desc: 'القطب السالب (الأرضي).' },
  { id: 'gnd2', name: 'GND', group: 'bottom_power', type: 'gnd', icon: PowerOff, textClass: 'text-slate-500', glow: 'shadow-[0_0_10px_#475569]', desc: 'القطب السالب (الأرضي).' },
  { id: 'vin', name: 'Vin', group: 'bottom_power', type: 'power', icon: Zap, textClass: 'text-red-400', glow: 'shadow-[0_0_15px_#f87171]', desc: 'مدخل طاقة (7-12V).' },

  // البلوك السفلي الأيمن - التناظري (A0 إلى A5)
  { id: 'a0', name: 'A0', group: 'bottom_analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 0.' },
  { id: 'a1', name: 'A1', group: 'bottom_analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 1.' },
  { id: 'a2', name: 'A2', group: 'bottom_analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 2.' },
  { id: 'a3', name: 'A3', group: 'bottom_analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 3.' },
  { id: 'a4', name: 'A4', group: 'bottom_analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 4.' },
  { id: 'a5', name: 'A5', group: 'bottom_analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 5.' },
];

export default function InteractivePinout() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const activePinData = pins.find(p => p.id === hoveredPin);

  const PinSocket = ({ pin, labelPosition }: { pin: any, labelPosition: 'above' | 'below' }) => {
    const isHovered = hoveredPin === pin.id;
    return (
      <div 
        className="relative flex items-center justify-center cursor-crosshair group z-20"
        onMouseEnter={() => setHoveredPin(pin.id)} 
        onMouseLeave={() => setHoveredPin(null)}
      >
        <div className={`w-3.5 h-3.5 bg-[#0f172a] border-[0.5px] border-slate-700/50 flex items-center justify-center transition-all ${isHovered ? 'scale-125 z-30' : ''}`}>
           <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isHovered ? `bg-white ${pin.glow}` : 'bg-slate-700'}`}></div>
        </div>

        <span className={`absolute ${labelPosition === 'above' ? 'bottom-full mb-1' : 'top-full mt-1'} text-[6px] font-mono font-bold transition-colors whitespace-nowrap ${isHovered ? pin.textClass : 'text-teal-500/60'}`}>
          {pin.name}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 py-2 overflow-hidden">
      
      {/* حاوية 3D */}
      <div className="relative w-full h-[260px] flex items-center justify-center scale-[0.60] sm:scale-[0.85] md:scale-100 origin-center" style={{ perspective: '1200px' }}>
        
        {/* اللوحة الخضراء */}
        <div 
          className="relative w-[480px] min-w-[480px] h-[240px] bg-[#1e5a60] rounded-xl shadow-[-20px_20px_40px_rgba(0,0,0,0.6)] border-2 border-[#164246] p-4 transition-transform duration-500 hover:rotate-x-[45deg] hover:rotate-z-[-20deg]"
          style={{ transform: 'rotateX(55deg) rotateZ(-30deg)', transformStyle: 'preserve-3d' }}
        >
          {/* نصوص اللوحة المطبوعة */}
          <div className="absolute top-10 left-16 text-[12px] font-extrabold text-white/30 tracking-widest">UNO R3</div>
          <div className="absolute top-14 left-16 text-[8px] font-bold text-white/20">GDG QASSIM</div>

          {/* منفذ USB */}
          <div className="w-16 h-12 bg-slate-300 border border-slate-400 rounded-sm absolute top-6 left-[-10px] flex items-center justify-center shadow-lg" style={{ transform: 'translateZ(10px)' }}>
             <div className="w-10 h-6 bg-slate-100 rounded-sm border border-slate-300"></div>
          </div>
          
          {/* مقبس الطاقة */}
          <div className="w-10 h-14 bg-black border-2 border-slate-800 rounded-r-md absolute bottom-4 left-[-2px] shadow-lg flex items-center justify-center" style={{ transform: 'translateZ(10px)' }}>
             <div className="w-6 h-6 bg-slate-900 rounded-full border border-slate-700"></div>
          </div>

          {/* شريحة ATmega328P المدمجة (في المنتصف الأيمن) */}
          <div className="w-28 h-8 bg-[#0f172a] rounded-sm absolute top-1/2 right-12 -translate-y-1/2 flex items-center justify-center shadow-xl" style={{ transform: 'translateZ(5px)' }}>
              <span className="text-[6px] font-mono text-slate-500">ATMEGA328P</span>
          </div>

          {/* ======================================================== */}
          {/* --- ترتيب الأقطاب الجديد (من اليمين لليسار في الصف العلوي) --- */}
          {/* ======================================================== */}

          {/* الصف العلوي (Digital Edge) -> الترتيب من اليمين لليسار */}
          <div className="absolute top-2 left-12 right-6 flex items-start z-30" style={{ transform: 'translateZ(8px)' }}>
            <div className="flex gap-4">
              {/* البلوك العلوي الأيمن (8 أقطاب) - يبدأ بـ RX0 من اليمين */}
              <div className="flex flex-row-reverse items-center gap-[1px] bg-slate-950 p-[2px] rounded-sm border border-slate-700 shadow-md">
                {pins.filter(p => p.group === 'top_right').map(pin => <PinSocket key={pin.id} pin={pin} labelPosition="below" />)}
              </div>
              
              {/* البلوك العلوي الأيسر (10 أقطاب) - يبدأ بـ 8 من اليمين */}
              <div className="flex flex-row-reverse items-center gap-[1px] bg-slate-950 p-[2px] rounded-sm border border-slate-700 shadow-md">
                {pins.filter(p => p.group === 'top_left').map(pin => <PinSocket key={pin.id} pin={pin} labelPosition="below" />)}
              </div>
            </div>
          </div>

          {/* الصف السفلي (Power & Analog Edge) -> الترتيب من اليسار لليمين */}
          <div className="absolute bottom-2 left-14 right-8 flex justify-start items-end z-30" style={{ transform: 'translateZ(8px)' }}>
            <div className="flex gap-6">
              {/* بلوك الطاقة 8 أقطاب (من NC لـ VIN) */}
              <div className="flex items-center gap-[1px] bg-slate-950 p-[2px] rounded-sm border border-slate-700 shadow-md">
                {pins.filter(p => p.group === 'bottom_power').map(pin => <PinSocket key={pin.id} pin={pin} labelPosition="above" />)}
              </div>
              
              {/* بلوك التناظري 6 أقطاب (من A0 لـ A5) */}
              <div className="flex items-center gap-[1px] bg-slate-950 p-[2px] rounded-sm border border-slate-700 shadow-md ml-4">
                {pins.filter(p => p.group === 'bottom_analog').map(pin => <PinSocket key={pin.id} pin={pin} labelPosition="above" />)}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* بطاقة الشرح */}
      <div className="h-32 w-full bg-[#0b1120] border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex items-center shadow-xl mt-4 z-40">
        <AnimatePresence mode="wait">
          {activePinData ? (
            <motion.div 
              key={activePinData.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full gap-4"
            >
              <div className="flex-1 space-y-2 prose prose-invert max-w-none">
                <h5 className="text-sm font-bold text-slate-300">
                  العنوان: <span className={`${activePinData.textClass} tracking-wider`}>قطب {activePinData.name}</span>
                </h5>
                <p className="text-xs text-slate-400 font-medium">الوصف:</p>
                <p className="text-sm text-slate-200 leading-relaxed font-bold whitespace-pre-line prose prose-invert prose-sm">
                  {activePinData.desc}
                </p>
              </div>
              <div className={`p-4 rounded-xl bg-slate-900 border border-slate-700/50 shadow-inner ${activePinData.glow}`}>
                <activePinData.icon className={`w-8 h-8 ${activePinData.textClass}`} />
              </div>
            </motion.div>
          ) : (
             <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-slate-500 font-medium text-center w-full">
                قم بتحديد أحد المنافذ على اللوحة لعرض الشرح الهندسي الدقيق.
             </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}