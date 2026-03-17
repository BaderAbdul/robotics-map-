// src/data/roadmapData.ts
import { Zap, Cpu, Code, Wrench, Server, Eye } from 'lucide-react';
import { Stage } from '../types';

export const roadmapData: Stage[] = [
  {
    id: 1,
    title: 'أساسيات الإلكترونيات',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400',
    difficulty: 'مبتدئ',
    difficultyColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'قبل بناء أي روبوت، يجب أن تفهم كيف تتدفق الكهرباء. تعلم أساسيات الجهد، التيار، المقاومة، وكيفية استخدام لوحة التجارب (Breadboard).',
    resources: [
      { type: 'video', title: 'مقدمة في الإلكترونيات للمبتدئين', url: 'https://youtube.com/playlist?list=PLww54WQ2wa5rOJ7FcXxi-CMNgmpybv7ei&si=IqEA6pkylC44ubvS' },
      { type: 'article', title: 'كيف تقرأ الدوائر الكهربائية؟', url: 'https://www.build-electronic-circuits.com/how-to-build-circuits/' }
    ],
    project: 'إضاءة LED باستخدام زر ضغاط ومقاومة، وقياس الجهد بالملتيميتر.'
  },
{

id: 2,

title: 'المتحكمات الدقيقة (Microcontrollers)',

icon: Cpu,

color: 'text-blue-400',

bgColor: 'bg-blue-400/10',

borderColor: 'border-blue-400',

difficulty: 'مبتدئ',

difficultyColor: 'bg-green-500/20 text-green-400 border-green-500/30',

description: 'المتحكم هو "عقل" الروبوت. هنا تبدأ رحلتك مع Arduino و ESP32 لربط المكونات الإلكترونية بالبرمجة.',

hint: '💡 تلميح: بناءً على ما تعلمناه في معسكر المتحكمات الدقيقة الأخير، هنا تبدأ رحلتك الحقيقية.',

resources: [

{ type: 'video', title: 'مراجعة المعسكر: مقدمة في المتحكمات الدقيقة soon', url: '#' },

{ type: 'course', title: 'دورة أردوينو الشاملة', url: 'https://youtu.be/zJ-LqeX_fLU' }

],

project: 'برمجة إشارة مرور ضوئية باستخدام Arduino Uno.'

},

{

id: 3,

title: 'أساسيات البرمجة للروبوتات',

icon: Code,

color: 'text-red-400',

bgColor: 'bg-red-400/10',

borderColor: 'border-red-400',

difficulty: 'متوسط',

difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',

description: 'تعلم لغات البرمجة الأساسية للروبوتات. C/C++ لبرمجة المتحكمات الدقيقة (Low-level)، و Python للذكاء الاصطناعي وأنظمة الروبوتات المتقدمة.',

resources: [

{ type: 'course', title: 'C++ for Hardware', url: '#' },

{ type: 'article', title: 'لماذا بايثون مهمة في الروبوتات؟', url: '#' }

],

project: 'كتابة كود برمجي (Algorithm) لفرز الأرقام، كتمهيد لمنطق البرمجة.'

},

{

id: 4,

title: 'المحركات والمستشعرات',

icon: Wrench,

color: 'text-green-400',

bgColor: 'bg-green-400/10',

borderColor: 'border-green-400',

difficulty: 'متوسط',

difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',

description: 'كيف يتحرك الروبوت وكيف يشعر بمحيطه؟ تعلم استخدام محركات DC، السيرفو، الخطوية (Stepper)، وحساسات المسافة (Ultrasonic) والخطوط (IR).',

resources: [

{ type: 'video', title: 'كيف تختار المحرك المناسب لروبوتك؟', url: '#' },

{ type: 'course', title: 'دورة الحساسات التفاعلية', url: '#' }

],

project: 'بناء روبوت متتبع للخط (Line Follower Robot) أو روبوت يتجنب الحواجز.'

},

{

id: 5,

title: 'أنظمة التشغيل المتقدمة (ROS & RPi)',

icon: Server,

color: 'text-purple-400',

bgColor: 'bg-purple-400/10',

borderColor: 'border-purple-400',

difficulty: 'متقدم',

difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',

description: 'الانتقال من الروبوتات البسيطة إلى الروبوتات الذكية. تعلم استخدام حواسيب اللوحة الواحدة (Raspberry Pi) ونظام تشغيل الروبوتات (ROS).',

resources: [

{ type: 'course', title: 'مقدمة في ROS2', url: '#' },

{ type: 'article', title: 'الفرق بين Arduino و Raspberry Pi', url: '#' }

],

project: 'إعداد بيئة ROS على Raspberry Pi وتحريك روبوت افتراضي (Turtlesim).'

},

{

id: 6,

title: 'الذكاء الاصطناعي ورؤية الحاسب',

icon: Eye,

color: 'text-teal-400',

bgColor: 'bg-teal-400/10',

borderColor: 'border-teal-400',

difficulty: 'متقدم',

difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',

description: 'إعطاء الروبوت القدرة على الرؤية واتخاذ القرارات المعقدة باستخدام مكتبات مثل OpenCV ونماذج تعلم الآلة.',

resources: [

{ type: 'video', title: 'أساسيات Computer Vision', url: '#' },

{ type: 'video', title: 'الأذرع الروبوتية في المصانع الذكية (محتوى GDG Qassim)', url: '#' }

],

project: 'برمجة كاميرا للتعرف على الوجوه أو تتبع كرة ملونة وتوجيه الكاميرا نحوها.'

}

];
