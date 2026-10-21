import React, { useState } from 'react';
import {
  Folder,
  Search,
  BookOpen,
  Trash2,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Bookmark,
  ExternalLink,
  LogIn
} from 'lucide-react';
import { SavedResearchItem, SavedBookmark, deleteResearchStudy, exportResearchToMarkdown } from '../../services/researchStore';
import { User } from '../../lib/firebase';

interface ResearchLibraryProps {
  user: User | null;
  onOpenAuth: () => void;
  researches: SavedResearchItem[];
  bookmarks: SavedBookmark[];
  onSelectResearch: (item: SavedResearchItem) => void;
  onOpenVerseInMushaf: (verseKey: string) => void;
  onRefresh: () => void;
}

export const ResearchLibrary: React.FC<ResearchLibraryProps> = ({
  user,
  onOpenAuth,
  researches,
  bookmarks,
  onSelectResearch,
  onOpenVerseInMushaf,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'studies' | 'bookmarks'>('studies');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResearches = researches.filter(r =>
    r.title.includes(searchTerm) || r.question.includes(searchTerm) || r.summary.includes(searchTerm)
  );

  const filteredBookmarks = bookmarks.filter(b =>
    b.verse_key.includes(searchTerm) || b.surah_name.includes(searchTerm) || (b.note && b.note.includes(searchTerm))
  );

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا البحث؟')) {
      await deleteResearchStudy(user ? user.uid : null, id);
      onRefresh();
    }
  };

  const handleDownload = (e: React.MouseEvent, r: SavedResearchItem) => {
    e.stopPropagation();
    const md = exportResearchToMarkdown(r.result_data);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `بحث_${r.title.substring(0, 20).replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-right">
      
      {/* Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <Folder className="w-5 h-5" />
            <h2>مكتبة الأبحاث والملاحظات الشخصية</h2>
          </div>
          <p className="text-xs text-stone-300">
            أبحاثك القرآنية، شواهدك المحفوظة، وتاريخ استدلالاتك مخزنة بأمان.
          </p>
        </div>

        {!user && (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all cursor-pointer whitespace-nowrap"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول لمزامنة السحابة (Firestore)</span>
          </button>
        )}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('studies')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'studies'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            الدراسات والأبحاث ({researches.length})
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            الآيات المفضلة ({bookmarks.length})
          </button>
        </div>

        <div className="relative max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="بحث داخل مكتبتك..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-3 pr-8 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-600"
          />
          <Search className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5" />
        </div>
      </div>

      {/* Studies List */}
      {activeTab === 'studies' && (
        <div className="space-y-3">
          {filteredResearches.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-stone-900/40 border border-stone-800 space-y-2">
              <Folder className="w-8 h-8 text-stone-600 mx-auto" />
              <p className="text-sm text-stone-400">لا توجد أبحاث محفوظة تطابق البحث.</p>
              <p className="text-xs text-stone-500">يمكنك حفظ نتائج أي بحث من خلال زر "حفظ في مكتبتي" في الباحث القرآني.</p>
            </div>
          ) : (
            filteredResearches.map(r => (
              <div
                key={r.id}
                onClick={() => onSelectResearch(r)}
                className="group rounded-2xl p-5 bg-stone-900/60 hover:bg-stone-900 border border-stone-800 hover:border-emerald-700/60 transition-all cursor-pointer space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-100 group-hover:text-emerald-300 transition-colors">
                      {r.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {r.evidence_level}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-500 font-mono">
                      {new Date(r.created_at).toLocaleDateString('ar-SA')}
                    </span>

                    <button
                      onClick={e => handleDownload(e, r)}
                      title="تحميل Markdown"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={e => handleDelete(e, r.id)}
                      title="حذف البحث"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                  {r.summary}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1 border-t border-stone-800/60">
                  <span>الشواهد القرآنية: {r.evidence_references?.join('، ') || 'متعددة'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bookmarks List */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {filteredBookmarks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-stone-900/40 border border-stone-800 space-y-2">
              <Bookmark className="w-8 h-8 text-stone-600 mx-auto" />
              <p className="text-sm text-stone-400">لا توجد آيات مفضلة محفوظة بعد.</p>
              <p className="text-xs text-stone-500">يمكنك حفظ الآيات المفضلة مباشرة أثناء القراءة في المصحف الذكي.</p>
            </div>
          ) : (
            filteredBookmarks.map(b => (
              <div
                key={b.id}
                onClick={() => onOpenVerseInMushaf(b.verse_key)}
                className="rounded-2xl p-4 bg-stone-900/60 hover:bg-stone-900 border border-stone-800 hover:border-emerald-700/60 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300">سورة {b.surah_name}</span>
                    <span className="text-xs text-stone-400">آية {b.ayah_number}</span>
                    <span className="text-[10px] text-stone-500 font-mono">({b.verse_key})</span>
                  </div>
                  {b.note && <p className="text-xs text-stone-400">{b.note}</p>}
                </div>

                <div className="flex items-center gap-1 text-xs text-stone-400 group-hover:text-emerald-300">
                  <span>فتح في المصحف</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
