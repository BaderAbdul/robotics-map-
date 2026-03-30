// src/components/InteractivePinout.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Hash, PowerOff, Unplug, RefreshCcw, Wifi, Cable } from 'lucide-react';

const pins = [
  // ========================================================
  // --- الجانب الأيسر (من الأعلى للأسفل) ---
  // ========================================================
  
  // بلوك الطاقة (8 أقطاب)
  { id: 'nc', name: 'NC', side: 'left', group: 'power', type: 'unplug', icon: Unplug, textClass: 'text-slate-500', glow: 'shadow-[0_0_10px_#475569]', desc: 'غير متصل (No Connection).' },
  { id: 'ioref', name: 'IOREF', side: 'left', group: 'power', type: 'gnd', icon: Zap, textClass: 'text-slate-300', glow: 'shadow-[0_0_10px_#cbd5e1]', desc: 'مرجع الجهد للشيلد.' },
  { id: 'reset', name: 'RESET', side: 'left', group: 'power', type: 'com', icon: RefreshCcw, textClass: 'text-slate-300', glow: 'shadow-[0_0_10px_#cbd5e1]', desc: 'إعادة التشغيل (RESET).' },
  { id: '3v3', name: '3V3', side: 'left', group: 'power', type: 'power', icon: Zap, textClass: 'text-red-400', glow: 'shadow-[0_0_15px_#f87171]', desc: 'مخرج طاقة 3.3 فولت.' },
  { id: '5v', name: '5V', side: 'left', group: 'power', type: 'power', icon: Zap, textClass: 'text-red-400', glow: 'shadow-[0_0_15px_#f87171]', desc: 'مخرج طاقة 5 فولت.' },
  { id: 'gnd1', name: 'GND', side: 'left', group: 'power', type: 'gnd', icon: PowerOff, textClass: 'text-slate-800', glow: 'shadow-[0_0_10px_#1e293b]', desc: 'القطب السالب (الأرضي).' },
  { id: 'gnd2', name: 'GND', side: 'left', group: 'power', type: 'gnd', icon: PowerOff, textClass: 'text-slate-800', glow: 'shadow-[0_0_10px_#1e293b]', desc: 'القطب السالب (الأرضي).' },
  { id: 'vin', name: 'VIN', side: 'left', group: 'power', type: 'power', icon: Zap, textClass: 'text-red-400', glow: 'shadow-[0_0_15px_#f87171]', desc: 'مدخل طاقة (7-12V).' },

  // بلوك التناظري (6 أقطاب)
  { id: 'a0', name: 'A0', side: 'left', group: 'analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 0.' },
  { id: 'a1', name: 'A1', side: 'left', group: 'analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 1.' },
  { id: 'a2', name: 'A2', side: 'left', group: 'analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 2.' },
  { id: 'a3', name: 'A3', side: 'left', group: 'analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 3.' },
  { id: 'a4', name: 'A4', side: 'left', group: 'analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 4 (SDA).' },
  { id: 'a5', name: 'A5', side: 'left', group: 'analog', type: 'analog', icon: Activity, textClass: 'text-yellow-400', glow: 'shadow-[0_0_15px_#facc15]', desc: 'مدخل تناظري 5 (SCL).' },

  // ========================================================
  // --- الجانب الأيمن (من الأعلى للأسفل) ---
  // ========================================================
  
  // بلوك الديجيتال العالي + I2C (10 أقطاب)
  { id: 'scl', name: 'SCL', side: 'right', group: 'dig_high', type: 'com', icon: Wifi, textClass: 'text-slate-400', glow: 'shadow-[0_0_15px_#94a3b8]', desc: 'ساعة I2C (SCL).' },
  { id: 'sda', name: 'SDA', side: 'right', group: 'dig_high', type: 'com', icon: Wifi, textClass: 'text-slate-400', glow: 'shadow-[0_0_15px_#94a3b8]', desc: 'بيانات I2C (SDA).' },
  { id: 'aref', name: 'AREF', side: 'right', group: 'dig_high', type: 'com', icon: Activity, textClass: 'text-slate-400', glow: 'shadow-[0_0_15px_#94a3b8]', desc: 'الجهد المرجعي (AREF).' },
  { id: 'gnd3', name: 'GND', side: 'right', group: 'dig_high', type: 'gnd', icon: PowerOff, textClass: 'text-slate-800', glow: 'shadow-[0_0_10px_#1e293b]', desc: 'القطب السالب (الأرضي).' },
  { id: 'd13', name: '13', side: 'right', group: 'dig_high', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج رقمي (يحتوي على LED مدمج).' },
  { id: 'd12', name: '12', side: 'right', group: 'dig_high', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج/مدخل رقمي (MISO).' },
  { id: 'd11', name: '~11', side: 'right', group: 'dig_high', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج PWM (MOSI).' },
  { id: 'd10', name: '~10', side: 'right', group: 'dig_high', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج PWM (SS).' },
  { id: 'd9', name: '~9', side: 'right', group: 'dig_high', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج PWM.' },
  { id: 'd8', name: '8', side: 'right', group: 'dig_high', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج/مدخل رقمي.' },

  // بلوك الديجيتال المنخفض (8 أقطاب)
  { id: 'd7', name: '7', side: 'right', group: 'dig_low', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج/مدخل رقمي.' },
  { id: 'd6', name: '~6', side: 'right', group: 'dig_low', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج PWM.' },
  { id: 'd5', name: '~5', side: 'right', group: 'dig_low', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج PWM.' },
  { id: 'd4', name: '4', side: 'right', group: 'dig_low', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج/مدخل رقمي.' },
  { id: 'd3', name: '~3', side: 'right', group: 'dig_low', type: 'digital', icon: Activity, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج PWM (INT1).' },
  { id: 'd2', name: '2', side: 'right', group: 'dig_low', type: 'digital', icon: Hash, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'مخرج رقمي (INT0).' },
  { id: 'tx', name: 'TX1', side: 'right', group: 'dig_low', type: 'com', icon: Cable, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'إرسال تسلسلي (TX).' },
  { id: 'rx', name: 'RX0', side: 'right', group: 'dig_low', type: 'com', icon: Cable, textClass: 'text-green-400', glow: 'shadow-[0_0_15px_#4ade80]', desc: 'استقبال تسلسلي (RX).' },
];

export default function InteractivePinout() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const activePinData = pins.find(p => p.id === hoveredPin);

  const PinSocket = ({ pin }: { pin: any }) => {
    const isHovered = hoveredPin === pin.id;
    const isLeft = pin.side === 'left';
    
    return (
      <div 
        className="relative flex items-center cursor-crosshair group z-20"
        onMouseEnter={() => setHoveredPin(pin.id)} 
        onMouseLeave={() => setHoveredPin(null)}
      >
        <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#1e293b] border-[0.5px] border-slate-700/50 flex items-center justify-center transition-all ${isHovered ? 'scale-125 z-30' : ''}`}>
           <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${isHovered ? `bg-white ${pin.glow}` : 'bg-slate-900'}`}></div>
        </div>

        <span className={`absolute ${isLeft ? 'left-full ml-1.5' : 'right-full mr-1.5'} text-[7px] sm:text-[8px] font-bold font-mono transition-colors whitespace-nowrap ${isHovered ? pin.textClass : 'text-slate-300/80'}`}>
          {pin.name}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* الحاوية الذكية (Smart Container):
        هنا السحر! الطول (h) يتغير حسب الشاشة ليستوعب اللوحة المصغرة،
        مما يمنع اللوحة من التداخل مع النصوص السفلية أو الخروج عن الصندوق.
      */}
      <div className="relative w-full h-[280px] sm:h-[360px] md:h-[440px] flex justify-center mt-2 sm:mt-4">
        
        {/* اللوحة المصغرة (Scaled Board) بموضع Absolute داخل الحاوية */}
        <div className="absolute top-0 transform scale-[0.60] sm:scale-[0.80] md:scale-100 origin-top transition-transform duration-300">
          <div className="relative w-[300px] h-[420px] bg-[#008184] rounded-xl border border-[#006a6c] shadow-2xl">
            
            {/* تفاصيل اللوحة */}
            <div className="absolute top-[180px] right-[100px] -rotate-90 text-[18px] font-extrabold text-white/80 tracking-widest flex items-center gap-2 pointer-events-none">
              Arduino <span className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px]">+ -</span> UNO
            </div>
            
            <div className="w-16 h-12 bg-slate-300 border border-slate-400 rounded-b-sm absolute top-0 left-[180px] flex items-center justify-center shadow-md">
               <div className="w-10 h-6 bg-slate-100 border border-slate-300"></div>
            </div>
            
            <div className="w-14 h-16 bg-slate-900 border border-slate-800 rounded-b-sm absolute top-0 left-[-2px] shadow-md flex items-end justify-center pb-2">
               <div className="w-6 h-6 bg-black rounded-full border border-slate-700"></div>
            </div>

            <div className="absolute top-[80px] left-[20px] flex flex-col gap-2">
               <div className="w-8 h-8 rounded-full bg-slate-300 border-[3px] border-slate-900 shadow-sm flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-slate-200"></div></div>
               <div className="w-8 h-8 rounded-full bg-slate-300 border-[3px] border-slate-900 shadow-sm flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-slate-200"></div></div>
            </div>

            <div className="w-8 h-8 bg-slate-200 border border-slate-300 absolute top-[10px] right-[10px] flex items-center justify-center shadow-sm">
               <div className="w-4 h-4 bg-red-700 rounded-full shadow-inner"></div>
               <span className="absolute -left-6 rotate-90 text-[6px] text-white font-bold">RESET</span>
            </div>

            <div className="w-[30px] h-[160px] bg-slate-900 rounded-sm absolute bottom-[60px] left-[70px] flex items-center justify-center shadow-md">
               <span className="text-[6px] font-mono text-slate-500 -rotate-90">ATMEGA328P</span>
            </div>

            <div className="absolute top-[100px] right-[40px] w-6 h-10 bg-slate-900 rounded-sm grid grid-cols-2 gap-[2px] p-1">
               {[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>)}
            </div>
            <div className="absolute bottom-[20px] right-[120px] w-10 h-6 bg-slate-900 rounded-sm grid grid-rows-2 grid-cols-3 gap-[2px] p-1">
               {[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>)}
            </div>

            {/* --- مقابس الأقطاب --- */}
            <div className="absolute top-[140px] left-[10px] flex flex-col items-center z-30">
              <div className="flex flex-col gap-[1px] bg-slate-950 p-[2px] rounded-sm shadow-md">
                {pins.filter(p => p.group === 'power').map(pin => <PinSocket key={pin.id} pin={pin} />)}
              </div>
              <span className="text-[8px] text-white font-bold my-1 rotate-90 ml-6">POWER</span>
              
              <div className="flex flex-col gap-[1px] bg-slate-950 p-[2px] rounded-sm shadow-md mt-2">
                {pins.filter(p => p.group === 'analog').map(pin => <PinSocket key={pin.id} pin={pin} />)}
              </div>
              <span className="text-[8px] text-white font-bold mt-2 rotate-90 ml-6">ANALOG IN</span>
            </div>

            <div className="absolute top-[120px] right-[10px] flex flex-col items-center z-30">
              <div className="flex flex-col gap-[1px] bg-slate-950 p-[2px] rounded-sm shadow-md">
                {pins.filter(p => p.group === 'dig_high').map(pin => <PinSocket key={pin.id} pin={pin} />)}
              </div>
              <div className="flex flex-col gap-[1px] bg-slate-950 p-[2px] rounded-sm shadow-md mt-4">
                {pins.filter(p => p.group === 'dig_low').map(pin => <PinSocket key={pin.id} pin={pin} />)}
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* بطاقة الشرح - تم ضبطها لتكون متجاوبة (Responsive) */}
      <div className="w-full min-h-[90px] sm:min-h-[110px] bg-[#0b1120] border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center shadow-xl mt-2 mb-2 z-40 shrink-0">
        <AnimatePresence mode="wait">
          {activePinData ? (
            <motion.div 
              key={activePinData.id}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full gap-3 sm:gap-4"
            >
              <div className="flex-1 space-y-1 sm:space-y-2">
                <h5 className="text-xs sm:text-sm font-bold text-slate-300">
                  <span className={`${activePinData.textClass} tracking-wider`}>قطب {activePinData.name}</span>
                </h5>
                <p className="text-[11px] sm:text-sm text-slate-200 leading-snug sm:leading-relaxed font-medium">
                  {activePinData.desc}
                </p>
              </div>
              {/* أيقونة البطاقة مع shrink-0 لكي لا تنضغط في الشاشات الصغيرة */}
              <div className={`p-2.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-700/50 shadow-inner shrink-0 ${activePinData.glow}`}>
                <activePinData.icon className={`w-5 h-5 sm:w-8 sm:h-8 ${activePinData.textClass}`} />
              </div>
            </motion.div>
          ) : (
             <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-full items-center justify-center">
                <p className="text-[11px] sm:text-sm text-slate-400 font-medium text-center">
                  مرر الماوس على الأقطاب في اللوحة لمعرفة وظيفتها.
                </p>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}