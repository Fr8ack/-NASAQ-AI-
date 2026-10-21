import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Copy,
  Bookmark,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Info,
  Check,
  Compass,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { SURAHS } from '../../data/surahs';
import { Verse, WordAnnotation } from '../../types/quran';
import { getChapterVerses, getVerseWordAnnotations } from '../../services/quranApiService';
import { toggleVerseBookmark, getLocalBookmarks } from '../../services/researchStore';
import { User } from '../../lib/firebase';

interface SmartMushafProps {
  user: User | null;
  onAnalyzeVerse: (verseText: string, verseKey: string, surahName: string) => void;
  initialVerseKey?: string;
}

export const SmartMushaf: React.FC<SmartMushafProps> = ({
  user,
  onAnalyzeVerse,
  initialVerseKey
}) => {
  const [selectedSurahId, setSelectedSurahId] = useState<number>(1);
  const [targetAyah, setTargetAyah] = useState<number>(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(24);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<{ word: string; verseKey: string } | null>(null);
  const [wordAnnotations, setWordAnnotations] = useState<WordAnnotation[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Handle initialVerseKey if provided
  useEffect(() => {
    if (initialVerseKey && initialVerseKey.includes(':')) {
      const [s, a] = initialVerseKey.split(':');
      const sid = parseInt(s, 10);
      const aid = parseInt(a, 10);
      if (sid >= 1 && sid <= 114) {
        setSelectedSurahId(sid);
        setTargetAyah(aid || 1);
      }
    }
  }, [initialVerseKey]);

  // Load verses when Surah changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getChapterVerses(selectedSurahId).then(data => {
      if (isMounted) {
        setVerses(data);
        setLoading(false);
      }
    }).catch(err => {
      console.error("Failed to load surah verses:", err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [selectedSurahId]);

  // Load bookmarks
  useEffect(() => {
    const list = getLocalBookmarks();
    setBookmarks(list.map(b => b.verse_key));
  }, []);

  const currentSurah = SURAHS.find(s => s.id === selectedSurahId) || SURAHS[0];

  const handleCopy = (verse: Verse) => {
    const textToCopy = `﴿ ${verse.uthmani_text} ﴾ [سورة ${verse.surah_name_ar}: الآية ${verse.ayah_number}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(verse.verse_key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleBookmark = async (verse: Verse) => {
    const isBookmarked = await toggleVerseBookmark(
      user ? user.uid : null,
      verse.verse_key,
      verse.surah_name_ar,
      verse.ayah_number
    );
    if (isBookmarked) {
      setBookmarks(prev => [...prev, verse.verse_key]);
    } else {
      setBookmarks(prev => prev.filter(k => k !== verse.verse_key));
    }
  };

  const handleWordClick = async (word: string, verseKey: string) => {
    const cleanWord = word.replace(/[ۖۗۘۙۚۛ]/g, '').trim();
    setSelectedWord({ word: cleanWord, verseKey });
    const annotations = await getVerseWordAnnotations(verseKey);
    setWordAnnotations(annotations);
  };

  const filteredVerses = searchTerm.trim()
    ? verses.filter(v => v.normalized_text.includes(searchTerm.trim()) || v.uthmani_text.includes(searchTerm.trim()))
    : verses;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      
      {/* Top Header & Navigation Bar */}
      <div className="rounded-2xl p-4 sm:p-5 bg-stone-900/80 border border-stone-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Surah Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedSurahId(prev => Math.max(1, prev - 1))}
            disabled={selectedSurahId <= 1}
            title="السورة السابقة"
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-[200px]">
            <select
              value={selectedSurahId}
              onChange={e => setSelectedSurahId(parseInt(e.target.value, 10))}
              aria-label="اختيار السورة"
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-sm font-semibold text-emerald-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {SURAHS.map(s => (
                <option key={s.id} value={s.id} className="bg-stone-900 text-stone-200">
                  {s.id}. سورة {s.name_ar} ({s.verse_count} آية - {s.revelation_place === 'makkah' ? 'مكية' : 'مدنية'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setSelectedSurahId(prev => Math.min(114, prev + 1))}
            disabled={selectedSurahId >= 114}
            title="السورة التالية"
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Search within Surah */}
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث في آيات هذه السورة..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-3 pr-9 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-600"
          />
          <Search className="w-4 h-4 text-stone-500 absolute right-3 top-2.5" />
        </div>

        {/* Font Size Adjusters */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setFontSize(prev => Math.max(18, prev - 2))}
            title="تصغير الخط"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs px-2 text-stone-400 font-mono">{fontSize}px</span>
          <button
            onClick={() => setFontSize(prev => Math.min(36, prev + 2))}
            title="تكبير الخط"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Surah Banner Info */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-950/60 via-stone-900 to-emerald-950/60 border border-emerald-900/50 text-center relative overflow-hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
            <span>سورة رقم {currentSurah.id}</span>
            <span>•</span>
            <span>{currentSurah.revelation_place === 'makkah' ? 'مكية' : 'مدنية'}</span>
            <span>•</span>
            <span>{currentSurah.verse_count} آيات</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-sans tracking-wide">
            سورة {currentSurah.name_ar}
          </h2>
          <p className="text-xs text-stone-400 font-mono">{currentSurah.name_en} ({currentSurah.name_translation})</p>
        </div>

        {/* Basmalah for all surahs except At-Tawbah (9) */}
        {selectedSurahId !== 9 && (
          <div className="mt-4 pt-4 border-t border-emerald-900/40">
            <p className="font-quran text-xl sm:text-2xl text-emerald-200/90 tracking-wide">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        )}
      </div>

      {/* Layout with Main Verse Reader & Word Study Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Verses Flow */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-400">جاري جلب الآيات المحققة...</p>
            </div>
          ) : filteredVerses.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-stone-900/40 border border-stone-800">
              <p className="text-sm text-stone-400">لم يتم العثور على آيات مطابقة للبحث في هذه السورة.</p>
            </div>
          ) : (
            filteredVerses.map(verse => {
              const isBookmarked = bookmarks.includes(verse.verse_key);
              const isCopied = copiedKey === verse.verse_key;
              const words = verse.uthmani_text.split(/\s+/).filter(Boolean);

              return (
                <div
                  key={verse.verse_key}
                  id={`verse-${verse.verse_key}`}
                  className="group rounded-2xl p-5 sm:p-6 bg-stone-900/60 hover:bg-stone-900/90 border border-stone-800/80 hover:border-emerald-700/50 transition-all space-y-4 text-right"
                >
                  {/* Verse Top Coordinates & Actions */}
                  <div className="flex items-center justify-between border-b border-stone-800/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center justify-center text-xs font-bold font-mono">
                        {verse.ayah_number}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">
                        سورة {verse.surah_name_ar}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(verse)}
                        title="نسخ الآية مع التوثيق"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleBookmark(verse)}
                        title={isBookmarked ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isBookmarked ? 'text-amber-400 bg-amber-950/40' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onAnalyzeVerse(verse.uthmani_text, verse.verse_key, verse.surah_name_ar)}
                        title="تحليل هذه الآية في الباحث القرآني"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors cursor-pointer mr-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>تحليل الآية</span>
                      </button>
                    </div>
                  </div>

                  {/* Uthmani Calligraphic Text with Clickable Words */}
                  <div
                    className="font-quran text-stone-100 leading-loose flex flex-wrap gap-x-2 gap-y-1 select-text"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {words.map((w, wIdx) => (
                      <span
                        key={wIdx}
                        onClick={() => handleWordClick(w, verse.verse_key)}
                        className="hover:text-emerald-300 hover:bg-emerald-950/40 rounded px-1 transition-colors cursor-pointer"
                        title="انقر للفحص اللغوي للمفردة"
                      >
                        {w}
                      </span>
                    ))}
                    <span className="text-emerald-500 font-mono text-sm px-1.5 self-center">
                      ۝{verse.ayah_number}
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Word / Root Linguistic Side Panel */}
        <div className="space-y-4">
          <div className="sticky top-20 rounded-2xl p-5 bg-stone-900/80 border border-stone-800 text-right space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>المرصد اللغوي للمفردات</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-stone-950 text-stone-400 border border-stone-800">
                فحص فوري
              </span>
            </div>

            {selectedWord ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-center space-y-1">
                  <span className="text-[10px] text-stone-500">المفردة المحددة من الآية ({selectedWord.verseKey}):</span>
                  <p className="font-quran text-2xl text-emerald-300 font-bold">
                    {selectedWord.word}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900 border border-stone-800/80">
                    <span className="text-stone-400">حالة التوثيق:</span>
                    <span className="text-emerald-400 font-medium">موثق من نص المصحف</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900 border border-stone-800/80">
                    <span className="text-stone-400">الموضع:</span>
                    <span className="text-stone-200 font-mono">{selectedWord.verseKey}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onAnalyzeVerse(selectedWord.word, selectedWord.verseKey, currentSurah.name_ar)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>تتبع استعمالات «{selectedWord.word}» في القرآن</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <Info className="w-8 h-8 text-stone-600 mx-auto" />
                <p className="text-xs text-stone-400">
                  انقر على أي كلمة داخل الآيات أعلاه لعرض معلوماتها الصرفية واللغوية وتتبع مواضعها في السور الأخرى.
                </p>
              </div>
            )}

            {/* Quick Surah Stats */}
            <div className="mt-4 pt-4 border-t border-stone-800 space-y-2 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>اسم السورة:</span>
                <span className="text-stone-200 font-bold">{currentSurah.name_ar}</span>
              </div>
              <div className="flex justify-between">
                <span>الترتيب في المصحف:</span>
                <span className="text-stone-200 font-mono">{currentSurah.id}</span>
              </div>
              <div className="flex justify-between">
                <span>مكان النزول:</span>
                <span className="text-stone-200">{currentSurah.revelation_place === 'makkah' ? 'مكة المكرمة' : 'المدينة المنورة'}</span>
              </div>
              <div className="flex justify-between">
                <span>عدد الآيات:</span>
                <span className="text-stone-200 font-mono">{currentSurah.verse_count}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
