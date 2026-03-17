// src/data/roadmapData.ts
import { Zap, Cpu, Code, Wrench, Server, Eye, Microchip, Layers } from 'lucide-react';
import type { Stage } from '../types';

export const roadmapData: Stage[] = [
  // --- المسار الأساسي (للجميع) ---
  {
    id: 1, branch: 'main', title: 'أساسيات الإلكترونيات', icon: Zap, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400', difficulty: 'مبتدئ', difficultyColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'قبل بناء أي روبوت، يجب أن تفهم كيف تتدفق الكهرباء. تعلم أساسيات الجهد، التيار، المقاومة، وكيفية استخدام لوحة التجارب (Breadboard).',
    resources: [{ type: 'video', title: 'مقدمة في الإلكترونيات للمبتدئين', url: '#' }],
    project: 'إضاءة LED باستخدام زر ضغاط ومقاومة.'
  },
  {
    id: 2, branch: 'main', title: 'المتحكمات الدقيقة', icon: Cpu, color: 'text-blue-400', bgColor: 'bg-blue-400/10', borderColor: 'border-blue-400', difficulty: 'مبتدئ', difficultyColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'المتحكم هو "عقل" الروبوت. رحلتك مع Arduino و ESP32 لربط المكونات بالبرمجة.',
    resources: [{ type: 'course', title: 'دورة أردوينو الشاملة', url: '#' }], project: 'برمجة إشارة مرور ضوئية.'
  },
  {
    id: 3, branch: 'main', title: 'أساسيات البرمجة للروبوتات', icon: Code, color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400', difficulty: 'متوسط', difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'تعلم C/C++ لبرمجة المتحكمات، و Python كأساس للذكاء الاصطناعي.',
    resources: [{ type: 'course', title: 'C++ for Hardware', url: '#' }], project: 'كتابة خوارزمية فرز بسيطة.'
  },
  {
    id: 4, branch: 'main', title: 'المحركات والمستشعرات', icon: Wrench, color: 'text-green-400', bgColor: 'bg-green-400/10', borderColor: 'border-green-400', difficulty: 'متوسط', difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'كيف يتحرك الروبوت ويشعر بمحيطه؟ استخدام محركات DC والسيرفو وحساسات المسافة.',
    hint: '💡 هنا نقطة التحول! بعد هذه المرحلة اختر تخصصك المفضل للتعمق أكثر.',
    resources: [{ type: 'video', title: 'اختيار المحرك المناسب', url: '#' }], project: 'بناء روبوت متتبع للخط.'
  },

  // --- مسار الذكاء الاصطناعي والبرمجيات (يمين) ---
  {
    id: '5a', branch: 'ai', title: 'أنظمة التشغيل المتقدمة (ROS)', icon: Server, color: 'text-purple-400', bgColor: 'bg-purple-400/10', borderColor: 'border-purple-400', difficulty: 'متقدم', difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'الانتقال للروبوتات الذكية باستخدام Raspberry Pi ونظام ROS.',
    resources: [{ type: 'course', title: 'مقدمة في ROS2', url: '#' }], project: 'تحريك روبوت افتراضي (Turtlesim).'
  },
  {
    id: '6a', branch: 'ai', title: 'الذكاء الاصطناعي ورؤية الحاسب', icon: Eye, color: 'text-teal-400', bgColor: 'bg-teal-400/10', borderColor: 'border-teal-400', difficulty: 'متقدم', difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'إعطاء الروبوت القدرة على الرؤية باستخدام OpenCV وتعلم الآلة (Python).',
    resources: [{ type: 'video', title: 'أساسيات Computer Vision', url: '#' }], project: 'برمجة كاميرا لتتبع الوجوه.'
  },

  // --- مسار الهاردوير والدوائر المطبوعة (يسار) ---
  {
    id: '5b', branch: 'hardware', title: 'تصميم الدوائر المطبوعة (PCB)', icon: Layers, color: 'text-orange-400', bgColor: 'bg-orange-400/10', borderColor: 'border-orange-400', difficulty: 'متقدم', difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'تخلص من الأسلاك المزعجة! تعلم تصميم اللوحات المطبوعة باستخدام برامج مثل KiCad أو EasyEDA.',
    resources: [{ type: 'video', title: 'احترف تصميم PCB من الصفر', url: '#' }], project: 'تصميم وطباعة لوحة تحكم مخصصة لروبوتك.'
  },
  {
    id: '6b', branch: 'hardware', title: 'هندسة المكونات والنظم المدمجة', icon: Microchip, color: 'text-rose-400', bgColor: 'bg-rose-400/10', borderColor: 'border-rose-400', difficulty: 'خبير', difficultyColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'التعمق في بنية المعالجات الدقيقة (Architecture)، إدارة الطاقة، وتصميم النظم المدمجة المتقدمة.',
    resources: [{ type: 'article', title: 'إدارة الطاقة في الروبوتات', url: '#' }], project: 'بناء نظام تحكم متكامل يستهلك طاقة منخفضة جداً.'
  }
];