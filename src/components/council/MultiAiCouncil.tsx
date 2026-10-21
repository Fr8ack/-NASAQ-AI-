import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  Search,
  Scale
} from 'lucide-react';
import { ResearchCouncilMember } from '../../types/quran';

export const MultiAiCouncil: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('evidence');

  const members: ResearchCouncilMember[] = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      provider: 'gemini',
      model_name: 'gemini-3.8-flash',
      role_title: 'المحرك الاستدلالي الافتراضي',
      role_description: 'استخراج الشواهد، استقراء السياق القرآني، وتحليل الفرضيات بالربط مع محرك التحقق البرمجي',
      status: 'active'
    },
    {
      id: 'openai',
      name: 'OpenAI (GPT-4o / o1)',
      provider: 'openai',
      model_name: 'gpt-4o-quranic-pipeline',
      role_title: 'مدقق التعارضات اللغوية',
      role_description: 'فحص الاحتمالات النحوية والبلاغية البديلة ومقارنة أساليب النظم',
      status: 'disconnected'
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      provider: 'claude',
      model_name: 'claude-3-7-sonnet',
      role_title: 'المحكم النقدي المستقل',
      role_description: 'محاولة نقض الفرضيات واستخراج الثغرات الاستدلالية',
      status: 'disconnected'
    },
    {
      id: 'opensource',
      name: 'Open Arabic LLM (Falcon / Jais)',
      provider: 'open_source',
      model_name: 'jais-13b-chat',
      role_title: 'المعجمي العربي الحسابي',
      role_description: 'تتبع المعاجم التراثية ومقارنة الاشتقاق الجذري',
      status: 'planned'
    }
  ];

  const councilRoles = [
    {
      id: 'evidence',
      title: 'الباحث الأول: مستخرج الأدلة والشواهد',
      description: 'مسؤول عن استقراء نصوص الآيات بدقة وإرسال معرّفات الآيات فقط إلى محرك التحقق دون توليد نصوص ذاتية.',
      activeProvider: 'Google Gemini (نشط)'
    },
    {
      id: 'linguistic',
      title: 'الباحث الثاني: المحلل اللغوي والسياقي',
      description: 'مسؤول عن دراسة تراكيب الجمل، والضمائر، وأدوات الشرط والنفي والاستثناء، وسياق السورة الكاملة.',
      activeProvider: 'Google Gemini (نشط)'
    },
    {
      id: 'refuter',
      title: 'الباحث الثالث: الناقد وباحث المعارضات',
      description: 'مهمته الحصرية البحث عما يضعف الفرضية وينقضها من القرآن، ومنع تأكيد أي دعوى لم يثبتها النص.',
      activeProvider: 'Google Gemini (نشط)'
    },
    {
      id: 'comparator',
      title: 'الباحث الرابع: مقارن الفرضيات',
      description: 'مقارنة التفسيرات المتنافسة وكشف الفروق بينها دون تفضيل مسبق لرأي على آخر.',
      activeProvider: 'Google Gemini (نشط)'
    },
    {
      id: 'synthesizer',
      title: 'المراجع النهائي: موازن النتائج',
      description: 'صياغة التقرير النهائي، مع بيان مواضع الاتفاق، وما بقي غير محسوم ومسكوتًا عنه.',
      activeProvider: 'Google Gemini (نشط)'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-right">
      
      {/* Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-900/50 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
          <Users className="w-5 h-5" />
          <h2>مجلس النماذج البحثي (Multi-AI Research Council)</h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          بنية استدلالية تعاونية تقسم مهام البحث القرآني بين أدوار متخصصة (استخراج الأدلة، التحليل اللغوي، النقد، والمراجعة). التزامًا بالشفافية العلمية، لا نُظهر استجابات وهمية لمزودين غير متصلين.
        </p>
      </div>

      {/* Model Providers Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-stone-400">حالة مزودي الذكاء الاصطناعي في المنصة:</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map(m => (
            <div
              key={m.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                m.status === 'active'
                  ? 'bg-emerald-950/30 border-emerald-700/60 shadow-lg shadow-emerald-950/20'
                  : 'bg-stone-900/40 border-stone-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-200">{m.name}</span>
                {m.status === 'active' ? (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>مفعّل</span>
                  </span>
                ) : m.status === 'disconnected' ? (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-stone-950 text-stone-500 border border-stone-800">
                    <Lock className="w-3 h-3" />
                    <span>غير متصل</span>
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-950 text-stone-500 border border-stone-800">
                    مخطط
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-300/80 block">{m.role_title}</span>
                <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-3">
                  {m.role_description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-800/80 text-[10px] text-stone-500 font-mono">
                {m.model_name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Council Research Roles Breakdown */}
      <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-4">
        <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>الأدوار البحثية الخمسة داخل المحرك</span>
        </h3>

        <div className="space-y-3">
          {councilRoles.map(role => (
            <div
              key={role.id}
              className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-emerald-300 text-sm">{role.title}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">
                  المشغّل: {role.activeProvider}
                </span>
              </div>
              <p className="text-stone-300 leading-relaxed font-sans">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Principle Notice */}
      <div className="rounded-xl p-4 bg-stone-950 border border-stone-800 text-xs text-stone-400 space-y-1">
        <span className="font-bold text-stone-300 block">قاعدة المنهج الصارمة:</span>
        <p>
          «موافقة النماذج مؤشر للمقارنة لا دليل مستقل على صحة التفسير، والدليل الوحيد المعتمد هو النص القرآني بسياقه الداخلي ولغته».
        </p>
      </div>

    </div>
  );
};
