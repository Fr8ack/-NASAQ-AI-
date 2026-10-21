import { SURAHS } from '../data/surahs';
import { Verse } from '../types/quran';
import { getVerifiedVerse, isValidVerseKey, normalizeArabic } from './quranVerifier';
import approvedCorpus from '../data/approvedCorpus.json';

const arabicToWesternDigits: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
};

function convertArabicNumerals(str: string): string {
  return str.replace(/[٠-٩]/g, d => arabicToWesternDigits[d] || d);
}

export interface RetrievalResult {
  candidateKeys: string[];
  primaryMatches: Verse[];
  expandedContext: Verse[];
  allowlist: Set<string>;
  extractionNotes: string[];
}

/**
 * Parses queries for direct verse references:
 * e.g. "33:72", "الأحزاب 72", "الأحزاب ٧٢", "الأحزاب 71-73", "سورة البقرة: 255"
 */
export function extractReferencedVerseKeys(query: string): string[] {
  const normalizedQuery = convertArabicNumerals(query);
  const foundKeys: Set<string> = new Set();

  // 1. Match numeric coordinates: "33:72" or "33:71-73"
  const rangePattern = /\b(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\b/g;
  let match: RegExpExecArray | null;
  while ((match = rangePattern.exec(normalizedQuery)) !== null) {
    const surahId = parseInt(match[1], 10);
    const startAyah = parseInt(match[2], 10);
    const endAyah = match[3] ? parseInt(match[3], 10) : startAyah;

    for (let a = startAyah; a <= endAyah; a++) {
      const key = `${surahId}:${a}`;
      if (isValidVerseKey(key)) {
        foundKeys.add(key);
      }
    }
  }

  // 2. Match named Surah references: "الأحزاب 72", "سورة الأحزاب: 72", "الأحزاب 71-73"
  for (const surah of SURAHS) {
    const surahNameClean = normalizeArabic(surah.name_ar);
    if (!normalizedQuery.includes(surah.name_ar) && !normalizeArabic(normalizedQuery).includes(surahNameClean)) {
      continue;
    }

    // Look for numbers following or preceding surah name
    const surahRegex = new RegExp(
      `(?:سورة\\s+)?(?:${surah.name_ar}|${surahNameClean})[:\\s]+(?:آية\\s+)?(\\d{1,3})(?:\\s*-\\s*(\\d{1,3}))?`,
      'g'
    );
    let sMatch: RegExpExecArray | null;
    while ((sMatch = surahRegex.exec(normalizedQuery)) !== null) {
      const startAyah = parseInt(sMatch[1], 10);
      const endAyah = sMatch[2] ? parseInt(sMatch[2], 10) : startAyah;
      for (let a = startAyah; a <= endAyah; a++) {
        const key = `${surah.id}:${a}`;
        if (isValidVerseKey(key)) {
          foundKeys.add(key);
        }
      }
    }
  }

  return Array.from(foundKeys);
}

/**
 * Retrieves Quranic evidence strictly from the approved corpus:
 * 1. Explicit reference extraction.
 * 2. Lexical keyword matching.
 * 3. Expands contiguous context (before and after) to prevent out-of-context distortion.
 * 4. Produces strict allowlist of verse keys for LLM grounding.
 */
export function retrieveEvidence(query: string, limit: number = 8): RetrievalResult {
  const allowlist: Set<string> = new Set();
  const primaryMatches: Verse[] = [];
  const expandedContext: Verse[] = [];
  const extractionNotes: string[] = [];

  // 1. Explicit keys from query
  const explicitKeys = extractReferencedVerseKeys(query);
  for (const key of explicitKeys) {
    const v = getVerifiedVerse(key);
    if (v) {
      primaryMatches.push(v);
      allowlist.add(key);
      extractionNotes.push(`استخراج مباشر من نص السؤال: ${key}`);
    }
  }

  // 2. Lexical search across 6,236 verified verses
  const cleanedQuery = normalizeArabic(query);
  // Extract search terms of 3 or more Arabic characters, filtering stopwords
  const stopWords = new Set(['ما', 'من', 'عن', 'في', 'على', 'إلى', 'هل', 'كيف', 'بين', 'وما', 'هو', 'هي', 'التي', 'الذي', 'سورة', 'آية', 'القرآن']);
  const searchTerms = cleanedQuery
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 3 && !stopWords.has(w));

  const allVerses = (approvedCorpus && approvedCorpus.verses) ? Object.values(approvedCorpus.verses as unknown as Record<string, Verse>) : [];

  const matchedKeys = new Set<string>();
  for (const term of searchTerms) {
    for (const v of allVerses) {
      if (primaryMatches.length >= limit * 2) break;
      if (matchedKeys.has(v.verse_key)) continue;

      if (v.normalized_text.includes(term)) {
        matchedKeys.add(v.verse_key);
        allowlist.add(v.verse_key);
        if (!primaryMatches.some(m => m.verse_key === v.verse_key)) {
          primaryMatches.push(v);
        }
      }
    }
  }

  // 3. Expand contiguous context (+/- 1 ayah) for every primary match
  for (const pv of primaryMatches.slice(0, limit)) {
    const prevKey = `${pv.surah_id}:${pv.ayah_number - 1}`;
    const nextKey = `${pv.surah_id}:${pv.ayah_number + 1}`;

    if (isValidVerseKey(prevKey)) {
      const prevV = getVerifiedVerse(prevKey);
      if (prevV && !allowlist.has(prevKey)) {
        expandedContext.push(prevV);
        allowlist.add(prevKey);
      }
    }

    if (isValidVerseKey(nextKey)) {
      const nextV = getVerifiedVerse(nextKey);
      if (nextV && !allowlist.has(nextKey)) {
        expandedContext.push(nextV);
        allowlist.add(nextKey);
      }
    }
  }

  return {
    candidateKeys: Array.from(allowlist),
    primaryMatches: primaryMatches.slice(0, limit),
    expandedContext,
    allowlist,
    extractionNotes
  };
}
