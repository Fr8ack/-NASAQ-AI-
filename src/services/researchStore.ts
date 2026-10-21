import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ResearchResult, HypothesisRecord } from '../types/quran';

export interface SavedResearchItem {
  id: string;
  owner_id: string;
  title: string;
  question: string;
  summary: string;
  evidence_level: string;
  findings: string;
  evidence_references: string[];
  created_at: string;
  result_data: ResearchResult;
}

export interface SavedBookmark {
  id: string;
  owner_id: string;
  verse_key: string;
  surah_name: string;
  ayah_number: number;
  note?: string;
  created_at: string;
}

const LOCAL_RESEARCH_KEY = 'nasaq_saved_researches';
const LOCAL_HYPOTHESIS_KEY = 'nasaq_saved_hypotheses';
const LOCAL_BOOKMARKS_KEY = 'nasaq_saved_bookmarks';

/**
 * Saves a completed research study to Firestore (or local storage fallback)
 */
export async function saveResearchStudy(
  userId: string | null,
  result: ResearchResult,
  customTitle?: string
): Promise<string> {
  const id = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const title = customTitle || result.question.substring(0, 60);

  const item: SavedResearchItem = {
    id,
    owner_id: userId || 'guest_user',
    title,
    question: result.question,
    summary: result.summary,
    evidence_level: result.evidence_level,
    findings: result.supported_conclusion,
    evidence_references: [
      ...result.primary_verses.map(v => v.verse_key),
      ...result.related_verses.map(v => v.verse_key)
    ],
    created_at: new Date().toISOString(),
    result_data: result
  };

  // If user is authenticated, save to Firestore
  if (userId && userId !== 'guest_user') {
    try {
      await setDoc(doc(db, 'researches', id), {
        ...item,
        server_timestamp: serverTimestamp()
      });
      return id;
    } catch (err) {
      console.warn("Firestore save failed, falling back to local storage:", err);
    }
  }

  // Local storage fallback
  try {
    const existing = getLocalResearches();
    existing.unshift(item);
    localStorage.setItem(LOCAL_RESEARCH_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error("Local storage save error:", e);
  }

  return id;
}

/**
 * Fetches user researches from Firestore or local storage
 */
export async function fetchUserResearches(userId: string | null): Promise<SavedResearchItem[]> {
  if (userId && userId !== 'guest_user') {
    try {
      const q = query(
        collection(db, 'researches'),
        where('owner_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      const items: SavedResearchItem[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as SavedResearchItem);
      });
      if (items.length > 0) return items;
    } catch (err) {
      console.warn("Firestore fetch error, reading local fallback:", err);
    }
  }

  return getLocalResearches();
}

/**
 * Deletes a research study
 */
export async function deleteResearchStudy(userId: string | null, researchId: string): Promise<void> {
  if (userId && userId !== 'guest_user') {
    try {
      await deleteDoc(doc(db, 'researches', researchId));
    } catch (err) {
      console.warn("Firestore delete failed:", err);
    }
  }

  const existing = getLocalResearches().filter(r => r.id !== researchId);
  localStorage.setItem(LOCAL_RESEARCH_KEY, JSON.stringify(existing));
}

function getLocalResearches(): SavedResearchItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_RESEARCH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves a hypothesis to Firestore or local storage
 */
export async function saveHypothesisToStore(
  userId: string | null,
  hypothesis: HypothesisRecord
): Promise<string> {
  const id = hypothesis.id || `hyp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record: HypothesisRecord = {
    ...hypothesis,
    id,
    owner_id: userId || 'guest_user',
    created_at: hypothesis.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (userId && userId !== 'guest_user') {
    try {
      await setDoc(doc(db, 'hypotheses', id), record);
      return id;
    } catch (e) {
      console.warn("Firestore hypothesis save failed:", e);
    }
  }

  try {
    const list = getLocalHypotheses();
    const existingIndex = list.findIndex(h => h.id === id);
    if (existingIndex >= 0) {
      list[existingIndex] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem(LOCAL_HYPOTHESIS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Local hypothesis save error:", e);
  }

  return id;
}

export async function fetchUserHypotheses(userId: string | null): Promise<HypothesisRecord[]> {
  if (userId && userId !== 'guest_user') {
    try {
      const q = query(
        collection(db, 'hypotheses'),
        where('owner_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      const items: HypothesisRecord[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as HypothesisRecord);
      });
      if (items.length > 0) return items;
    } catch (err) {
      console.warn("Firestore hypotheses fetch error:", err);
    }
  }

  return getLocalHypotheses();
}

function getLocalHypotheses(): HypothesisRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_HYPOTHESIS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Bookmark toggle for a verse
 */
export async function toggleVerseBookmark(
  userId: string | null,
  verseKey: string,
  surahName: string,
  ayahNumber: number,
  note?: string
): Promise<boolean> {
  const id = `bm_${verseKey.replace(':', '_')}`;
  const bookmarks = getLocalBookmarks();
  const exists = bookmarks.find(b => b.verse_key === verseKey);

  if (exists) {
    // Remove
    if (userId && userId !== 'guest_user') {
      try {
        await deleteDoc(doc(db, 'bookmarks', id));
      } catch {}
    }
    const filtered = bookmarks.filter(b => b.verse_key !== verseKey);
    localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(filtered));
    return false;
  } else {
    // Add
    const item: SavedBookmark = {
      id,
      owner_id: userId || 'guest_user',
      verse_key: verseKey,
      surah_name: surahName,
      ayah_number: ayahNumber,
      note: note || '',
      created_at: new Date().toISOString()
    };
    if (userId && userId !== 'guest_user') {
      try {
        await setDoc(doc(db, 'bookmarks', id), item);
      } catch {}
    }
    bookmarks.unshift(item);
    localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return true;
  }
}

export function getLocalBookmarks(): SavedBookmark[] {
  try {
    const raw = localStorage.getItem(LOCAL_BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Formats a research study as clean Markdown for export
 */
export function exportResearchToMarkdown(r: ResearchResult): string {
  let md = `# تقرير بحثي قرآني — نَسَق (NASAQ AI)\n`;
  md += `**السؤال المركزي:** ${r.question}\n`;
  md += `**تاريخ البحث:** ${new Date().toLocaleDateString('ar-SA')}\n`;
  md += `**مستوى الاستدلال:** ${r.evidence_level} (${r.evidence_reasoning})\n\n`;
  md += `---\n\n`;
  md += `## 1. خلاصة الاستدلال الأولي\n${r.summary}\n\n`;
  
  md += `## 2. الشواهد القرآنية الأساسية (نصوص موثقة برواية حفص)\n`;
  for (const v of r.primary_verses) {
    md += `> **﴿ ${v.uthmani_text} ﴾**\n`;
    md += `> [سورة ${v.surah_name}: آية ${v.ayah_number}]\n`;
    md += `> *وجه الاستدلال:* ${v.context_relation}\n\n`;
  }

  if (r.related_verses.length > 0) {
    md += `## 3. الآيات ذات الصلة والسياقات المقابلة\n`;
    for (const v of r.related_verses) {
      md += `> **﴿ ${v.uthmani_text} ﴾**\n`;
      md += `> [سورة ${v.surah_name}: آية ${v.ayah_number}]\n`;
      md += `> *العلاقة:* ${v.context_relation}\n\n`;
    }
  }

  md += `## 4. التحليل السياقي والتركيبي\n`;
  md += `- **السياق المباشر:** ${r.contextual_analysis.immediate_context}\n`;
  md += `- **سياق السورة:** ${r.contextual_analysis.surah_context}\n`;
  md += `- **الاستعمال القرآني العام:** ${r.contextual_analysis.holistic_quranic_context}\n\n`;

  if (r.hypotheses.length > 0) {
    md += `## 5. الفرضيات التفسيرية ومحاولات نقدها\n`;
    for (const h of r.hypotheses) {
      md += `### ${h.title} (الدرجة: ${h.plausibility})\n`;
      md += `${h.description}\n`;
      md += `*أدلة التأييد:* ${h.supporting_arguments.join('، ')}\n`;
      md += `*أدلة النقد:* ${h.counter_arguments.join('، ')}\n\n`;
    }
  }

  md += `## 6. النتيجة المدعومة وما بقي غير محسوم\n`;
  md += `**النتيجة المدعومة:** ${r.supported_conclusion}\n\n`;
  if (r.unresolved_aspects.length > 0) {
    md += `**ما بقي مسكوتًا عنه في النص:**\n`;
    for (const u of r.unresolved_aspects) {
      md += `- ${u}\n`;
    }
    md += `\n`;
  }

  md += `---\n*تم إنشاء هذا التقرير عبر منصة نَسَق — «القرآن يُبيّن بعضه بعضًا»*\n`;
  return md;
}
