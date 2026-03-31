// src/data/roadmapData.ts
import { Zap, Cpu, Code, Wrench, Server, Eye, Layers, Box, Sliders, GitBranch, Wifi, Cloud, SmartphoneNfc } from 'lucide-react';
import type { Stage } from '../types';

export const roadmapData: Stage[] = [
  // ==========================================
  // --- المسار الأساسي (للجميع) ---
  // ==========================================
  {
    id: 1, branch: 'main', title: 'أساسيات الإلكترونيات', icon: Zap, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400', difficulty: 'مبتدئ', difficultyColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'قبل بناء أي روبوت، يجب أن تفهم كيف تتدفق الكهرباء. تعلم أساسيات الجهد، التيار، المقاومة، وكيفية استخدام لوحة التجارب (Breadboard).',
    resources: [
      { type: 'video', title: 'دورة الإلكترونيات العملية (م. وليد عيسى)', url: 'https://youtube.com/playlist?list=PLww54WQ2wa5rOJ7FcXxi-CMNgmpybv7ei' },
      { type: 'course', title: 'تطبيق عملي: محاكي الدوائر Tinkercad', url: 'https://www.tinkercad.com/learn/circuits' }
    ],
    project: 'إضاءة LED باستخدام زر ضغاط ومقاومة، وتجربتها على المحاكي أولاً.'
  },
  {
    id: 2, branch: 'main', title: 'المتحكمات الدقيقة', icon: Cpu, color: 'text-blue-400', bgColor: 'bg-blue-400/10', borderColor: 'border-blue-400', difficulty: 'مبتدئ', difficultyColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'المتحكم هو "عقل" الروبوت. رحلتك مع Arduino لربط المكونات بالبرمجة.',
    resources: [
      { type: 'video', title: 'دورة أردوينو الشاملة للمبتدئين', url: 'https://youtu.be/zJ-LqeX_fLU' },
      { type: 'course', title: 'الدروس الرسمية خطوة بخطوة (Arduino Docs)', url: 'https://docs.arduino.cc/tutorials/' }
    ], 
    project: 'برمجة إشارة مرور ضوئية تفاعلية.'
  },
  {
    id: 3, branch: 'main', title: 'أساسيات البرمجة للروبوتات', icon: Code, color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400', difficulty: 'متوسط', difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'تعلم C/C++ لبرمجة المتحكمات المباشرة، و Python كأساس متين للذكاء الاصطناعي لاحقاً.',
    resources: [
      { type: 'course', title: 'دورة أساسيات C++ التفاعلية - أسامة الزيرو', url: 'https://www.youtube.com/playlist?list=PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS' },
      { type: 'course', title: 'تعلم بايثون من الصفر (Kaggle)', url: 'https://www.kaggle.com/learn/python' }
    ], 
    project: 'كتابة خوارزمية فرز بسيطة بأي من اللغتين.'
  },
  {
    id: 4, branch: 'main', title: 'المحركات والمستشعرات', icon: Wrench, color: 'text-green-400', bgColor: 'bg-green-400/10', borderColor: 'border-green-400', difficulty: 'متوسط', difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'كيف يتحرك الروبوت ويشعر بمحيطه؟ استخدام محركات DC والسيرفو وحساسات المسافة.',
    resources: [
      { type: 'article', title: 'الدليل الشامل لاختيار محركات الروبوت (DroneBot)', url: 'https://dronebotworkshop.com/real-robot-003/' },
      { type: 'course', title: 'مشروع: بناء روبوت متتبع للخط الأساسي', url: 'https://projecthub.arduino.cc/lee_curiosity/building-a-line-following-robot-using-arduino-017dbb' }
    ], 
    project: 'بناء وبرمجة روبوت متتبع للخط (Line Follower) يتجنب الحواجز.'
  },
  {
    id: 5, branch: 'main', title: 'نظرية التحكم (PID Controller)', icon: Sliders, color: 'text-indigo-400', bgColor: 'bg-indigo-400/10', borderColor: 'border-indigo-400', difficulty: 'متقدم', difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'تعلم كيف تجعل حركة الروبوت ناعمة واحترافية باستخدام المعادلات الرياضية (PID) لضبط السرعة والتوجيه.',
    hint: '💡 هنا نقطة التحول الكبرى! الآن سيتشعب مسارك لـ 3 تخصصات دقيقة، اختر ما يثير شغفك.',
    resources: [
      { type: 'video', title: 'شرح مبسط لخوارزمية PID (عربي)', url: 'https://www.youtube.com/watch?v=kYJz1n6G33s' }
    ], 
    project: 'تطوير كود روبوت تتبع الخط باستخدام معادلة PID ليتحرك بسرعة وثبات على المنعطفات.'
  },

  // ==========================================
  // --- مسار الهاردوير (يسار) ---
  // ==========================================
  {
    id: '6a', branch: 'hardware', title: 'تصميم الدوائر المطبوعة (PCB)', icon: Layers, color: 'text-orange-400', bgColor: 'bg-orange-400/10', borderColor: 'border-orange-400', difficulty: 'متقدم', difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'تخلص من الأسلاك المزعجة! تعلم تصميم اللوحات المطبوعة الاحترافية باستخدام برامج مثل KiCad.',
    resources: [
      { type: 'video', title: 'دورة عملية لتصميم PCB من الصفر', url: 'https://youtu.be/aVUqaB0IMh4' },
      { type: 'course', title: 'دروس تصميم الدوائر بمتصفحك عبر EasyEDA', url: 'https://easyeda.com/page/tutorials' }
    ], 
    project: 'تصميم وطباعة لوحة تحكم (Shield) مخصصة لروبوتك.'
  },
  {
    id: '7a', branch: 'hardware', title: 'تصميم الهياكل والطباعة 3D', icon: Box, color: 'text-rose-400', bgColor: 'bg-rose-400/10', borderColor: 'border-rose-400', difficulty: 'خبير', difficultyColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'الروبوت يحتاج إلى جسد صلب! تعلم كيفية تصميم أجزاء الروبوت الميكانيكية (CAD) باستخدام Fusion 360 وطباعتها.',
    resources: [
      { type: 'video', title: 'دورة تصميم الأجزاء الميكانيكية بـ Fusion 360', url: 'https://www.youtube.com/watch?v=Tk9fSG0Aoq4' }
    ], 
    project: 'تصميم هيكل (Chassis) مخصص لروبوتك وطباعته لتركيب اللوحة والمحركات داخله.'
  },

  // ==========================================
  // --- مسار إنترنت الأشياء (المنتصف - جديد) ---
  // ==========================================
  {
    id: '6b', branch: 'iot', title: 'أساسيات الاتصال (ESP32 & Wi-Fi)', icon: Wifi, color: 'text-cyan-400', bgColor: 'bg-cyan-400/10', borderColor: 'border-cyan-400', difficulty: 'متوسط', difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'وداعاً للأردوينو التقليدي! مرحباً بلوحة ESP32. تعلم كيفية ربط المتحكم بشبكة الواي فاي وإنشاء خادم ويب محلي (Web Server).',
    resources: [
      { type: 'video', title: 'دورة ESP32 و IoT بالعربي', url: 'https://www.youtube.com/playlist?list=PLUKyI8ySgdwp4pgcKDRrWqkERrJXmknZ0' }
    ], 
    project: 'تصميم صفحة ويب بسيطة لبرمجة الروبوت للتحرك يميناً ويساراً عبر متصفح الجوال.'
  },
  {
    id: '7b', branch: 'iot', title: 'بروتوكولات الآلات والسحابة (MQTT)', icon: Cloud, color: 'text-blue-400', bgColor: 'bg-blue-400/10', borderColor: 'border-blue-400', difficulty: 'متقدم', difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'الروبوتات تتحدث لغة MQTT السريعة والخفيفة. تعلم ربط روبوتك بمنصات سحابية مثل Firebase أو Blynk للتحكم به من أي مكان بالعالم.',
    resources: [
      { type: 'article', title: 'إنشاء لوحة تحكم سحابية عبر منصة Blynk', url: 'https://blynk.io/blog/getting-started-with-blynk' },
      { type: 'video', title: 'شرح بروتوكول MQTT للروبوتات', url: 'https://www.youtube.com/watch?v=EHJVJm11l5I' }
    ], 
    project: 'بناء لوحة تحكم سحابية (Dashboard) تعرض قراءات حساسات الروبوت المباشرة (Telemetry).'
  },
  {
    id: '8b', branch: 'iot', title: 'ذكاء الأشياء (AIoT & TinyML)', icon: SmartphoneNfc, color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-400', difficulty: 'خبير', difficultyColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'قمة مسار الإنترنت! دمج الـ IoT مع الذكاء الاصطناعي المصغر. تشغيل نماذج تعلم الآلة مباشرة على شريحة ESP32-CAM (Edge Computing).',
    resources: [
      { type: 'article', title: 'دليل البدء مع ESP32-CAM والرؤية الحاسوبية', url: 'https://randomnerdtutorials.com/esp32-cam-video-streaming-face-recognition-arduino-ide/' }
    ], 
    project: 'برمجة كاميرا الروبوت للتعرف على الوجوه، وإرسال تنبيه لتطبيق تليجرام عند رصد شخص غريب.'
  },

  // ==========================================
  // --- مسار الذكاء الاصطناعي والبرمجيات (يمين) ---
  // ==========================================
  {
    id: '6c', branch: 'ai', title: 'إدارة الأكواد والمحاكاة', icon: GitBranch, color: 'text-slate-400', bgColor: 'bg-slate-400/10', borderColor: 'border-slate-400', difficulty: 'متوسط', difficultyColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'تعلم استخدام Git/GitHub للعمل كفريق، واختبر أكواد روبوتك في بيئة محاكاة فيزيائية 3D مثل Webots لتوفير الميزانية وتجنب الحوادث.',
    resources: [
      { type: 'course', title: 'دورة محاكي Webots الرسمية', url: 'https://cyberbotics.com/doc/guide/tutorials' },
      { type: 'article', title: 'دليل أوامر Git الأساسية', url: 'https://education.github.com/git-cheat-sheet-education.pdf' }
    ], 
    project: 'برمجة روبوت افتراضي داخل Webots لتجنب الحواجز في متاهة، ورفع الكود على GitHub.'
  },
  {
    id: '7c', branch: 'ai', title: 'الذكاء الاصطناعي ورؤية الحاسب', icon: Eye, color: 'text-teal-400', bgColor: 'bg-teal-400/10', borderColor: 'border-teal-400', difficulty: 'متقدم', difficultyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'إعطاء الروبوت القدرة على الرؤية وتحليل الصور باستخدام OpenCV وتطبيق نماذج تعلم الآلة.',
    resources: [
      { type: 'course', title: 'دورة تعلم الآلة السريعة من Google', url: 'https://developers.google.com/machine-learning/crash-course' },
      { type: 'video', title: 'دورة رؤية الحاسب باستخدام OpenCV و Python', url: 'https://youtu.be/oXlwWbU8l2o' }
    ], 
    project: 'برمجة كاميرا للتعرف على الوجوه أو تتبع كرة ملونة ليلتفت الروبوت نحوها.'
  },
  {
    id: '8c', branch: 'ai', title: 'أنظمة تشغيل الروبوتات (ROS2)', icon: Server, color: 'text-purple-400', bgColor: 'bg-purple-400/10', borderColor: 'border-purple-400', difficulty: 'خبير', difficultyColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'المعيار الصناعي العالمي! الانتقال للروبوتات الذكية والمستقلة بالكامل باستخدام نظام تشغيل الروبوتات المتزامن (ROS2).',
    resources: [
      { type: 'course', title: 'المسار الرسمي لتعلم ROS2 (Humble)', url: 'https://docs.ros.org/en/humble/Tutorials.html' },
      { type: 'video', title: 'دورة أساسيات نظام ROS بالعربي (KroNton)', url: 'http://www.youtube.com/playlist?list=PLxEk9RJLlExVe3T7rCkpZXGQCW_5Wj5Nd' }
    ], 
    project: 'إنشاء عقد برمجية (Nodes) لنشر قراءات الحساسات وتوجيه أوامر الحركة في بيئة ROS.'
  }
];