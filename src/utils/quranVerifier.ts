import { SURAHS } from '../data/surahs';
import { VERIFIED_VERSES_DB } from '../data/verifiedVerses';
import { Surah, Verse, VerifiedCitation } from '../types/quran';
import approvedCorpus from '../data/approvedCorpus.json';

const corpusVerses = (approvedCorpus && approvedCorpus.verses) ? (approvedCorpus.verses as Record<string, any>) : {};

/**
 * Normalizes Arabic text for flexible matching:
 * - Removes Harakat / Tashkeel (diacritics: Fatha, Damma, Kasra, Sukun, Shadda, Tanween)
 * - Normalizes Alif variants (أ, إ, آ, ٱ -> ا)
 * - Normalizes Taa Marbuta (ة -> ه)
 * - Normalizes Alif Maqsura (ى -> ي)
 * - Strips tatweel (ـ) and Quranic recitation marks
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    // Remove Arabic diacritics
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Remove Tatweel (Kashida)
    .replace(/\u0640/g, '')
    // Normalize Alif
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Taa Marbuta
    .replace(/ة/g, 'ه')
    // Normalize Alif Maqsura
    .replace(/ى/g, 'ي')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validates whether a verse key (e.g. "33:72") represents a mathematically valid verse in the Quran.
 */
export function isValidVerseKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const match = key.trim().match(/^(\d{1,3}):(\d{1,3})$/);
  if (!match) return false;

  const surahId = parseInt(match[1], 10);
  const ayahNum = parseInt(match[2], 10);

  if (surahId < 1 || surahId > 114) return false;

  const surah = SURAHS.find(s => s.id === surahId);
  if (!surah) return false;

  return ayahNum >= 1 && ayahNum <= surah.verse_count;
}

/**
 * Parses a verse key into Surah ID and Ayah number
 */
export function parseVerseKey(key: string): { surahId: number; ayahNumber: number } | null {
  if (!isValidVerseKey(key)) return null;
  const [s, a] = key.trim().split(':');
  return {
    surahId: parseInt(s, 10),
    ayahNumber: parseInt(a, 10)
  };
}

/**
 * Gets Surah metadata by ID
 */
export function getSurahById(id: number): Surah | undefined {
  return SURAHS.find(s => s.id === id);
}

/**
 * Gets a verified verse strictly from the authentic approved Tanzil database.
 * Returns null if the verse text is missing or unverified.
 */
export function getVerifiedVerse(key: string): Verse | null {
  const parsed = parseVerseKey(key);
  if (!parsed) return null;

  const normalizedKey = `${parsed.surahId}:${parsed.ayahNumber}`;
  const surah = getSurahById(parsed.surahId);
  if (!surah) return null;

  // 1. Primary check: approved complete 6,236 Tanzil corpus
  if (corpusVerses[normalizedKey]) {
    const raw = corpusVerses[normalizedKey];
    return {
      verse_key: normalizedKey,
      surah_id: parsed.surahId,
      ayah_number: parsed.ayahNumber,
      surah_name_ar: surah.name_ar,
      uthmani_text: raw.uthmani_text,
      normalized_text: raw.normalized_text,
      source_version: "Tanzil-Uthmani-v1.1-Verified"
    };
  }

  // 2. Secondary check: verified verses table
  if (VERIFIED_VERSES_DB[normalizedKey]) {
    return VERIFIED_VERSES_DB[normalizedKey];
  }

  // Strict: Never synthesize or invent missing text
  return null;
}

/**
 * Searches the verified verses database with support for both
 * diacritized exact text and normalized free text.
 */
export function searchVerifiedVerses(query: string, maxResults: number = 50): Verse[] {
  if (!query || !query.trim()) return [];
  const normalizedQuery = normalizeArabic(query);
  const queryLower = query.trim();

  const results: Verse[] = [];
  const allEntries = Object.keys(corpusVerses).length > 0
    ? Object.values(corpusVerses)
    : Object.values(VERIFIED_VERSES_DB);

  for (const item of allEntries) {
    if (results.length >= maxResults) break;
    const uthmani = item.uthmani_text || '';
    const norm = item.normalized_text || normalizeArabic(uthmani);

    if (
      uthmani.includes(queryLower) ||
      norm.includes(normalizedQuery) ||
      normalizeArabic(uthmani).includes(normalizedQuery)
    ) {
      const parsed = parseVerseKey(item.verse_key);
      const surah = parsed ? getSurahById(parsed.surahId) : undefined;
      results.push({
        verse_key: item.verse_key,
        surah_id: item.surah_id,
        ayah_number: item.ayah_number,
        surah_name_ar: surah ? surah.name_ar : (item.surah_name_ar || `سورة ${item.surah_id}`),
        uthmani_text: uthmani,
        normalized_text: norm,
        source_version: "Tanzil-Uthmani-v1.1-Verified"
      });
    }
  }

  return results;
}

/**
 * Strict Verification Engine:
 * Takes an array of raw citation requests (from AI or user input),
 * verifies their existence, pulls true Uthmani text from verified store,
 * and rejects fictitious or out-of-bounds verse numbers.
 * Supports optional allowlist filtering to prevent model hallucination drift.
 */
export function verifyAndCleanCitations(
  rawCitations: Array<{ verse_key: string; context_relation?: string }>,
  allowedKeys?: Set<string>
): {
  verified: VerifiedCitation[];
  rejected: string[];
} {
  const verified: VerifiedCitation[] = [];
  const rejected: string[] = [];

  for (const raw of rawCitations) {
    const key = (raw.verse_key || '').trim();
    if (!isValidVerseKey(key)) {
      rejected.push(key);
      continue;
    }

    if (allowedKeys && !allowedKeys.has(key)) {
      // Reject citation if outside candidate evidence allowlist
      rejected.push(`${key} (غير مدرج ضمن الشواهد المسترجعة)`);
      continue;
    }

    const verse = getVerifiedVerse(key);
    if (!verse) {
      rejected.push(key);
      continue;
    }

    const surah = getSurahById(verse.surah_id);
    verified.push({
      verse_key: verse.verse_key,
      surah_name: surah ? surah.name_ar : verse.surah_name_ar,
      ayah_number: verse.ayah_number,
      uthmani_text: verse.uthmani_text,
      context_relation: raw.context_relation || 'شاهد نصي مباشر',
      is_verified: true
    });
  }

  return { verified, rejected };
}
