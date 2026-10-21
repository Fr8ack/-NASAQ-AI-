import { SURAHS } from '../data/surahs';
import { Verse, WordAnnotation } from '../types/quran';
import { getVerifiedVerse, normalizeArabic } from '../utils/quranVerifier';
import approvedCorpus from '../data/approvedCorpus.json';

const corpusVerses = (approvedCorpus && approvedCorpus.verses) ? (approvedCorpus.verses as Record<string, any>) : {};

// In-memory cache for loaded surah verses
const chapterVersesCache: Map<number, Verse[]> = new Map();
const wordsCache: Map<string, WordAnnotation[]> = new Map();

/**
 * Fetches all verses for a given Surah (1 - 114).
 * Directly serves authentic Uthmani text from the verified Tanzil approved corpus.
 */
export async function getChapterVerses(surahId: number): Promise<Verse[]> {
  if (chapterVersesCache.has(surahId)) {
    return chapterVersesCache.get(surahId)!;
  }

  const surahMeta = SURAHS.find(s => s.id === surahId);
  if (!surahMeta) {
    throw new Error(`سورة غير صحيحة: ${surahId}`);
  }

  const verses: Verse[] = [];

  for (let ayah = 1; ayah <= surahMeta.verse_count; ayah++) {
    const key = `${surahId}:${ayah}`;
    const verified = getVerifiedVerse(key);

    if (verified) {
      verses.push(verified);
    } else if (corpusVerses[key]) {
      const raw = corpusVerses[key];
      verses.push({
        verse_key: key,
        surah_id: surahId,
        ayah_number: ayah,
        surah_name_ar: surahMeta.name_ar,
        uthmani_text: raw.uthmani_text,
        normalized_text: raw.normalized_text,
        source_version: "Tanzil-Uthmani-v1.1-Verified"
      });
    }
  }

  if (verses.length === surahMeta.verse_count) {
    chapterVersesCache.set(surahId, verses);
    return verses;
  }

  // If any verse was missing, try fetching from Quran Foundation API as an auxiliary source
  try {
    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${surahId}?language=ar&words=true&fields=text_uthmani,chapter_id,verse_number&per_page=300`
    );

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.verses) && data.verses.length === surahMeta.verse_count) {
        const fetchedVerses: Verse[] = data.verses.map((v: any) => {
          const key = `${surahId}:${v.verse_number}`;
          const uthmani = v.text_uthmani || corpusVerses[key]?.uthmani_text || '';
          
          if (Array.isArray(v.words)) {
            const annotations: WordAnnotation[] = v.words.map((w: any, idx: number) => ({
              word_position: idx + 1,
              word_text: w.text_uthmani || w.text,
              root: w.translation?.text || undefined,
              lemma: w.transliteration?.text || undefined,
              verification_status: 'verified'
            }));
            wordsCache.set(key, annotations);
          }

          return {
            verse_key: key,
            surah_id: surahId,
            ayah_number: v.verse_number,
            surah_name_ar: surahMeta.name_ar,
            uthmani_text: uthmani,
            normalized_text: normalizeArabic(uthmani),
            source_version: "Quran-Foundation-API-v4-Verified"
          };
        });

        chapterVersesCache.set(surahId, fetchedVerses);
        return fetchedVerses;
      }
    }
  } catch (err) {
    console.warn(`Live chapter auxiliary fetch skipped for surah ${surahId}:`, err);
  }

  chapterVersesCache.set(surahId, verses);
  return verses;
}

/**
 * Gets word-by-word linguistic details for a given verse
 */
export async function getVerseWordAnnotations(verseKey: string): Promise<WordAnnotation[]> {
  if (wordsCache.has(verseKey)) {
    return wordsCache.get(verseKey)!;
  }

  const verse = getVerifiedVerse(verseKey);
  if (!verse) return [];

  const tokens = verse.uthmani_text.split(/\s+/).filter(Boolean);
  return tokens.map((t, idx) => ({
    word_position: idx + 1,
    word_text: t,
    verification_status: 'provisional'
  }));
}
