#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const corpusPath = path.resolve('src/data/approvedCorpus.json');

if (!fs.existsSync(corpusPath)) {
  console.error('[CORPUS ERROR] approvedCorpus.json not found.');
  console.error('Run: node tools/import-tanzil-corpus.mjs');
  process.exit(1);
}

let corpus;
try {
  corpus = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
} catch (e) {
  console.error('[CORPUS ERROR] Failed to parse approvedCorpus.json:', e.message);
  process.exit(1);
}

if (!corpus.metadata || corpus.metadata.status !== 'installed') {
  console.error('[CORPUS NOT INSTALLED] Corpus status is not "installed".');
  process.exit(1);
}

if (corpus.metadata.totalSurahs !== 114 || corpus.metadata.totalVerses !== 6236) {
  console.error(`[CORPUS ERROR] Invalid metadata counts: ${corpus.metadata.totalSurahs} surahs, ${corpus.metadata.totalVerses} verses.`);
  process.exit(1);
}

const verseKeys = Object.keys(corpus.verses || {});
if (verseKeys.length !== 6236) {
  console.error(`[CORPUS ERROR] Stored verse count mismatch: expected 6236, found ${verseKeys.length}`);
  process.exit(1);
}

// Check boundary and critical benchmark verses
const benchmarkKeys = [
  '1:1', '1:7', '2:1', '2:255', '2:286',
  '15:36', '15:38', '28:20', '33:72', '33:73',
  '36:20', '36:60', '36:61', '43:81', '44:54',
  '51:56', '114:1', '114:6'
];

for (const key of benchmarkKeys) {
  const v = corpus.verses[key];
  if (!v || !v.uthmani_text || v.uthmani_text.length < 3) {
    console.error(`[CORPUS ERROR] Missing or corrupt benchmark verse: ${key}`);
    process.exit(1);
  }
}

console.log('[CORPUS VERIFIED] Canonical Quran Corpus verified successfully:');
console.log(`  Source:       ${corpus.metadata.source}`);
console.log(`  License:      ${corpus.metadata.license}`);
console.log(`  Total Surahs: ${corpus.metadata.totalSurahs}`);
console.log(`  Total Verses: ${corpus.metadata.totalVerses}`);
console.log(`  SHA-256:      ${corpus.metadata.sha256}`);
console.log(`  Status:       INSTALLED & VERIFIED`);
process.exit(0);
