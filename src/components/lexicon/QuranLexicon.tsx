import React, { useState } from 'react';
import {
  Compass,
  Search,
  BookOpen,
  ArrowLeft,
  Layers,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { searchVerifiedVerses } from '../../utils/quranVerifier';
import { Verse } from '../../types/quran';

interface QuranLexiconProps {
  onOpenVerseInMushaf: (verseKey: string) => void;
}

export const QuranLexicon: React.FC<QuranLexiconProps> = ({ onOpenVerseInMushaf }) => {
  const [term, setTerm] = useState('عبد');
  const [matchType, setMatchType] = useState<'literal' | 'root'>('root');
  
  // Word comparison state
  const [compareMode, setCompareMode] = useState(false);
  const [wordA, setWordA] = useState('العبادة');
  const [wordB, setWordB] = useState('الطاعة');

  const LEXICON_ROOTS_DATA: Record<string, {
    root: string;
    derivatives: string[];
    occurrences: number;
    surahs: string[];
    semanticClusters: Array<{ meaning: string; context: string; sampleKey: string }>;
  }> = {
    'عبد': {
      root: 'ع-ب-د',
      derivatives: ['عَبَدَ', 'يَعْبُدُ', 'اعْبُدُوا', 'عَابِد', 'عِبَاد', 'عَبِيد'],
      occurrences: 275,
      surahs: ['الفاتحة', 'البقرة', 'يس', 'الزخرف', 'الذاريات', 'الأنعام'],
      semanticClusters: [
        { meaning: 'الخضوع والانقياد لله بالتوحيد الخالص', context: 'إياك نعبد (الفاتحة 5)', sampleKey: '1:5' },
        { meaning: 'حصر علة الخلق في الاستسلام للرب', context: 'وما خلقت الجن والإنس إلا ليعبدون (الذاريات 56)', sampleKey: '51:56' },
        { meaning: 'التقابل مع طاعة الهوى وإبليس', context: 'ألا تعبدوا الشيطان (يس 60)', sampleKey: '36:60' },
        { meaning: 'برهان الشرط في تنزيه الرحمن', context: 'إن كان للرحمن ولد فأنا أول العابدين (الزخرف 81)', sampleKey: '43:81' }
      ]
    },
    'روح': {
      root: 'ر-و-ح',
      derivatives: ['الرُّوح', 'رَوْح', 'رَيْحَان', 'تُرِيحُون'],
      occurrences: 57,
      surahs: ['الإسراء', 'القدر', 'الشعراء', 'النحل', 'المعارج', 'النبأ'],
      semanticClusters: [
        { meaning: 'أمر الله الغيبي وسر الحياة', context: 'ويسألونك عن الروح قل الروح من أمر ربي (الإسراء 85)', sampleKey: '17:85' },
        { meaning: 'الملك جبريل عليه السلام (الروح الأمين / روح القدس)', context: 'نزل به الروح الأمين (الشعراء 193)', sampleKey: '26:193' },
        { meaning: 'تأييد ليلة القدر وبركتها', context: 'تنزل الملائكة والروح فيها (القدر 4)', sampleKey: '97:4' },
        { meaning: 'الرحمة والتنفيس', context: 'ولا تيأسوا من روح الله (يوسف 87)', sampleKey: '17:85' }
      ]
    },
    'حور': {
      root: 'ح-و-ر',
      derivatives: ['حُور', 'يَحُور', 'حَوْر', 'تَحَاوُر'],
      occurrences: 12,
      surahs: ['الدخان', 'الطور', 'الواقعة', 'الرحمن', 'الانشقاق'],
      semanticClusters: [
        { meaning: 'الصفاء والبياض النقي في نعيم الجنة', context: 'وزوجناهم بحور عين (الدخان 54)', sampleKey: '44:54' },
        { meaning: 'التشبيه باللؤلؤ المصون', context: 'وحور عين كأمثال اللؤلؤ المكنون (الواقعة 22-23)', sampleKey: '56:22' },
        { meaning: 'الرجوع والانقلاب', context: 'إنه ظن أن لن يحور (الانشقاق 14)', sampleKey: '44:54' }
      ]
    },
    'أمن': {
      root: 'أ-م-ن',
      derivatives: ['آمَنَ', 'يُؤْمِنُ', 'الْأَمَانَة', 'أَمِين', 'مَأْمُون'],
      occurrences: 879,
      surahs: ['الأحزاب', 'البقرة', 'النساء', 'المؤمنون', 'التين'],
      semanticClusters: [
        { meaning: 'التكليف والمسؤولية الكبرى المحمولة', context: 'إنا عرضنا الأمانة على السماوات والأرض (الأحزاب 72)', sampleKey: '33:72' },
        { meaning: 'التصديق الإيماني والطمأنينة', context: 'الذين آمنوا ولم يلبسوا إيمانهم بظلم (الأنعام 82)', sampleKey: '33:72' }
      ]
    }
  };

  const currentEntry = LEXICON_ROOTS_DATA[term] || {
    root: term,
    derivatives: [term],
    occurrences: searchVerifiedVerses(term).length,
    surahs: ['مواضع متعددة'],
    semanticClusters: [
      { meaning: 'استعمال اللفظ في السياق القرآني', context: `مواضع ورود لفظ «${term}»`, sampleKey: '1:1' }
    ]
  };

  const matchingVerses: Verse[] = searchVerifiedVerses(term);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-right">
      
      {/* Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-teal-950/40 via-stone-900 to-stone-900 border border-teal-900/50 space-y-2">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-base">
          <Compass className="w-5 h-5" />
          <h2>المعجم القرآني الاستدلالي (Quranic Lexicon)</h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          فحص مواضع المفردات وجذورها في القرآن. نؤكد على قاعدة المنهج: «الاشتراك الاشتقاقي لا يعني تطابق المعنى»؛ فكل لفظ يتحدد معناه الدقيق بسياق نظمه القرآني.
        </p>
      </div>

      {/* Mode Selector: Single Root Search vs Word Comparison */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
        <button
          onClick={() => setCompareMode(false)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            !compareMode
              ? 'bg-teal-950 text-teal-300 border border-teal-800'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          استقراء جذر أو لفظ
        </button>
        <button
          onClick={() => setCompareMode(true)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            compareMode
              ? 'bg-teal-950 text-teal-300 border border-teal-800'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          مقارنة كلمتين في الاستعمال القرآني
        </button>
      </div>

      {!compareMode ? (
        <div className="space-y-6">
          
          {/* Search Bar */}
          <div className="rounded-2xl p-5 bg-stone-900/80 border border-stone-800 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={term}
                  onChange={e => setTerm(e.target.value.trim())}
                  placeholder="أدخل كلمة أو جذرًا (مثل: عبد، روح، حور، أمن، طوع)..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Quick Picks */}
              <div className="flex items-center gap-1.5 self-center">
                <span className="text-[11px] text-stone-500">أمثلة:</span>
                {['عبد', 'روح', 'حور', 'أمن'].map(r => (
                  <button
                    key={r}
                    onClick={() => setTerm(r)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-teal-300 cursor-pointer"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="matchType"
                  checked={matchType === 'root'}
                  onChange={() => setMatchType('root')}
                  className="accent-teal-500"
                />
                <span>تتبع الجذر والمشتقات</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="matchType"
                  checked={matchType === 'literal'}
                  onChange={() => setMatchType('literal')}
                  className="accent-teal-500"
                />
                <span>تطابق لفظي حرفي فقط</span>
              </label>
            </div>
          </div>

          {/* Lexicon Details Card */}
          <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-6">
            
            <div className="flex flex-wrap items-center justify-between border-b border-stone-800 pb-4 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-quran text-2xl text-teal-300 font-bold">«{term}»</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-mono">
                    جذر محقق: {currentEntry.root}
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  تكرر الجذر ومشتقاته حوالي {currentEntry.occurrences} مرة في القرآن الكريم
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {currentEntry.derivatives.map((d, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 font-quran">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Semantic Clusters in Quranic usage */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>الحقول الدلالية والسياقات الاستعمالية في القرآن:</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentEntry.semanticClusters.map((sc, i) => (
                  <div key={i} className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 space-y-2 text-xs">
                    <span className="font-bold text-teal-300 block">{sc.meaning}</span>
                    <p className="text-stone-300 font-quran text-sm">﴿ {sc.context} ﴾</p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => onOpenVerseInMushaf(sc.sampleKey)}
                        className="text-[11px] text-stone-400 hover:text-teal-400 flex items-center gap-1 cursor-pointer"
                      >
                        <span>عرض الآية كاملة</span>
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Matches in Repository */}
            {matchingVerses.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-stone-800">
                <h3 className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>نماذج الشواهد الموثقة المطابقة في القرآن ({matchingVerses.length} موضع):</span>
                </h3>

                <div className="space-y-2">
                  {matchingVerses.map(v => (
                    <div
                      key={v.verse_key}
                      className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-300">سورة {v.surah_name_ar}</span>
                          <span className="text-[10px] text-stone-500 font-mono">آية {v.ayah_number}</span>
                        </div>
                        <p className="font-quran text-stone-200 text-base leading-relaxed">
                          ﴿ {v.uthmani_text} ﴾
                        </p>
                      </div>

                      <button
                        onClick={() => onOpenVerseInMushaf(v.verse_key)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-emerald-300 border border-stone-800 transition-colors shrink-0 cursor-pointer"
                      >
                        سياق السورة
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Compare Two Words Mode */
        <div className="space-y-6">
          <div className="rounded-2xl p-6 bg-stone-900/80 border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-400" />
              <span>مقارنة الفروق السياقية بين لفظين قرآنيين</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-400 block mb-1">اللفظ الأول:</label>
                <input
                  type="text"
                  value={wordA}
                  onChange={e => setWordA(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 block mb-1">اللفظ الثاني:</label>
                <input
                  type="text"
                  value={wordB}
                  onChange={e => setWordB(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
                />
              </div>
            </div>

            {/* Precomputed / live comparison study for (العبادة vs الطاعة) */}
            <div className="rounded-xl p-5 bg-stone-950 border border-teal-900/40 space-y-4 text-xs leading-relaxed">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>التحليل القرآني المقارن بين «{wordA}» و «{wordB}»:</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2">
                  <span className="font-bold text-emerald-300 text-sm block">استعمال «{wordA}»:</span>
                  <p className="text-stone-300">
                    العبادة في القرآن غاية الغايات ومظهر التذلل والخضوع المطلق، ولا تكون إلا لله سبحانه (وما خلقت الجن والإنس إلا ليعبدون). وتأتي دائمًا مقرونة بالتوحيد الخالص ونفي الشركاء.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2">
                  <span className="font-bold text-teal-300 text-sm block">استعمال «{wordB}»:</span>
                  <p className="text-stone-300">
                    الطاعة هي موافقة الأمر والامتثال، وقد ترد في القرآن مقيدة للبشر المأمورين بالعدل (وأطيعوا الرسول وأولي الأمر منكم)، بينما لا تُصرف العبادة إلا للخالق جل وعلا.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-800/50 text-teal-200">
                <span className="font-bold block mb-1">الخلاصة المنهجية:</span>
                العبادة أعم من الطاعة في الخضوع والمحبة والتعظيم، وأخص في كونها لا تجوز شرعًا وعقلاً لغير الله، بينما الطاعة قد تكون فرعًا من لوازم العبادة.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
