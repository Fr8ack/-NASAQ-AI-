import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Bookmark,
  Share2,
  Download,
  Layers,
  FileText,
  FlaskConical,
  Compass,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { ResearchResult, EvidenceLevel, VerifiedCitation } from '../../types/quran';
import { saveResearchStudy, exportResearchToMarkdown } from '../../services/researchStore';
import { User } from '../../lib/firebase';

interface QuranResearcherProps {
  user: User | null;
  initialQuery?: string;
  onOpenVerseInMushaf: (verseKey: string) => void;
  onOpenInHypothesisLab: (statement: string) => void;
  onSaveSuccess?: () => void;
}

export const QuranResearcher: React.FC<QuranResearcherProps> = ({
  user,
  initialQuery = '',
  onOpenVerseInMushaf,
  onOpenInHypothesisLab,
  onSaveSuccess
}) => {
  const [question, setQuestion] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('all');

  const researchStages = [
    'المرحلة 1: تفكيك السؤال واستخراج المفاهيم المركزية',
    'المرحلة 2: استرجاع الآيات ونظائر المفهوم من النص الموثق',
    'المرحلة 3: التحليل اللغوي وبنية الجمل والسياق الداخلي',
    'المرحلة 4: استخراج الفرضيات التفسيرية الممكنة',
    'المرحلة 5: المحاكمة النقدية ومحاولة نقض كل فرضية',
    'المرحلة 6: وزن الاستدلال وصياغة النتيجة المحكمة'
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setSaveStatus(null);
    setCurrentStep(1);

    // Simulate animated step progression for academic rigor feel
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < 5 ? prev + 1 : prev));
    }, 600);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `خطأ في الاتصال: ${res.status}`);
      }

      const data: ResearchResult = await res.json();
      clearInterval(stepInterval);
      setCurrentStep(6);
      setResult(data);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error("Research failed:", err);
      setError(err.message || 'تعذر استكمال البحث القرآني، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaveStatus('جاري الحفظ...');
    try {
      await saveResearchStudy(user ? user.uid : null, result);
      setSaveStatus('تم الحفظ بنجاح في مكتبة الأبحاث');
      if (onSaveSuccess) onSaveSuccess();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e: any) {
      setSaveStatus('تعذر الحفظ');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const md = exportResearchToMarkdown(result);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `بحث_قرآني_${result.question.substring(0, 30).replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEvidenceBadge = (level: EvidenceLevel) => {
    switch (level) {
      case 'نص صريح':
        return { color: 'bg-emerald-950 text-emerald-300 border-emerald-700', icon: CheckCircle2 };
      case 'استنتاج قوي مدعوم':
        return { color: 'bg-teal-950 text-teal-300 border-teal-700', icon: CheckCircle2 };
      case 'تفسير محتمل':
        return { color: 'bg-amber-950 text-amber-300 border-amber-700', icon: AlertTriangle };
      case 'فرضية بحثية':
        return { color: 'bg-indigo-950 text-indigo-300 border-indigo-700', icon: HelpCircle };
      default:
        return { color: 'bg-stone-900 text-stone-300 border-stone-700', icon: HelpCircle };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      
      {/* Research Form Box */}
      <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 shadow-xl text-right space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100">الباحث القرآني الذكي</h2>
              <p className="text-xs text-stone-400">تحقيق استدلالي داخلي وفق منهج «القرآن بالقرآن»</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-stone-950 text-emerald-400 border border-emerald-900">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>نصوص قرآنية محققة 100%</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="اكتب سؤالك البحثي أو المسألة القرآنية التي تريد استقراءها وتحليلها..."
              className="w-full bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl p-3.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none transition-all leading-relaxed resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="font-semibold text-emerald-400">الضوابط:</span>
              <span>لا روايات خارج القرآن • لا بتر للسياق • نقد كل فرضية قبل ترجيحها</span>
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري الاستقراء والتحليل...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>بدء الاستدلال القرآني</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Progress Stages during Loading */}
        {loading && (
          <div className="p-4 rounded-xl bg-stone-950 border border-emerald-900/60 space-y-3 mt-4 animate-pulse">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-medium">
              <span>{researchStages[currentStep - 1] || 'جاري المعالجة...'}</span>
              <span>{Math.round((currentStep / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Research Output Document */}
      {result && (
        <div className="space-y-6 text-right animate-fadeIn">
          
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center gap-2">
              {(() => {
                const badge = getEvidenceBadge(result.evidence_level);
                const Icon = badge.icon;
                return (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>مستوى الاستدلال:</span>
                    <span>{result.evidence_level}</span>
                  </div>
                );
              })()}
              <span className="text-xs text-stone-400 hidden sm:inline">
                ({result.evidence_reasoning})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>{saveStatus || 'حفظ في مكتبتي'}</span>
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>تصدير تقرير (Markdown)</span>
              </button>
            </div>
          </div>

          {/* Section 1: Summary */}
          <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <FileText className="w-4 h-4" />
              <h3>1. خلاصة الاستدلال الأولي</h3>
            </div>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans font-medium">
              {result.summary}
            </p>
          </div>

          {/* Section 2: Primary Quranic Citations */}
          <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <h3>2. الشواهد القرآنية الأساسية (نصوص موثقة برواية حفص)</h3>
              </div>
              <span className="text-xs text-stone-400">
                {result.primary_verses.length} شواهد محققة
              </span>
            </div>

            <div className="space-y-4">
              {result.primary_verses.map((citation, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-5 bg-stone-950 border border-emerald-900/40 hover:border-emerald-700/60 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        سورة {citation.surah_name}: آية {citation.ayah_number}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        ({citation.verse_key})
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenVerseInMushaf(citation.verse_key)}
                      className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      <span>فتح في المصحف</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="font-quran text-lg sm:text-xl text-stone-100 leading-loose">
                    ﴿ {citation.uthmani_text} ﴾
                  </p>

                  <div className="pt-1 text-xs text-stone-400 flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold shrink-0">وجه الاستدلال:</span>
                    <span>{citation.context_relation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Related Verses & Opposing Contexts */}
          {result.related_verses && result.related_verses.length > 0 && (
            <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-4">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <h3>3. الآيات ذات الصلة والسياقات المقابلة</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.related_verses.map((citation, idx) => (
                  <div key={idx} className="rounded-xl p-4 bg-stone-950 border border-stone-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-300">سورة {citation.surah_name} : {citation.ayah_number}</span>
                      <button
                        onClick={() => onOpenVerseInMushaf(citation.verse_key)}
                        className="text-stone-400 hover:text-emerald-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-quran text-base text-stone-200 line-clamp-3">
                      ﴿ {citation.uthmani_text} ﴾
                    </p>
                    <p className="text-[11px] text-stone-400">{citation.context_relation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Linguistic & Contextual Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Linguistic Analysis */}
            <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Compass className="w-4 h-4" />
                <h3>4. التحليل اللغوي والتركيبي</h3>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                {result.linguistic_analysis.vocabulary.map((v, i) => (
                  <div key={i} className="p-3 rounded-lg bg-stone-950 border border-stone-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-200">{v.term}</span>
                      {v.root && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-900 font-mono">
                          جذر: {v.root}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-400">{v.context_meaning}</p>
                  </div>
                ))}

                {result.linguistic_analysis.syntactic_structures.map((s, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-stone-950 text-stone-300 border border-stone-800/60">
                    • {s}
                  </div>
                ))}
                
                {result.linguistic_analysis.grammatical_notes && (
                  <p className="text-stone-400 text-[11px] italic">
                    ملاحظة نحوية: {result.linguistic_analysis.grammatical_notes}
                  </p>
                )}
              </div>
            </div>

            {/* Contextual Analysis */}
            <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-4">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <h3>5. التحليل السياقي متعدد الأبعاد</h3>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1">
                  <span className="font-bold text-stone-300 block">السياق المباشر (السابق واللاحق):</span>
                  <p className="text-stone-400">{result.contextual_analysis.immediate_context}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1">
                  <span className="font-bold text-stone-300 block">سياق السورة ومحورها:</span>
                  <p className="text-stone-400">{result.contextual_analysis.surah_context}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1">
                  <span className="font-bold text-stone-300 block">الاستعمال القرآني العام:</span>
                  <p className="text-stone-400">{result.contextual_analysis.holistic_quranic_context}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Section 5: Hypotheses & Counter-Arguments */}
          {result.hypotheses && result.hypotheses.length > 0 && (
            <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <FlaskConical className="w-4 h-4" />
                  <h3>6. الفرضيات التفسيرية ومحاولة نقضها</h3>
                </div>
                <span className="text-xs text-stone-400">نقد داخلي صارم</span>
              </div>

              <div className="space-y-4">
                {result.hypotheses.map((h, i) => (
                  <div key={i} className="rounded-xl p-5 bg-stone-950 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-stone-200">{h.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        درجة القوة: {h.plausibility}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed">{h.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40 space-y-1">
                        <span className="font-bold text-emerald-400 block">أدلة التأييد:</span>
                        {h.supporting_arguments.map((sa, idx) => (
                          <p key={idx} className="text-stone-300">• {sa}</p>
                        ))}
                      </div>

                      <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/40 space-y-1">
                        <span className="font-bold text-red-400 block">أدلة النقد والمعارضة:</span>
                        {h.counter_arguments.map((ca, idx) => (
                          <p key={idx} className="text-stone-300">• {ca}</p>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onOpenInHypothesisLab(h.description)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-800/60 transition-colors cursor-pointer"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>اختبار هذه الفرضية في مختبر الفرضيات</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Supported Conclusion & Unresolved Aspects */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-950 border border-emerald-700/50 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <CheckCircle2 className="w-5 h-5" />
              <h3>7. النتيجة المدعومة وما بقي غير محسوم</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-stone-950/80 border border-emerald-900/60 space-y-1">
                <span className="text-xs font-bold text-emerald-300 block">النتيجة المدعومة بالنص القرآني:</span>
                <p className="text-sm text-stone-200 leading-relaxed font-medium">
                  {result.supported_conclusion}
                </p>
              </div>

              {result.unresolved_aspects && result.unresolved_aspects.length > 0 && (
                <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-900/60 space-y-1.5">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>ما بقي مسكوتًا عنه في النص (لا يُجزم به من القرآن وحده):</span>
                  </span>
                  <ul className="list-disc list-inside text-xs text-stone-300 space-y-1">
                    {result.unresolved_aspects.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Follow-up Questions */}
            {result.follow_up_questions && result.follow_up_questions.length > 0 && (
              <div className="pt-2 space-y-2 border-t border-stone-800">
                <span className="text-xs font-bold text-stone-400 block">أسئلة ومسارات بحثية مقترحة:</span>
                <div className="flex flex-wrap gap-2">
                  {result.follow_up_questions.map((fq, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuestion(fq);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-emerald-300 border border-stone-800 transition-colors text-right cursor-pointer"
                    >
                      {fq}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
