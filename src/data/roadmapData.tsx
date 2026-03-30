// src/data/roadmapData.ts
import { Zap, Cpu, Code, Wrench, Server, Eye, Layers, Box } from 'lucide-react';
import type { Stage } from '../types';

export const roadmapData: Stage[] = [

  // -- المسار الأساسي (للجميع) --
  {
    id: 1, branch: 'main', title: 'أساسيات الإلكترونيات', icon: Zap, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400', difficulty: 'مبتدئ', difficultyColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'قبل بناء أي روبوت، يجب أن تفهم كيف تتدفق الكهرباء. تعلم أساسيات الجهد، التيار، المقاومة، وكيفية استخدام لوحة التجارب (Breadboard).',
    resources: [
      { type: 'video', title: 'دورة الإلكترونيات العملية (م. وليد عيسى)', url: 'https://youtube.com/playlist?list=PLww54WQ2wa5rOJ7FcXxi-CMNgmpybv7ei' },
      { type: 'article', title: 'مقال تفاعلي: ما هي الدائرة الكهربائية؟ (SparkFun)', url: 'https://learn.sparkfun.com/tutorials/what-is-a-circuit' },
      { type: 'course', title: 'تطبيق عملي: محاكي الدوائر Tinkercad', url: 'https://www.tinkercad.com/learn/circuits' }
    ],
    project: 'إضاءة LED باستخدام زر ضغاط ومقاومة، وتجربتها على المحاكي أولاً.'
  },
  {
    id: 2, branch: 'main', title: 'المتحكمات الدقيقة', icon: Cpu, color: 'text-blue-400', bgColor: 'bg-blue-400/10', borderColor: 'border-blue-400', difficulty: 'مبتدئ', difficultyColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'المتحكم هو "عقل" الروبوت. رحلتك مع Arduino و ESP32 لربط المكونات بالبرمجة.',
    resources: [
      { type: 'article', title: 'مراجعة: مواد معسكر المتحكمات الدقيقة (فبراير 2026 - GDG Qassim)', url: '#' }, 
      { type: 'video', title: 'دورة أردوينو الشاملة للمبتدئين', url: 'https://youtu.be/zJ-LqeX_fLU' },
      { type: 'course', title: 'الدروس الرسمية خطوة بخطوة (Arduino Docs)', url: 'https://docs.arduino.cc/tutorials/' }
    ], 
    project: 'برمجة إشارة مرور ضوئية تفاعلية.'
  },
  {
    id: 3, branch: 'main', title: 'أساسيات البرمجة للروبوتات', icon: Code, color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400', difficulty: 'متوسط', difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'تعلم C/C++ لبرمجة المتحكمات المباشرة، و Python كأساس متين للذكاء الاصطناعي لاحقاً.',
    resources: [
      { type: 'course', title: 'دورة أساسيات C++ التفاعلية - أسامة الزيرو (عربي)', url: 'https://www.youtube.com/playlist?list=PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS' },
      { type: 'course', title: 'تعلم بايثون من الصفر (Kaggle)', url: 'https://www.kaggle.com/learn/python' },
      { type: 'article', title: 'لماذا بايثون و C++ هما الأهم في الروبوتات؟', url: 'https://spectrum.ieee.org/top-programming-languages/' }
    ], 
    project: 'كتابة خوارزمية فرز بسيطة بأي من اللغتين.'
  },
  {
    id: 4, branch: 'main', title: 'المحركات والمستشعرات', icon: Wrench, color: 'text-green-400', bgColor: 'bg-green-400/10', borderColor: 'border-green-400', difficulty: 'متوسط', difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'كيف يتحرك الروبوت ويشعر بمحيطه؟ استخدام محركات DC والسيرفو وحساسات المسافة.',
    hint: '💡 هنا نقطة التحول! بعد هذه المرحلة اختر تخصصك المفضل للتعمق أكثر.',
    resources: [
      { type: 'video', title: 'أنواع المحركات المستخدمة في الروبوتات (عربي)', url: 'https://www.youtube.com/watch?v=IrhiCf_cgKc' },
      { type: 'article', title: 'الدليل الشامل لاختيار محركات الروبوت (DroneBot)', url: 'https://dronebotworkshop.com/real-robot-003/' },
      { type: 'course', title: 'مشروع موجه: بناء روبوت متتبع للخط', url: 'https://projecthub.arduino.cc/lee_curiosity/building-a-line-following-robot-using-arduino-017dbb' }
    ], 
    project: 'بناء وبرمجة روبوت متتبع للخط (Line Follower) يتجنب الحواجز.'
  },

  // --- مسار الذكاء الاصطناعي والبرمجيات (يمين) ---
  {
    id: '5a', branch: 'ai', title: 'أنظمة التشغيل المتقدمة (ROS)', icon: Server, color: 'text-purple-400', bgColor: 'bg-purple-400/10', borderColor: 'border-purple-400', difficulty: 'متقدم', difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'الانتقال للروبوتات الذكية والمستقلة بالكامل باستخدام Raspberry Pi ونظام تشغيل الروبوتات (ROS2).',
    resources: [
      { type: 'course', title: 'المسار الرسمي لتعلم ROS2 (Humble)', url: 'https://docs.ros.org/en/humble/Tutorials.html' },
      { type: 'video', title: 'دورة أساسيات نظام ROS بالعربي (KroNton)', url: 'http://www.youtube.com/playlist?list=PLxEk9RJLlExVe3T7rCkpZXGQCW_5Wj5Nd' },
      { type: 'article', title: 'كيف تبدأ مع حاسوب Raspberry Pi؟', url: 'https://projects.raspberrypi.org/en/projects/raspberry-pi-getting-started' }
    ], 
    project: 'تحريك وتوجيه روبوت افتراضي (Turtlesim) في بيئة ROS.'
  },
  {
    id: '6a', branch: 'ai', title: 'الذكاء الاصطناعي ورؤية الحاسب', icon: Eye, color: 'text-teal-400', bgColor: 'bg-teal-400/10', borderColor: 'border-teal-400', difficulty: 'متقدم', difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'إعطاء الروبوت القدرة على الرؤية وتحليل الصور باستخدام OpenCV وتطبيق نماذج تعلم الآلة.',
    resources: [
      { type: 'course', title: 'دورة تعلم الآلة السريعة من Google', url: 'https://developers.google.com/machine-learning/crash-course' },
      { type: 'video', title: 'دورة رؤية الحاسب باستخدام OpenCV و Python', url: 'https://youtu.be/oXlwWbU8l2o' },
      { type: 'course', title: 'تدريب نماذج AI ببساطة (Teachable Machine)', url: 'https://teachablemachine.withgoogle.com/' }
    ], 
    project: 'برمجة كاميرا للتعرف على الوجوه أو تتبع الأشياء الملونة.'
  },

  // --- مسار الهاردوير والدوائر المطبوعة (يسار) ---
  {
    id: '5b', branch: 'hardware', title: 'تصميم الدوائر المطبوعة (PCB)', icon: Layers, color: 'text-orange-400', bgColor: 'bg-orange-400/10', borderColor: 'border-orange-400', difficulty: 'متقدم', difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'تخلص من الأسلاك المزعجة! تعلم تصميم اللوحات المطبوعة الاحترافية باستخدام برامج مثل KiCad.',
    resources: [
      { type: 'article', title: 'الدليل الرسمي لتصميم اللوحات ببرنامج KiCad', url: 'https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html' },
      { type: 'video', title: 'دورة عملية لتصميم PCB من الصفر (Phil\'s Lab)', url: 'https://youtu.be/aVUqaB0IMh4' },
      { type: 'course', title: 'دروس تصميم الدوائر بمتصفحك عبر EasyEDA', url: 'https://easyeda.com/page/tutorials' }
    ], 
    project: 'تصميم وطباعة لوحة تحكم (Shield) مخصصة لروبوتك.'
  },
  {
    id: '6b', branch: 'hardware', title: 'تصميم الهياكل والطباعة 3D', icon: Box, color: 'text-rose-400', bgColor: 'bg-rose-400/10', borderColor: 'border-rose-400', difficulty: 'خبير', difficultyColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'الروبوت يحتاج إلى جسد صلب! تعلم كيفية تصميم أجزاء الروبوت الميكانيكية (CAD) باستخدام Fusion 360 وطباعتها.',
    resources: [
      { type: 'video', title: 'دورة تصميم الأجزاء الميكانيكية بـ Fusion 360 (عربي)', url: 'https://www.youtube.com/watch?v=Tk9fSG0Aoq4' },
      { type: 'article', title: 'الدليل الشامل للمبتدئين في الطباعة ثلاثية الأبعاد', url: 'https://all3dp.com/1/3d-printing-for-beginners-all-you-need-to-know/' },
      { type: 'course', title: 'مكتبة تصميمات الروبوتات الجاهزة (Thingiverse)', url: 'https://www.thingiverse.com/search?q=robot+chassis' }
    ], 
    project: 'تصميم هيكل (Chassis) مخصص لروبوتك وطباعته لتركيب اللوحة (PCB) والمحركات داخله.'
  }

];