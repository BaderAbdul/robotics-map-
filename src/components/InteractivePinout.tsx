// src/components/InteractivePinout.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Hash, PowerOff, Unplug, RefreshCcw, Wifi } from 'lucide-react';

// تعريف بيانات جميع الأقطاب الـ 32 للوحة Arduino Uno R3
const pins = [
  // --- صف الأقطاب العلوي (من اليسار لليمين - 18 قطب) ---
  { id: 'nc', name: 'NC', group: 'top', type: 'unplug', icon: Unplug, color: 'text-slate-600', glow: 'shadow-[0_0_10px_#475569]', desc: 'غير متصل (No Connection). لا تستخدم هذا القطب.' },
  { id: 'ioref', name: 'IOREF', group: 'top', type: 'power', icon: Zap, color: 'text-orange-400', glow: 'shadow-[0_0_15px_#f97316]', desc: 'مرجع الجهد للمتحكم (IOREF). تخبر الشاشات (Shields) بجهد اللوحة.' },
  { id: 'reset', name: 'RESET', group: 'top', type: 'reset', icon: RefreshCcw, color: 'text-red-600', glow: 'shadow-[0_0_15px_#dc2626]', desc: 'قطب إعادة التشغيل. توصيله بالأرضي (GND) يُعيد تشغيل الأردوينو.' },
  { id: '3v3', name: '3.3V', group: 'top', type: 'power', icon: Zap, color: 'text-orange-400', glow: 'shadow-[0_0_15px_#f97316]', desc: 'مخرج طاقة 3.3 فولت للحساسات والقطع الدقيقة.' },
  { id: '5v', name: '5V', group: 'top', type: 'power', icon: Zap, color: 'text-red-400', glow: 'shadow-[0_0_15px_#ef4444]', desc: 'مخرج طاقة 5 فولت الأساسي لتشغيل معظم القطع.' },
  { id: 'gnd1', name: 'GND', group: 'top', type: 'gnd', icon: PowerOff, color: 'text-slate-400', glow: 'shadow-[0_0_15px_#94a3b8]', desc: 'القطب السالب (الأرضي). نقطة المرجع الصفرية للدائرة الكهربائية.' },
  { id: 'gnd2', name: 'GND', group: 'top', type: 'gnd', icon: PowerOff, color: 'text-slate-400', glow: 'shadow-[0_0_15px_#94a3b8]', desc: 'القطب السالب (الأرضي).' },
  { id: 'vin', name: 'Vin', group: 'top', type: 'power', icon: Zap, color: 'text-red-500', glow: 'shadow-[0_0_15px_#ef4444]', desc: 'مدخل طاقة لتشغيل اللوحة ببطارية خارجية (7-12 فولت).' },
  { id: 'gnd3', name: 'GND', group: 'top', type: 'gnd', icon: PowerOff, color: 'text-slate-400', glow: 'shadow-[0_0_15px_#94a3b8]', desc: 'القطب السالب (الأرضي).' },
  { id: 'aref', name: 'AREF', group: 'top', type: 'analog', icon: Activity, color: 'text-green-600', glow: 'shadow-[0_0_15px_#166534]', desc: 'الجهد المرجعي للمداخل التناظرية (AREF). يستخدم لمعايرة دقة الحساسات.' },
  { id: 'sda', name: 'SDA', group: 'top', type: 'i2c', icon: Wifi, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'قطب بيانات I2C (SDA). يستخدم للاتصال بشاشات OLED وحساسات متقدمة.' },
  { id: 'scl', name: 'SCL', group: 'top', type: 'i2c', icon: Wifi, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'قطب ساعة I2C (SCL). يستخدم لمزامنة الاتصال مع قطع I2C.' },
  { id: 'd13', name: '13', group: 'top', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي (Digital I/O). يحتوي على LED مدمج.' },
  { id: 'd12', name: '12', group: 'top', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي.' },
  { id: 'd11', name: '~11', group: 'top', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM (نبضات). للتحكم بسرعة المحركات أو إضاءة LED.' },
  { id: 'd10', name: '~10', group: 'top', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM.' },
  { id: 'd9', name: '~9', group: 'top', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM.' },
  { id: 'd8', name: '8', group: 'top', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي.' },

  // --- صف الأقطاب السفلي الأيمن (من اليسار لليمين - 8 أقطاب Digital/PWM/Serial) ---
  { id: 'd7', name: '7', group: 'bottom_right', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي.' },
  { id: 'd6', name: '~6', group: 'bottom_right', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM.' },
  { id: 'd5', name: '~5', group: 'bottom_right', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM.' },
  { id: 'd4', name: '4', group: 'bottom_right', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي.' },
  { id: 'd3', name: '~3', group: 'bottom_right', type: 'pwm', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_15px_#a855f7]', desc: 'مخرج PWM (يدعم المقاطعة - Interrupt).' },
  { id: 'd2', name: '2', group: 'bottom_right', type: 'digital', icon: Hash, color: 'text-blue-400', glow: 'shadow-[0_0_15px_#60a5fa]', desc: 'مخرج/مدخل رقمي (يدعم المقاطعة).' },
  { id: 'tx', name: 'TX->1', group: 'bottom_right', type: 'serial', icon: Wifi, color: 'text-green-500', glow: 'shadow-[0_0_15px_#16a34a]', desc: 'قطب إرسال البيانات التسلسلي (TX). يستخدم لرفع الكود والاتصال بالكمبيوتر.' },
  { id: 'rx', name: 'RX<-0', group: 'bottom_right', type: 'serial', icon: Wifi, color: 'text-green-500', glow: 'shadow-[0_0_15px_#16a34a]', desc: 'قطب استقبال البيانات التسلسلي (RX). يستخدم لرفع الكود.' },

  // --- صف الأقطاب السفلي الأيسر (من اليسار لليمين - 6 أقطاب Analog In) ---
  { id: 'a0', name: 'A0', group: 'bottom_left', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري لقراءة الحساسات المتغيرة (مثل الحرارة والضوء).' },
  { id: 'a1', name: 'A1', group: 'bottom_left', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري.' },
  { id: 'a2', name: 'A2', group: 'bottom_left', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري.' },
  { id: 'a3', name: 'A3', group: 'bottom_left', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري.' },
  { id: 'a4', name: 'A4', group: 'bottom_left', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري (يمكن استخدامه كـ SDA للـ I2C).' },
  { id: 'a5', name: 'A5', group: 'bottom_left', type: 'analog', icon: Activity, color: 'text-teal-400', glow: 'shadow-[0_0_15px_#2dd4bf]', desc: 'مدخل تناظري (يمكن استخدامه كـ SCL للـ I2C).' },
];

export default function InteractivePinout() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const activePinData = pins.find(p => p.id === hoveredPin);

  const PinSocket = ({ pin, labelSide = 'top' }: { pin: any, labelSide?: 'top' | 'bottom' }) => {
    const isHovered = hoveredPin === pin.id;
    return (
      <div 
        className="relative flex items-center justify-center cursor-crosshair group"
        onMouseEnter={() => setHoveredPin(pin.id)} 
        onMouseLeave={() => setHoveredPin(null)}
      >
        {/* المسمار الحقيقي (Pin Socket) - تصميم جديد للمنفذ الأسود */}
        <div className={`w-4 h-4 bg-slate-950 border border-slate-700 rounded-sm flex items-center justify-center transition-all ${isHovered ? 'scale-125' : ''}`}>
           <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isHovered ? `bg-white ${pin.glow}` : 'bg-slate-700'}`}></div>
        </div>

        {/* اسم القطب يظهر بجانبه بشكل ثابت كما في اللوحة الحقيقية */}
        <span className={`absolute ${labelSide === 'top' ? '-top-3.5' : '-bottom-3.5'} text-[8px] font-mono font-bold transition-colors ${isHovered ? pin.color : 'text-teal-600/70'}`}>
          {pin.name}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <p className="text-slate-400 text-xs text-center leading-relaxed">
        الآن هذا هو الأردوينو الحقيقي! مرر الماوس فوق المنافذ (Sockets) لمعرفة وظيفتها.
      </p>
      
      {/* حاوية اللوحة - قمنا بتوسيع الأبعاد لتستوعب الأقطاب */}
      <div className="relative w-full h-[320px] flex items-center justify-center" style={{ perspective: '1200px' }}>
        
        {/* اللوحة نفسها (مائلة ثلاثية الأبعاد) */}
        <div 
          className="relative w-[480px] h-[260px] bg-[#1e5a60] rounded-xl shadow-[-20px_20px_40px_rgba(0,0,0,0.6)] border-2 border-[#164246] p-4 transition-transform duration-500 hover:rotate-x-[50deg] hover:rotate-z-[-25deg]"
          style={{ transform: 'rotateX(55deg) rotateZ(-30deg)', transformStyle: 'preserve-3d' }}
        >
          {/* تفاصيل اللوحة */}
          <div className="absolute top-2 left-2 text-[10px] font-extrabold text-white/30 tracking-widest">ARDUINO UNO R3</div>
          <div className="absolute bottom-2 right-2 text-[8px] font-bold text-white/20">GDG QASSIM EDITION</div>

          {/* منفذ الـ USB */}
          <div className="w-16 h-12 bg-slate-300 border border-slate-400 rounded-sm absolute bottom-2 left-[-10px] flex items-center justify-center" style={{ transform: 'translateZ(10px)' }}>
             <div className="w-10 h-6 bg-slate-100 rounded-sm border border-slate-300"></div>
          </div>

          {/* شريحة ATmega328P */}
          <div className="w-28 h-7 bg-[#0f172a] rounded-sm absolute center flex items-center justify-center shadow-lg" style={{ transform: 'translateZ(5px)' }}>
              <span className="text-[6px] font-mono text-slate-500">ATMEGA328P</span>
          </div>

          {/* --- صف المنافذ العلوي (18 قطب متباعد بوضوح) --- */}
          <div className="absolute top-2 right-2 flex flex-col items-end" style={{ transform: 'translateZ(8px)' }}>
            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-sm border border-white/10 backdrop-blur-sm">
              {pins.filter(p => p.group === 'top').map(pin => <PinSocket key={pin.id} pin={pin} labelSide='bottom' />)}
            </div>
          </div>

          {/* --- صف المنافذ السفلي الأيمن (8 أقطاب) --- */}
          <div className="absolute bottom-2 right-2 flex flex-col items-end" style={{ transform: 'translateZ(8px)' }}>
            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-sm border border-white/10 backdrop-blur-sm">
              {pins.filter(p => p.group === 'bottom_right').map(pin => <PinSocket key={pin.id} pin={pin} />)}
            </div>
          </div>

          {/* --- صف المنافذ السفلي الأيسر (6 أقطاب) --- */}
          <div className="absolute bottom-2 left-20 flex flex-col items-start" style={{ transform: 'translateZ(8px)' }}>
            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-sm border border-white/10 backdrop-blur-sm">
              {pins.filter(p => p.group === 'bottom_left').map(pin => <PinSocket key={pin.id} pin={pin} />)}
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