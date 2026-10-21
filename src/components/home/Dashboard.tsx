import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  FlaskConical,
  Compass,
  Network,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  Download
} from 'lucide-react';
import { SavedResearchItem } from '../../services/researchStore';

interface DashboardProps {
  onSelectTab: (tab: string) => void;
  onLaunchResearch: (query: string) => void;
  recentResearches: SavedResearchItem[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectTab,
  onLaunchResearch,
  recentResearches
}) => {
  const [searchInput, setSearchInput] = useState('');

  const suggestedQuestions = [
    {
      title: 'مفهوم العبادة في الاستعمال القرآني',
      question: 'ما مفهوم العبادة من خلال الاستعمال القرآني وما الفرق بينها وبين الطاعة؟',
      tag: 'دلالي سياقي'
    },
    {
      title: 'الأمانة والاختيار في سورة الأحزاب',
      question: 'ما العلاقة بين الأمانة والاختيار في ضوء سورة الأحزاب 72؟',
      tag: 'فرضية واستدلال'
    },
    {
      title: 'استعمالات لفظ الروح في القرآن',
      question: 'كيف يُستخدم لفظ الروح في القرآن وما دلالته في سورة الإسراء 85 وسورة القدر؟',
      tag: 'استقراء لفظي'
    },
    {
      title: 'البعث مقابل الوقت المعلوم',
      question: 'ما الفرق السياقي بين طلب الإنظار إلى يوم يبعثون وبين الإجابة إلى يوم الوقت المعلوم (الحجر 36-38 وص 79-81)؟',
      tag: 'سياقي تركيبي'
    },
    {
      title: 'اختبار دلالة «حور عين»',
      question: 'كيف يمكن اختبار المعاني المحتملة لعبارة «حور عين» من خلال تتبع جميع مواضعها في القرآن؟',
      tag: 'تحليل مقارن'
    },
    {
      title: 'التقديم والتأخير في يس 20 والقصص 20',
      question: 'ما دلالة اختلاف ترتيب الكلمات بين (وجاء من أقصى المدينة رجل يسعى) في يس و(وجاء رجل من أقصى المدينة يسعى) في القصص؟',
      tag: 'بلاغة نظم'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onLaunchResearch(searchInput.trim());
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden border border-emerald-900/40 bg-gradient-to-b from-emerald-950/40 via-stone-900/60 to-stone-950 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/90 text-emerald-300 border border-emerald-800/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>منصة بحثية مستقلة بمحرك استدلال قرآني داخلي</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-100 tracking-tight leading-tight">
            نَسَق <span className="text-emerald-400 font-normal">|</span> NASAQ AI
          </h1>
          <p className="text-lg sm:text-xl text-emerald-300/90 font-medium font-quran">
            «القرآن يُبيّن بعضه بعضًا»
          </p>
          <p className="text-sm sm:text-base text-stone-400 max-w-2xl mx-auto leading-relaxed">
            محرك بحث استدلالي يتجاوز مجرد استرجاع التفسير الجاهز إلى قراءة السياق الداخلي، واستقراء الجذور، وتحليل بنية النظم، واختبار الفرضيات ومحاولة نقضها بنصوص محققة.
          </p>

          {/* Central Intelligent Input Box */}
          <form onSubmit={handleSubmit} className="pt-4">
            <div className="relative flex items-center bg-stone-900/90 border border-emerald-600/40 focus-within:border-emerald-400 rounded-2xl shadow-xl shadow-black/50 overflow-hidden transition-all p-1.5">
              <div className="p-3 text-emerald-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="اطرح سؤالًا بحثيًا، أو أدخل مفهومًا، أو قارن بين آيتين..."
                className="w-full bg-transparent px-2 py-3 text-sm sm:text-base text-stone-100 placeholder-stone-500 focus:outline-none text-right"
              />
              <button
                type="submit"
                disabled={!searchInput.trim()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                <span>بدء البحث</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Suggested In-depth Questions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>مسارات بحثية مقترحة لاختبار المحرك</span>
          </h2>
          <span className="text-xs text-stone-500">انقر للتحليل المباشر</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onLaunchResearch(q.question)}
              className="group text-right p-4 rounded-2xl bg-stone-900/50 hover:bg-stone-900 border border-stone-800/80 hover:border-emerald-700/60 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
                    {q.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-950 text-stone-400 border border-stone-800">
                    {q.tag}
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed group-hover:text-stone-300">
                  {q.question}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-500 font-medium group-hover:translate-x-[-2px] transition-transform">
                <span>توليد تقرير الاستدلال القرآني</span>
                <ArrowLeft className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tool Navigation Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-stone-300 flex items-center gap-2">
          <Compass className="w-4 h-4 text-teal-400" />
          <span>أدوات النظام المتخصصة</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => onSelectTab('mushaf')}
            className="p-5 rounded-2xl bg-stone-900/40 hover:bg-stone-900 border border-stone-800 hover:border-emerald-600/50 transition-all text-right group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-200 group-hover:text-emerald-300 mb-1">المصحف الذكي</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              تصفح كامل للـ 114 سورة مع فحص صرفي للكلمات ونسخ وتوثيق مباشر للآيات.
            </p>
          </button>

          <button
            onClick={() => onSelectTab('hypothesis')}
            className="p-5 rounded-2xl bg-stone-900/40 hover:bg-stone-900 border border-stone-800 hover:border-emerald-600/50 transition-all text-right group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-200 group-hover:text-amber-300 mb-1">مختبر الفرضيات</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              اختبار الفرضيات الجديدة وزر «حاول نقض فرضيتي» لبناء أقوى اعتراض قرآني ولغوي.
            </p>
          </button>

          <button
            onClick={() => onSelectTab('lexicon')}
            className="p-5 rounded-2xl bg-stone-900/40 hover:bg-stone-900 border border-stone-800 hover:border-emerald-600/50 transition-all text-right group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-800 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-200 group-hover:text-teal-300 mb-1">المعجم القرآني</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              تتبع الجذور والمشتقات، والتمييز بين التطابق اللفظي والاشتقاق، ومقارنة كلمتين.
            </p>
          </button>

          <button
            onClick={() => onSelectTab('graph')}
            className="p-5 rounded-2xl bg-stone-900/40 hover:bg-stone-900 border border-stone-800 hover:border-emerald-600/50 transition-all text-right group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-200 group-hover:text-indigo-300 mb-1">خريطة الترابط</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              رسم بياني تفاعلي يربط المفاهيم بالآيات والسور بنوع العلاقة الدلالية أو التركيبية.
            </p>
          </button>

        </div>
      </div>

      {/* Database Integrity & Methodology Status */}
      <div className="rounded-2xl p-5 bg-stone-900/60 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h4 className="text-sm font-bold text-stone-200">حالة قاعدة البيانات القرآنية ومحرك التحقق</h4>
            <p className="text-xs text-stone-400">
              114 سورة | 6236 آية مرقمة برواية حفص عن عاصم | مطابقة تامة للنص العثماني وفصل كامل عن النص التوليدي
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('methodology')}
            className="text-xs px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            معايير التحقق والمنهج
          </button>
        </div>
      </div>

      {/* Project Archive Download Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-stone-900/60 to-stone-900 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-100">تحميل حزمة الكود المصدري للمشروع كاملة (ZIP)</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">V1.3 • 0.96 MB</span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              تحتوي على 44 ملفاً: المدونة القرآنية الكاملة (6236 آية Tanzil Uthmani)، محرك التحقق والتوثيق، معجم الألفاظ، مختبر الفرضيات، وجميع أدوات واختبارات الجودة.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
          <a
            href="/nasap-ai-v1.3.zip"
            download="nasap-ai-v1.3.zip"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل ملف ZIP الآن</span>
          </a>
          <a
            href="/api/download-zip"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-all cursor-pointer"
            title="تنزيل عبر مسار API"
          >
            <span>عبر API</span>
          </a>
        </div>
      </div>

      {/* Recent Researches if any */}
      {recentResearches && recentResearches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>آخر الأبحاث المحفوظة في مكتبتك</span>
            </h2>
            <button
              onClick={() => onSelectTab('library')}
              className="text-xs text-emerald-400 hover:underline cursor-pointer"
            >
              عرض الكل ({recentResearches.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentResearches.slice(0, 3).map(r => (
              <div
                key={r.id}
                onClick={() => onSelectTab('library')}
                className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 hover:border-emerald-700/50 transition-all cursor-pointer text-right space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {r.evidence_level}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {new Date(r.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-stone-200 line-clamp-2">
                  {r.title}
                </h4>
                <p className="text-[11px] text-stone-400 line-clamp-2">
                  {r.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
