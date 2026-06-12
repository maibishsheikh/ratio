/**
 * scripts/clean_audio.js
 * Removes orphaned .mp3 files from public/assets/audio/ that are no
 * longer referenced in src/utils/audioMap.js.
 * Usage: node scripts/clean_audio.js
 */
import fs   from 'fs';
import path from 'path';
import { createRequire } from 'module';

const AUDIO_DIR = path.resolve('public/assets/audio');

// Dynamically import the audioMap to get current valid paths
const mapFile = path.resolve('src/utils/audioMap.js');
const mapText = fs.readFileSync(mapFile, 'utf8');

// Extract all referenced paths (values that look like /assets/audio/...)
const referencedFiles = new Set(
  [...mapText.matchAll(/['"]\/assets\/audio\/([^'"]+)['"]/g)].map(m => m[1])
);

const allFiles = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
let removed = 0;

for (const file of allFiles) {
  if (!referencedFiles.has(file)) {
    fs.unlinkSync(path.join(AUDIO_DIR, file));
    console.log(`  🗑  Removed orphan: ${file}`);
    removed++;
  }
}

console.log(`\n✅  Cleanup done. Removed ${removed} orphaned file(s). ${allFiles.length - removed} file(s) retained.`);
