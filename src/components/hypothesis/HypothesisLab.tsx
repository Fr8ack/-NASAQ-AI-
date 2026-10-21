import React, { useState } from 'react';
import {
  FlaskConical,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  History,
  Bookmark,
  Share2,
  BookOpen,
  RefreshCw,
  Scale,
  Edit3
} from 'lucide-react';
import { HypothesisRecord, VerifiedCitation } from '../../types/quran';
import { saveHypothesisToStore } from '../../services/researchStore';
import { User } from '../../lib/firebase';

interface HypothesisLabProps {
  user: User | null;
  initialStatement?: string;
  onOpenVerseInMushaf: (verseKey: string) => void;
}

export const HypothesisLab: React.FC<HypothesisLabProps> = ({
  user,
  initialStatement = '',
  onOpenVerseInMushaf
}) => {
  const [statement, setStatement] = useState(
    initialStatement || 'الأمانة في سورة الأحزاب قد تكون مرتبطة بحرية الاختيار والمسؤولية التكليفية للإنسان.'
  );
  const [loadingRefutation, setLoadingRefutation] = useState(false);
  const [refutationData, setRefutationData] = useState<any | null>(null);
  const [userReply, setUserReply] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ statement: string; note: string; timestamp: string }>>([]);

  const handleAttemptRefutation = async () => {
    if (!statement.trim()) return;
    setLoadingRefutation(true);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/hypothesis/refute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement: statement.trim() })
      });

      if (!res.ok) {
        throw new Error('فشل محرك نقد الفرضيات');
      }

      const data = await res.json();
      setRefutationData(data);
    } catch (err) {
      console.error("Refutation request error:", err);
    } finally {
      setLoadingRefutation(false);
    }
  };

  const handleSaveHypothesis = async () => {
    if (!statement.trim()) return;
    setSaveStatus('جاري الحفظ...');

    const record: HypothesisRecord = {
      owner_id: user ? user.uid : 'guest_user',
      statement: statement.trim(),
      central_terms: refutationData?.central_terms?.join('، ') || '',
      supporting_evidence: refutationData?.supporting_verses || [],
      opposing_evidence: refutationData?.opposing_verses || [],
      counter_arguments: refutationData?.refutation_arguments || [],
      logical_deductions: refutationData?.contextual_boundaries || [],
      unsettled_questions: [],
      status: refutationData ? 'tested' : 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      revisions: history.map(h => ({
        statement: h.statement,
        reason_for_change: h.note,
        timestamp: h.timestamp
      }))
    };

    try {
      await saveHypothesisToStore(user ? user.uid : null, record);
      setSaveStatus('تم حفظ الفرضية ومسار نقدها بنجاح');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('تعذر الحفظ');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleRecordRevision = () => {
    if (!statement.trim()) return;
    setHistory(prev => [
      {
        statement: statement,
        note: revisionNotes || 'تعديل في ضوء الاعتراضات القرآنية',
        timestamp: new Date().toLocaleTimeString('ar-SA')
      },
      ...prev
    ]);
    setRevisionNotes('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-right">
      
      {/* Intro Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-950/40 via-stone-900 to-stone-900 border border-amber-900/50 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <FlaskConical className="w-5 h-5" />
          <h2>مختبر الفرضيات القرآنية (Hypothesis Lab)</h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          اطرح فرضيتك التفسيرية بحرية كاملة، لكن لا تعاملها كحقيقة مطلقة. المحرك لا يبحث عما يؤيدك فقط، بل يُشغّل أقوى اعتراض قرآني ولغوي لاختبار متانة الفرضية قبل اعتمادها.
        </p>
      </div>

      {/* Main Hypothesis Box */}
      <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-300">
            صياغة الفرضية التفسيرية:
          </label>
          <span className="text-[11px] text-stone-500">
            مثال: «الأمانة في الأحزاب 72 قد تكون مرتبطة بحرية الاختيار»
          </span>
        </div>

        <textarea
          rows={3}
          value={statement}
          onChange={e => setStatement(e.target.value)}
          placeholder="اكتب فرضيتك هنا بكل وضوح..."
          className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl p-3.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none resize-none leading-relaxed"
        />

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveHypothesis}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>{saveStatus || 'حفظ الفرضية'}</span>
            </button>

            <button
              onClick={handleRecordRevision}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تسجيل نسخة مراجعة</span>
            </button>
          </div>

          {/* Star Button: Attempt Refutation */}
          <button
            onClick={handleAttemptRefutation}
            disabled={loadingRefutation || !statement.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-950/40 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loadingRefutation ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري بناء الاعتراض القرآني...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>حاول نقض فرضيتي</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Refutation Results Display */}
      {refutationData && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Verdict Banner */}
          <div className="rounded-2xl p-5 bg-stone-900 border border-stone-800 flex items-start gap-3">
            <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-stone-200">التقييم النقدي لصلابة الفرضية:</h4>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {refutationData.verdict_assessment}
              </p>
            </div>
          </div>

          {/* Dual Evidence: Supporting vs Opposing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Opposing Evidence (The Refutations) */}
            <div className="rounded-2xl p-6 bg-red-950/20 border border-red-900/50 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <h3>الاعتراضات والشواهد المعارضة</h3>
              </div>

              <div className="space-y-3">
                {refutationData.refutation_arguments?.map((arg: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-stone-950/90 border border-red-900/40 text-xs text-stone-200 leading-relaxed">
                    <span className="font-bold text-red-400 block mb-1">اعتراض {i + 1}:</span>
                    {arg}
                  </div>
                ))}

                {refutationData.opposing_verses?.map((v: VerifiedCitation, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-red-300">سورة {v.surah_name}: {v.ayah_number}</span>
                      <button onClick={() => onOpenVerseInMushaf(v.verse_key)} className="text-stone-400 hover:text-emerald-400">
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-quran text-stone-100 text-sm">﴿ {v.uthmani_text} ﴾</p>
                    <p className="text-stone-400 text-[11px]">{v.context_relation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting Evidence */}
            <div className="rounded-2xl p-6 bg-emerald-950/20 border border-emerald-900/50 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <h3>الشواهد والقرائن المؤيدة</h3>
              </div>

              <div className="space-y-3">
                {refutationData.supporting_verses?.map((v: VerifiedCitation, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-300">سورة {v.surah_name}: {v.ayah_number}</span>
                      <button onClick={() => onOpenVerseInMushaf(v.verse_key)} className="text-stone-400 hover:text-emerald-400">
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-quran text-stone-100 text-sm">﴿ {v.uthmani_text} ﴾</p>
                    <p className="text-stone-400 text-[11px]">{v.context_relation}</p>
                  </div>
                ))}

                {refutationData.linguistic_alternatives?.length > 0 && (
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1.5">
                    <span className="font-bold text-stone-300 block">احتمالات لغوية بديلة:</span>
                    {refutationData.linguistic_alternatives.map((alt: string, i: number) => (
                      <p key={i} className="text-stone-400">• {alt}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* User Defense / Counter-Refutation Note */}
          <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-3">
            <h4 className="text-xs font-bold text-stone-200">
              مراجعة الباحث والرد على الاعتراضات:
            </h4>
            <textarea
              rows={2}
              value={userReply}
              onChange={e => setUserReply(e.target.value)}
              placeholder="اكتب ملاحظاتك على الاعتراضات، أو كيف تعدل فرضيتك لتتجاوز الإشكالات المثارة..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-emerald-600 resize-none"
            />
          </div>

        </div>
      )}

      {/* Revision History */}
      {history.length > 0 && (
        <div className="rounded-2xl p-6 bg-stone-900/50 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-400 font-bold text-xs">
            <History className="w-4 h-4" />
            <span>سجل النسخ والمراجعات السابقة</span>
          </div>

          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="p-3 rounded-xl bg-stone-950 border border-stone-800/80 text-xs space-y-1">
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>النسخة {history.length - i}</span>
                  <span>{h.timestamp}</span>
                </div>
                <p className="text-stone-200 font-medium">{h.statement}</p>
                <p className="text-stone-400 text-[11px] italic">سبب التعديل: {h.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
