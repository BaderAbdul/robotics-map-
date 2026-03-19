// src/components/InteractivePinout.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Hash, PowerOff, Unplug, BrainCircuit, Rss } from 'lucide-react';

// --- بيانات الأقطاب الـ 32 الكاملة للوحة Arduino Uno R3 ---
const pinsData = {
  // 1. أقطاب الطاقة والمخارج (أسفل اليسار - 8 أقطاب)
  power: [
    { id: 'nc', name: 'NC', type: 'nc', icon: Unplug, color: 'text-slate-500', glow: 'shadow-[0_0_15px_#64748b]', desc: 'غير متصل (Not Connected).' },
    { id: 'ioref', name: 'IOREF', type: 'power', icon: Zap, color: 'text-orange-400', glow: 'shadow-[0_0_15px_#f97316]', desc: 'مرجع الجهد لمخارج الإدخال والإخراج.' },
    { id: 'reset_p', name: 'RESET', type: 'reset', icon: PowerOff, color: 'text-red-500', glow: 'shadow-[0_0_15px_#ef4444]', desc: 'إعادة تشغيل اللوحة (Active Low).' },
    { id: '3v3', name: '3.3V', type: 'power', icon: Zap, color: 'text-orange-400', glow: 'shadow-[0_0_15px_#f97316]', desc: 'مخرج طاقة 3.3 فولت للحساسات.' },
    { id: '5v', name: '5V', type: 'power', icon: Zap, color: 'text-red-400', glow: 'shadow-[0_0_15px_#ef4444]', desc: 'مخرج طاقة 5 فولت الأساسي.' },
    { id: 'gnd_p1', name: 'GND', type: 'gnd', icon: PowerOff, color: 'text-slate-400', glow: 'shadow-[0_0_15px_#94a3b8]', desc: 'القطب السالب (الأرضي).' },
    { id: 'gnd_p2', name: 'GND', type: 'gnd', icon: PowerOff, color: 'text-slate-400', glow: 'shadow-[0_0_15px_#94a3b8]', desc: 'القطب السالب (الأرضي).' },
    { id: 'vin', name: 'Vin', type: 'power', icon: Zap, color: 'text-red-500', glow: 'shadow-[0_0_15px_#ef4444]', desc: 'مدخل طاقة لتشغيل اللوحة ببطارية.' },
  ],
  // 2. أقطاب التناظري (Analog In - أسفل اليمين - 6 أقطاب)
  analog: [
    { id: 'a0', name: 'A0', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري (Analog In).' },
    { id: 'a1', name: 'A1', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري للقراءة.' },
    { id: 'a2', name: 'A2', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري للقراءة.' },
    { id: 'a3', name: 'A3', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري للقراءة.' },
    { id: 'a4', name: 'A4 / SDA', type: 'analog', icon: BrainCircuit, color: 'text-teal-300', glow: 'shadow-[0_0_15px_#5eead4]', desc: 'مدخل تناظري أو واجهة I2C البيانات (SDA).' },
    { id: 'a5', name: 'A5 / SCL', type: 'analog', icon: BrainCircuit, color: 'text-teal-300', glow: 'shadow-[0_0_15px_#5eead4]', desc: 'مدخل تناظري أو واجهة I2C الساعة (SCL).' },
  ],
  // 3. أقطاب الرقمية و PWM (الأعلى - 18 قطباً، تبدأ من اليمين لليسار)
  digital: [
    { id: 'tx', name: 'TX->1', type: 'digital', icon: Rss, color: 'text-blue-300', glow: 'shadow-[0_0_15px_#93c5fd]', desc: 'مخرج رقمي أو واجهة UART الإرسال (TX).' },
    { id: 'rx', name: 'RX<-0', type: 'digital', icon: Rss, color: 'text-blue-300', glow: 'shadow-[0_0_15px_#93c5fd]', desc: 'مخرج رقمي أو واجهة UART الاستقبال (RX).' },
    { id: 'd2', name: '2', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي (يدعم المقاطعة External Interrupt 0).' },
    { id: 'd3', name: '~3', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM أو مقاطعة (Interrupt 1).' },
    { id: 'd4', name: '4', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي.' },
    { id: 'd5', name: '~5', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM للتحكم بالسرعة.' },
    { id: 'd6', name: '~6', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM للتحكم بالسرعة.' },
    { id: 'd7', name: '7', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي.' },
    { id: 'd8', name: '8', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي.' },
    { id: 'd9', name: '~9', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM للتحكم بالسرعة (PWM ~).' },
    { id: 'd10', name: '~10 / SS', type: 'pwm', icon: BrainCircuit, color: 'text-purple-300', glow: 'shadow-[0_0_15px_#d8b4fe]', desc: 'مخرج PWM أو SPI اختيار التابع (SS).' },
    { id: 'd11', name: '~11 / MOSI', type: 'pwm', icon: BrainCircuit, color: 'text-purple-300', glow: 'shadow-[0_0_15px_#d8b4fe]', desc: 'مخرج PWM أو SPI البيانات الرئيسية (MOSI).' },
    { id: 'd12', name: '12 / MISO', type: 'digital', icon: BrainCircuit, color: 'text-blue-300', glow: 'shadow-[0_0_15px_#93c5fd]', desc: 'مخرج رقمي أو SPI البيانات التابعة (MISO).' },
    { id: 'd13', name: '13 / SCK', type: 'digital', icon: BrainCircuit, color: 'text-blue-300', glow: 'shadow-[0_0_15px_#93c5fd]', desc: 'مخرج رقمي (LED مدمج) أو SPI الساعة (SCK).' },
    { id: 'gnd_d', name: 'GND', type: 'gnd', icon: PowerOff, color: 'text-slate-400', glow: 'shadow-[0_0_15px_#94a3b8]', desc: 'القطب السالب (الأرضي).' },
    { id: 'aref', name: 'AREF', type: 'analog', icon: Zap, color: 'text-green-300', glow: 'shadow-[0_0_15px_#5eead4]', desc: 'مرجع الجهد التناظري الخارجي.' },
    { id: 'sda', name: 'SDA', type: 'digital', icon: BrainCircuit, color: 'text-blue-200', glow: 'shadow-[0_0_15px_#bfdbfe]', desc: 'واجهة I2C البيانات (SDA).' },
    { id: 'scl', name: 'SCL', type: 'digital', icon: BrainCircuit, color: 'text-blue-200', glow: 'shadow-[0_0_15px_#bfdbfe]', desc: 'واجهة I2C الساعة (SCL).' },
  ]
};

// دمج جميع الأقطاب للبحث
const allPins = [...pinsData.power, ...pinsData.analog, ...pinsData.digital];

export default function InteractivePinout() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const activePinData = allPins.find(p => p.id === hoveredPin);

  // دالة لرسم نقطة الـ Pin التفاعلية
  const PinPoint = ({ pin }: { pin: any }) => {
    const isHovered = hoveredPin === pin.id;
    return (
      <div 
        className="relative group cursor-crosshair z-20 transition-transform duration-150 hover:scale-125"
        onMouseEnter={() => setHoveredPin(pin.id)} 
        onMouseLeave={() => setHoveredPin(null)}
      >
        {/* النقطة المضيئة (Glowing Dot) */}
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isHovered ? `bg-white ${pin.glow}` : 'bg-slate-700'}`}></div>
        
        {/* التسمية التوضيحية عند التمرير (Hover Label) */}
        <AnimatePresence>
          {isHovered && (
             <motion.div 
               initial={{ opacity: 0, y: -5, scale: 0.9 }} animate={{ opacity: 1, y: -18, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.9 }} transition={{ duration: 0.2 }}
               className={`absolute px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-950/90 backdrop-blur-sm border border-slate-700 whitespace-nowrap z-30 ${pin.color} ${pin.glow}`}
             >
               {pin.name}
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-10 py-6">
      <p className="text-slate-400 text-xs text-center leading-relaxed">
        قم بتدوير اللوحة وتمرير الماوس فوق أي من الأقطاب الـ 32 لمعرفة وظيفته التحذيرية والاستخدام الصحيح.
      </p>
      
      {/* حاوية اللوحة ثلاثية الأبعاد (Isometric 3D) */}
      <div className="relative w-full h-[320px] flex items-center justify-center p-4" style={{ perspective: '1200px' }}>
        
        {/* اللوحة نفسها المائلة (Arduino R3 Model) */}
        <div 
          className="relative w-[340px] h-[240px] bg-[#1a6a6e] rounded-xl shadow-[-30px_30px_50px_rgba(0,0,0,0.6)] border-4 border-[#145356] p-4 transition-transform duration-500 ease-out hover:rotate-x-[40deg] hover:rotate-z-[-15deg] transform-gpu"
          style={{ transform: 'rotateX(55deg) rotateZ(-30deg)', transformStyle: 'preserve-3d' }}
        >
          {/* تفاصيل اللوحة */}
          <div className="absolute top-4 left-4 text-[12px] font-extrabold text-white/40 tracking-widest">ARDUINO UNO R3</div>
          <div className="absolute bottom-4 right-4 text-[9px] font-bold text-white/20">GDG QASSIM - BURAYDAH</div>
          
          {/* منفذ الـ USB (مرسوم بـ CSS) */}
          <div className="w-16 h-12 bg-slate-300 border border-slate-400 rounded-sm absolute bottom-4 left-[-12px] flex items-center justify-center shadow-lg" style={{ transform: 'translateZ(10px)' }}>
             <div className="w-12 h-8 bg-slate-100 rounded-sm border border-slate-300 flex items-center justify-center">
               <div className="w-8 h-4 bg-slate-300 rounded-sm"></div>
             </div>
          </div>

          {/* شريحة ATmega328P (المتحكم الطويل) */}
          <div className="w-28 h-8 bg-slate-950 border-t border-b border-slate-800 rounded-sm absolute center flex items-center justify-center p-1 shadow-inner" style={{ transform: 'translateZ(5px)' }}>
             <div className="w-24 h-5 bg-slate-900 rounded-sm border-t border-slate-700 flex items-center justify-center relative">
                <span className="text-[7px] font-mono text-slate-500">ATMEGA328P</span>
                <div className="w-1.5 h-1.5 bg-slate-700 rounded-full absolute top-1 left-1"></div>
             </div>
          </div>

          {/* --- مجموعات الأقطاب الـ 32 --- */}

          {/* 1. صف المنافذ العلوي (Digital / PWM - 18 قطباً) */}
          <div className="absolute top-4 right-4 flex flex-col items-end" style={{ transform: 'translateZ(8px)' }}>
            <span className="text-[10px] font-bold text-white/80 mb-1.5">DIGITAL (PWM ~)</span>
            <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-md shadow-inner border border-slate-800">
               {pinsData.digital.map(pin => <PinPoint key={pin.id} pin={pin} />)}
            </div>
          </div>

          {/* 2. صف المنافذ السفلي الأيمن (Analog In - 6 أقطاب) */}
          <div className="absolute bottom-4 right-4 flex flex-col items-end" style={{ transform: 'translateZ(8px)' }}>
            <span className="text-[10px] font-bold text-white/80 mb-1.5">ANALOG IN</span>
            <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-md shadow-inner border border-slate-800">
               {pinsData.analog.map(pin => <PinPoint key={pin.id} pin={pin} />)}
            </div>
          </div>

          {/* 3. صف المنافذ السفلي الأيسر (Power - 8 أقطاب) */}
          <div className="absolute bottom-4 left-20 flex flex-col items-start" style={{ transform: 'translateZ(8px)' }}>
            <span className="text-[10px] font-bold text-white/80 mb-1.5">POWER</span>
            <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-md shadow-inner border border-slate-800">
               {pinsData.power.map(pin => <PinPoint key={pin.id} pin={pin} />)}
            </div>
          </div>

        </div>
      </div>

      {/* بطاقة الشرح الداكنة (المطابقة للصورة المرفقة) */}
      <div className="h-32 w-full bg-[#0b1120] border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex items-center shadow-xl shadow-slate-950/20">
        <AnimatePresence mode="wait">
          {activePinData ? (
            <motion.div 
              key={activePinData.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.95 }} transition={{ duration: 0.15 }}
              className="flex items-center justify-between w-full gap-5"
            >
              <div className="flex-1 space-y-2">
                <h5 className="text-sm font-bold text-slate-300">
                  العنوان: <span className={`${activePinData.color} tracking-wider`}>قطب {activePinData.name}</span>
                </h5>
                <p className="text-xs text-slate-400 font-medium">الوصف الهندسي:</p>
                <p className="text-base text-slate-100 leading-relaxed font-bold">{activePinData.desc}</p>
              </div>
              <div className={`p-5 rounded-2xl bg-slate-900 border border-slate-700/50 shadow-inner ${activePinData.glow}`}>
                <activePinData.icon className={`w-9 h-9 ${activePinData.color}`} />
              </div>
            </motion.div>
          ) : (
             <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-slate-500 font-medium text-center w-full">
                قم بتحديد أحد الأقطاب الـ 32 على اللوحة لعرض الشرح الهندسي الدقيق.
             </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}