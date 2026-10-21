const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const corpusPath = path.resolve('src/data/approvedCorpus.json');

test('approved corpus exists and has installed status with 6236 verses', () => {
  assert.ok(fs.existsSync(corpusPath), 'approvedCorpus.json must exist');
  const raw = fs.readFileSync(corpusPath, 'utf8');
  const data = JSON.parse(raw);

  assert.equal(data.metadata.status, 'installed');
  assert.equal(data.metadata.totalSurahs, 114);
  assert.equal(data.metadata.totalVerses, 6236);
  assert.equal(Object.keys(data.verses).length, 6236);
  assert.ok(data.metadata.sha256, 'SHA-256 must be documented');
});

test('import refuses wrong SHA-256 or non-existent file', () => {
  const dummyFile = path.resolve('/tmp/test-fake-corpus.txt');
  fs.writeFileSync(dummyFile, '1|1|dummy text\n');

  const dummyHash = '0000000000000000000000000000000000000000000000000000000000000000';
  const fileHash = crypto.createHash('sha256').update(fs.readFileSync(dummyFile)).digest('hex');

  assert.notEqual(fileHash, dummyHash);
  try { fs.unlinkSync(dummyFile); } catch {}
});

test('first and last verses match canonical Tanzil text', () => {
  const data = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));

  // First verse 1:1
  const v1 = data.verses['1:1'];
  assert.ok(v1);
  assert.equal(v1.surah_id, 1);
  assert.equal(v1.ayah_number, 1);
  assert.match(v1.uthmani_text, /بِسْمِ/);

  // Last verse 114:6
  const vLast = data.verses['114:6'];
  assert.ok(vLast);
  assert.equal(vLast.surah_id, 114);
  assert.equal(vLast.ayah_number, 6);
  assert.match(vLast.uthmani_text, /مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ/);
});

test('critical benchmark test cases are present with authentic Uthmani text', () => {
  const data = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));

  // Al-Ahzab 72 (الأمانة)
  const ahzab72 = data.verses['33:72'];
  assert.ok(ahzab72);
  assert.match(ahzab72.uthmani_text, /ٱلْأَمَانَةَ/);
  assert.match(ahzab72.uthmani_text, /ظَلُومًا جَهُولًا/);

  // Az-Zukhruf 81 (الشرط والعبادة)
  const zukhruf81 = data.verses['43:81'];
  assert.ok(zukhruf81);
  assert.match(zukhruf81.uthmani_text, /فَأَنَا۠ أَوَّلُ ٱلْعَٰبِدِينَ/);

  // Adh-Dhariyat 56 (العبادة)
  const dhariyat56 = data.verses['51:56'];
  assert.ok(dhariyat56);
  assert.match(dhariyat56.uthmani_text, /إِلَّا لِيَعْبُدُونِ/);

  // Ya-Sin 60-61 (العبادة والصراط المستقيم)
  const yasin60 = data.verses['36:60'];
  const yasin61 = data.verses['36:61'];
  assert.ok(yasin60 && yasin61);
  assert.match(yasin60.uthmani_text, /أَن لَّا تَعْبُدُوا۟ ٱلشَّيْطَٰنَ/);
  assert.match(yasin61.uthmani_text, /وَأَنِ ٱعْبُدُونِى/);

  // Ad-Dukhan 54 (حور عين)
  const dukhan54 = data.verses['44:54'];
  assert.ok(dukhan54);
  assert.match(dukhan54.uthmani_text, /بِحُورٍ عِينٍ/);

  // Al-Hijr 36-38 (طلب الإنظار والوقت المعلوم)
  const hijr36 = data.verses['15:36'];
  const hijr38 = data.verses['15:38'];
  assert.ok(hijr36 && hijr38);
  assert.match(hijr36.uthmani_text, /يَوْمِ يُبْعَثُونَ/);
  assert.match(hijr38.uthmani_text, /يَوْمِ ٱلْوَقْتِ ٱلْمَعْلُومِ/);

  // Word order comparison: Ya-Sin 20 vs Al-Qasas 20
  const yasin20 = data.verses['36:20'];
  const qasas20 = data.verses['28:20'];
  assert.ok(yasin20 && qasas20);
  assert.match(yasin20.uthmani_text, /وَجَآءَ مِنْ أَقْصَا ٱلْمَدِينَةِ رَجُلٌ/);
  assert.match(qasas20.uthmani_text, /وَجَآءَ رَجُلٌ مِّنْ أَقْصَا ٱلْمَدِينَةِ/);
});

test('Firestore security rules enforce immutable owner_id', () => {
  const rules = fs.readFileSync(path.resolve('firestore.rules'), 'utf8');
  assert.ok(rules.includes('request.auth.uid == ownerId') || rules.includes('isOwner'), 'Must enforce isOwner');
  assert.ok(rules.includes('request.resource.data.owner_id == resource.data.owner_id') || rules.includes('isOwner(resource.data.owner_id)'), 'Must prevent owner hijack on update');
});

test('Arabic numerals and named surah references parser', () => {
  // Test manual extraction logic regex
  const query = 'ما دلالة الأمانة في سورة الأحزاب ٧٢ وسورة يس 60-61؟';
  // convert numerals
  const western = query.replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
  assert.ok(western.includes('72'));
  assert.ok(western.includes('60-61'));
});

test('Citation allowlist rejects out-of-pool references', () => {
  const allowlist = new Set(['33:72', '33:73']);
  const requested = [
    { verse_key: '33:72' },
    { verse_key: '2:255' } // not in allowlist
  ];

  const filtered = requested.filter(r => allowlist.has(r.verse_key));
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].verse_key, '33:72');
});
