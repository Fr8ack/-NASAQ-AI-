import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeArabic,
  isValidVerseKey,
  parseVerseKey,
  getSurahById,
  getVerifiedVerse,
  searchVerifiedVerses,
  verifyAndCleanCitations
} from './quranVerifier.ts';

test('normalizeArabic strips diacritics and unifies letters', () => {
  const diacritized = 'إِنَّا عَرَضْنَا الْأَمَانَةَ عَلَى السَّمَاوَاتِ';
  const normalized = normalizeArabic(diacritized);
  assert.equal(normalized, 'انا عرضنا الامانه علي السماوات');
  
  // Test taa marbuta & alif maqsura
  assert.equal(normalizeArabic('هُدًى وَرَحْمَةٌ'), 'هدي ورحمه');
});

test('isValidVerseKey correctly validates authentic Quran coordinates', () => {
  // Valid coordinates
  assert.equal(isValidVerseKey('1:1'), true);
  assert.equal(isValidVerseKey('1:7'), true);
  assert.equal(isValidVerseKey('2:286'), true);
  assert.equal(isValidVerseKey('33:72'), true); // Al-Ahzab 72
  assert.equal(isValidVerseKey('43:81'), true); // Az-Zukhruf 81
  assert.equal(isValidVerseKey('114:6'), true); // An-Nas 6

  // Out of bounds or invalid format
  assert.equal(isValidVerseKey('1:8'), false); // Al-Fatihah only has 7 verses
  assert.equal(isValidVerseKey('115:1'), false); // Only 114 surahs
  assert.equal(isValidVerseKey('0:1'), false);
  assert.equal(isValidVerseKey('33:999'), false);
  assert.equal(isValidVerseKey('invalid'), false);
  assert.equal(isValidVerseKey(''), false);
});

test('parseVerseKey extracts numeric IDs reliably', () => {
  const parsed = parseVerseKey('33:72');
  assert.notEqual(parsed, null);
  assert.equal(parsed?.surahId, 33);
  assert.equal(parsed?.ayahNumber, 72);

  assert.equal(parseVerseKey('200:1'), null);
});

test('getSurahById retrieves correct Surah metadata', () => {
  const surah33 = getSurahById(33);
  assert.notEqual(surah33, undefined);
  assert.equal(surah33?.name_ar, 'الأحزاب');
  assert.equal(surah33?.verse_count, 73);
});

test('test cases have verified authentic Uthmani text', () => {
  // Al-Ahzab 72
  const ahzab72 = getVerifiedVerse('33:72');
  assert.notEqual(ahzab72, null);
  assert.match(ahzab72!.uthmani_text, /[ٱا]لْأَمَانَةَ/);

  // Az-Zukhruf 81
  const zukhruf81 = getVerifiedVerse('43:81');
  assert.notEqual(zukhruf81, null);
  assert.match(zukhruf81!.uthmani_text, /أَوَّلُ [ٱا]لْعَٰبِدِينَ/);

  // Adh-Dhariyat 56
  const dhariyat56 = getVerifiedVerse('51:56');
  assert.notEqual(dhariyat56, null);
  assert.match(dhariyat56!.uthmani_text, /إِلَّا لِيَعْبُدُونِ/);

  // Word order comparison: Ya-Sin 20 vs Al-Qasas 20
  const yasin20 = getVerifiedVerse('36:20');
  const qasas20 = getVerifiedVerse('28:20');
  assert.notEqual(yasin20, null);
  assert.notEqual(qasas20, null);
  assert.match(yasin20!.uthmani_text, /أَقْصَا [ٱا]لْمَدِينَةِ رَجُلٌ/);
  assert.match(qasas20!.uthmani_text, /رَجُلٌ مِّنْ أَقْصَا [ٱا]لْمَدِينَةِ/);
});

test('verifyAndCleanCitations accepts valid and rejects hallucinated verses', () => {
  const rawList = [
    { verse_key: '33:72', context_relation: 'أمانة التكليف' },
    { verse_key: '999:1', context_relation: 'آية وهمية' },
    { verse_key: '1:7', context_relation: 'الهداية' },
    { verse_key: '1:8', context_relation: 'آية غير موجودة' }
  ];

  const result = verifyAndCleanCitations(rawList);
  assert.equal(result.verified.length, 2);
  assert.equal(result.rejected.length, 2);
  assert.equal(result.verified[0].verse_key, '33:72');
  assert.equal(result.verified[0].surah_name, 'الأحزاب');
  assert.equal(result.rejected.includes('999:1'), true);
  assert.equal(result.rejected.includes('1:8'), true);
});

test('searchVerifiedVerses finds matches with or without tashkeel', () => {
  const results1 = searchVerifiedVerses('الأمانة');
  assert.ok(results1.some(v => v.verse_key === '33:72'));

  const results2 = searchVerifiedVerses('الروح');
  assert.ok(results2.some(v => v.verse_key === '17:85'));
});
