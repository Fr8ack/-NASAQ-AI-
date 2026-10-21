#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Canonical verse counts for all 114 Surahs according to Kufic / Hafs standard
const CANONICAL_VERSE_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6
];

// Normalize Arabic text (removes diacritics, unifies alifs, etc.) for search
function normalizeArabic(text) {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/\u0640/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

const args = process.argv.slice(2);
const filePath = args[0] || path.resolve('src/data/tanzil-uthmani.txt');
const expectedSha = args[1];

if (!fs.existsSync(filePath)) {
  console.error(`[ERROR] File not found: ${filePath}`);
  process.exit(1);
}

const fileBuffer = fs.readFileSync(filePath);
const actualSha = crypto.createHash('sha256').update(fileBuffer).digest('hex');

if (expectedSha && expectedSha.toLowerCase() !== actualSha.toLowerCase()) {
  console.error(`[SECURITY ERROR] SHA-256 mismatch!`);
  console.error(`  Expected: ${expectedSha}`);
  console.error(`  Actual:   ${actualSha}`);
  process.exit(1);
}

const content = fileBuffer.toString('utf8');
const lines = content.split(/\r?\n/);

const versesMap = {};
let currentSurah = 1;
let currentAyah = 0;
let totalVerses = 0;
const surahCounts = new Array(114).fill(0);

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  const parts = trimmed.split('|');
  if (parts.length < 3) continue;

  const surahId = parseInt(parts[0], 10);
  const ayahNum = parseInt(parts[1], 10);
  const text = parts.slice(2).join('|').trim();

  if (isNaN(surahId) || isNaN(ayahNum) || !text) {
    console.error(`[ERROR] Invalid verse line: ${line}`);
    process.exit(1);
  }

  // Verify sequential order
  if (surahId === currentSurah) {
    if (ayahNum !== currentAyah + 1) {
      console.error(`[ERROR] Non-sequential ayah: Surah ${surahId}, expected ${currentAyah + 1}, got ${ayahNum}`);
      process.exit(1);
    }
    currentAyah = ayahNum;
  } else if (surahId === currentSurah + 1) {
    if (currentAyah !== CANONICAL_VERSE_COUNTS[currentSurah - 1]) {
      console.error(`[ERROR] Surah ${currentSurah} count mismatch: expected ${CANONICAL_VERSE_COUNTS[currentSurah - 1]}, got ${currentAyah}`);
      process.exit(1);
    }
    currentSurah = surahId;
    currentAyah = 1;
    if (ayahNum !== 1) {
      console.error(`[ERROR] Surah ${surahId} must start at ayah 1, got ${ayahNum}`);
      process.exit(1);
    }
  } else {
    console.error(`[ERROR] Surah jump from ${currentSurah} to ${surahId}`);
    process.exit(1);
  }

  surahCounts[surahId - 1]++;
  totalVerses++;

  const verseKey = `${surahId}:${ayahNum}`;
  versesMap[verseKey] = {
    verse_key: verseKey,
    surah_id: surahId,
    ayah_number: ayahNum,
    uthmani_text: text,
    normalized_text: normalizeArabic(text)
  };
}

if (currentSurah !== 114 || currentAyah !== CANONICAL_VERSE_COUNTS[113]) {
  console.error(`[ERROR] Final count mismatch: Surah ${currentSurah}, Ayah ${currentAyah}`);
  process.exit(1);
}

if (totalVerses !== 6236) {
  console.error(`[ERROR] Total verses count mismatch: expected 6236, got ${totalVerses}`);
  process.exit(1);
}

const corpusData = {
  metadata: {
    title: 'Tanzil Quran Text (Uthmani, Version 1.1)',
    source: 'Tanzil Project (https://tanzil.net)',
    license: 'Creative Commons Attribution 3.0 (https://tanzil.net/docs/Text_License)',
    copyright: 'Copyright (C) 2007-2026 Tanzil Project',
    format: 'pipe-delimited-uthmani',
    sha256: actualSha,
    totalSurahs: 114,
    totalVerses: 6236,
    status: 'installed',
    verifiedAt: new Date().toISOString(),
    importTool: 'tools/import-tanzil-corpus.mjs'
  },
  verses: versesMap
};

const outputPath = path.resolve('src/data/approvedCorpus.json');
fs.writeFileSync(outputPath, JSON.stringify(corpusData, null, 2), 'utf8');

console.log(`[SUCCESS] Verified and installed 6,236 Quranic verses across 114 Surahs.`);
console.log(`  Source SHA-256: ${actualSha}`);
console.log(`  Output Path:    ${outputPath}`);
