import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Scale,
  Layers,
  ArrowLeft,
  AlertTriangle,
  Lock,
  Sparkles
} from 'lucide-react';

interface MethodologySpecsProps {
  onRunTestCase: (query: string) => void;
}

export const MethodologySpecs: React.FC<MethodologySpecsProps> = ({ onRunTestCase }) => {
  const testCases = [
    {
      surah: 'الأحزاب 72-73',
      title: 'مسألة الأمانة والتكليف الإنساني',
      query: 'ما دلالة الأمانة في سورة الأحزاب 72 وما علاقتها بالاختيار والمسؤولية في ضوء الآية 73؟',
      focus: 'قضية الأمانة ووصف الإنسان بالظلم والجهل وارتباط التكليف بالثواب والعقاب'
    },
    {
      surah: 'الزخرف 81',
      title: 'تحليل أسلوب الشرط ومعنى العبادة',
      query: 'حلل أسلوب الشرط في قوله تعالى (قل إن كان للرحمن ولد فأنا أول العابدين) في سورة الزخرف 81 ودلالة لفظ العابدين',
      focus: 'أسلوب الشرط المنطقي في القرآن لإبطال المحال وتنزيه الذات الإلهية'
    },
    {
      surah: 'الذاريات 56',
      title: 'حصر علة خلق الجن والإنس في العبادة',
      query: 'ما دلالة أسلوب النفي والاستثناء في (وما خلقت الجن والإنس إلا ليعبدون) في سورة الذاريات 56 وسياقها اللاحق؟',
      focus: 'أسلوب الحصر المطلق وبيان استغناء الله عن الرزق والإطعام'
    },
    {
      surah: 'يس 60-61',
      title: 'التقابل بين عبادة الشيطان وعبادة الله',
      query: 'ما الفرق السياقي والدلالي بين عبادة الشيطان وعبادة الله في سورة يس 60-61؟',
      focus: 'التقابل الدلالي بين الانقياد للعدو المبين والصراط المستقيم'
    },
    {
      surah: 'الدخان 54',
      title: 'استقراء ونقد معاني «حور عين»',
      query: 'كيف يمكن استقراء واختبار المعاني المحتملة لعبارة «حور عين» في سياقات سور الدخان والطور والواقعة والرحمن؟',
      focus: 'التحقيق اللغوي الدقيق والتشبيه باللؤلؤ المصون'
    },
    {
      surah: 'الحجر 36-38',
      title: 'طلب الإنظار والوقت المعلوم',
      query: 'ما الفارق الدقيق بين طلب الإنظار إلى يوم يبعثون وبين التحديد الإلهي إلى يوم الوقت المعلوم (الحجر 36-38 وص 79-81)؟',
      focus: 'دقة استجابة القرآن المقيدة بعدم الخلود إلى ما بعد البعث'
    },
    {
      surah: 'يس 20 والقصص 20',
      title: 'اختلاف ترتيب الكلمات (التقديم والتأخير)',
      query: 'ما الغرض البلاغي والسياقي من تقديم شبه الجملة في (وجاء من أقصى المدينة رجل) في يس وتأخيرها في (وجاء رجل من أقصى المدينة) في القصص؟',
      focus: 'اختلاف رتبة الفاعل وشبه الجملة لاختلاف مقتضى حال السياق'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-right">
      
      {/* Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-900/50 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
          <ShieldCheck className="w-5 h-5" />
          <h2>منهج الاستدلال ومحرك التحقق القرآني</h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          القواعد الصارمة والضوابط المنهجية التي تضمن استقلالية البحث، وحصانة النص القرآني من الاختلاق، ونقد الفرضيات قبل اعتمادها.
        </p>
      </div>

      {/* The 5 Canonical Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="rounded-2xl p-5 bg-stone-900/80 border border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <h3>1. القرآن هو المصدر الأساسي (القرآن بالقرآن)</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            الاستدلال الداخلي ينطلق من الآية نفسها، ثم سياقها السابق واللاحق، ثم سياق السورة الكاملة، ثم نظائرها في القرآن، والعلاقات النحوية والدلالية. لا تُدخل الأحاديث أو كتب التفسير كأدلة ملزمة في هذا الوضع.
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-stone-900/80 border border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <h3>2. الحصانة النصية ومنع التوليد الذاتي للآيات</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            لا يُسمح للنموذج بتوليد نصوص الآيات من ذاكرته. يتسلم محرك التحقق معرّفات الآيات (surah:ayah)، ويتحقق من مطابقتها الحرفية لقاعدة البيانات المعتمدة برواية حفص عن عاصم قبل عرض النص الأصلي كاملًا.
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-stone-900/80 border border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Scale className="w-4 h-4" />
            <h3>3. نقد الفرضيات والبحث عما ينقضها</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            لا يقتصر النظام على جمع أدلة التأييد، بل يُلزم نفسه باستخراج أدلة المعارضة والإشكالات النصية التي تضعف الفرضية قبل اعتماد أي ترجيح، وتوفير زر «حاول نقض فرضيتي».
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-stone-900/80 border border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <h3>4. درجات الاستدلال الموثقة (عدم اختلاق اليقين)</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            التمييز الصريح والملزم بين خمسة مستويات: (نص صريح، استنتاج قوي مدعوم، تفسير محتمل، فرضية بحثية، غير محسوم). لا تُستخدم نسب ثقة رقمية وهمية غير معايرة علميًا.
          </p>
        </div>

      </div>

      {/* 7 Critical Benchmark Test Cases */}
      <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>حالات الاختبار النقدية السبع (Critical Test Benchmarks)</span>
          </h3>
          <span className="text-xs text-stone-400">انقر لتشغيل الاختبار المباشر</span>
        </div>

        <div className="space-y-3">
          {testCases.map((tc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 hover:border-emerald-700/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-300">{tc.title}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900 font-mono">
                    {tc.surah}
                  </span>
                </div>
                <p className="text-stone-400 leading-relaxed">{tc.focus}</p>
              </div>

              <button
                onClick={() => onRunTestCase(tc.query)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow transition-all shrink-0 cursor-pointer"
              >
                <span>تشغيل في الباحث</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
