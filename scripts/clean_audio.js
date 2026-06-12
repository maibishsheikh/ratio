/**
 * Audio Cleanup Script
 * Usage: node scripts/clean_audio.js
 *
 * Removes any .mp3 files in public/assets/audio/ that are no longer
 * referenced in src/utils/audioMap.js.
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

// Dynamically import the audioMap
const { audioMap } = await import('../src/utils/audioMap.js');

const audioDir   = path.join(ROOT, 'public', 'assets', 'audio');
const validFiles = new Set(Object.values(audioMap).map(u => path.basename(u)));

if (!fs.existsSync(audioDir)) {
  console.log('ℹ️  No audio directory found. Nothing to clean.');
  process.exit(0);
}

const allFiles = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'));
let removed = 0;

for (const file of allFiles) {
  if (!validFiles.has(file)) {
    fs.unlinkSync(path.join(audioDir, file));
    console.log(`🗑️  Removed: ${file}`);
    removed++;
  }
}

if (removed === 0) {
  console.log('✅  No orphaned audio files found.');
} else {
  console.log(`✅  Removed ${removed} orphaned file(s).`);
}
