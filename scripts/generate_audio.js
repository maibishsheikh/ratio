/**
 * scripts/generate_audio.js
 * Offline audio pre-generation pipeline.
 *
 * Usage: node scripts/generate_audio.js
 * Requires: VITE_ELEVENLABS_API_KEY set in .env.local
 *
 * Reads phrases from this file → hits ElevenLabs API → saves .mp3 files
 * → writes updated src/utils/audioMap.js automatically.
 */

import fs   from 'fs';
import path from 'path';
import https from 'https';
import { createHash } from 'crypto';
import { config } from 'dotenv';

config({ path: '.env.local' });

const API_KEY  = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const AUDIO_DIR = path.resolve('public/assets/audio');
const MAP_FILE  = path.resolve('src/utils/audioMap.js');

if (!API_KEY) {
  console.error('❌  VITE_ELEVENLABS_API_KEY not found in .env.local');
  process.exit(1);
}

// ─── Voice settings per style ─────────────────────────────────────────────
const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50 },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60 },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20 },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40 },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80 },
};

// ─── All phrases to pre-generate ──────────────────────────────────────────
const phrases = [

  // ── WONDER ────────────────────────────────────────────────────────────
  // worldId 1 — ratio / proportion questions (Mia's juice, apples, students, recipe)
  { text: "Hmm, I wonder! Look at this question carefully. Two quantities are being compared in a special way. Can you spot the pattern? Think it through — then click Let's Discover!", style: 'encouragement' },
  // worldId 2 — rate / speed question (car travelling 60 km/h)
  { text: "Ooh, a speed challenge! A car travels a certain distance in a set time. When we compare distance to time, we get a rate. Can you work out how far it goes at the same speed?", style: 'encouragement' },

  // ── STORY ─────────────────────────────────────────────────────────────
  // Slide 0 — The Spice Bazaar
  { text: "Welcome to the Spice Bazaar! Alex mixes 2 bags of pepper with 3 bags of salt every morning. Today, a huge order arrives needing 6 bags of pepper. How much salt keeps the same flavour? This is exactly what ratios help us solve!", style: 'statement' },
  // Slide 1 — What is a Ratio?
  { text: "A ratio compares two quantities of the same type. Alex's blend is 2 colon 3 — for every 2 bags of pepper, there are 3 bags of salt. The ratio stays exactly the same even when the amounts get bigger or smaller!", style: 'statement' },
  // Slide 2 — Rates at the Speedway
  { text: "Now meet rates! Emma's car travels 120 kilometres in 2 hours. A rate compares two different units — distance and time. We write it as 60 kilometres per hour. Whenever you see the word per, you are looking at a rate!", style: 'statement' },
  // Slide 3 — Proportion Palace
  { text: "When two ratios are equal, they form a proportion! If 5 pens cost 3 dollars, then 10 pens cost 6 dollars — the ratio stays the same. We verify using cross-multiplication: multiply diagonally, and if both products match, it is a proportion!", style: 'statement' },
  // Slide 4 — You're Ready!
  { text: "Fantastic work! You have learned three powerful ideas. Ratios compare same-type quantities like 2 colon 3. Rates compare different units like 60 kilometres per hour. And proportions are two equal ratios. You are ready to practise — let's go!", style: 'celebration' },

  // ── SIMULATE ──────────────────────────────────────────────────────────
  // Station 0 — Ratio Builder
  { text: "Station one — the Ratio Builder! Simplify each ratio to its lowest terms. Find the number that divides evenly into both parts — that is your scale factor. Let's go!", style: 'statement' },
  // Station 1 — Rate Detective
  { text: "Station two — Rate Detective! You have a distance and a time. Divide the distance by the time to find the speed in kilometres per hour. Crack the code!", style: 'statement' },
  // Station 2 — Proportion Checker
  { text: "Final station — the Proportion Checker! Two ratios are shown. Use cross-multiplication to decide if they are equal. If both diagonal products match, it is a true proportion!", style: 'statement' },

  // ── PLAY ──────────────────────────────────────────────────────────────
  // Correct answer feedback (random pick)
  { text: "Excellent answer! You've got it!", style: 'celebration' },
  { text: "Brilliant reasoning! Keep going!", style: 'encouragement' },
  { text: "That's exactly right! Well done!", style: 'celebration' },
  // Wrong answer feedback (random pick)
  { text: "Not quite, but good try! Read the question again and think it through.", style: 'thinking' },
  { text: "Almost there! Check your working carefully and try again.", style: 'thinking' },
  // Boss Battle
  { text: "The Boss Battle begins! Answer five questions correctly to defeat the Market Boss and claim your trophy!", style: 'emphasis' },
  { text: "You defeated the Boss! The Golden Scale Trophy is yours!", style: 'celebration' },
  { text: "Hit! Keep going!", style: 'celebration' },
  { text: "The boss blocks! Watch out!", style: 'thinking' },

];

// ─── Generate one audio file ──────────────────────────────────────────────
function generateAudio(text, style) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: VOICE_SETTINGS[style] || VOICE_SETTINGS.statement,
    });

    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path:     `/v1/text-to-speech/${VOICE_ID}`,
      method:   'POST',
      headers: {
        'xi-api-key':    API_KEY,
        'Content-Type':  'application/json',
        'Accept':        'audio/mpeg',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`ElevenLabs returned ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const mapEntries = [];
  let generated = 0;
  let skipped   = 0;

  for (const { text, style } of phrases) {
    // Filename: hash of text to avoid collisions / long names
    const hash = createHash('md5').update(text).digest('hex').slice(0, 10);
    const filename = `audio_${style}_${hash}.mp3`;
    const filepath = path.join(AUDIO_DIR, filename);
    const publicPath = `/assets/audio/${filename}`;

    if (fs.existsSync(filepath)) {
      console.log(`  ↩  skip (cached): ${filename}`);
      skipped++;
    } else {
      try {
        console.log(`  ⬇  generating:  "${text.slice(0, 60)}…"`);
        const buf = await generateAudio(text, style);
        fs.writeFileSync(filepath, buf);
        console.log(`  ✅ saved:        ${filename} (${(buf.length/1024).toFixed(1)} KB)`);
        generated++;
        // Small delay to respect API rate limits
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.warn(`  ⚠️  FAILED:      ${err.message}`);
        continue;
      }
    }

    // Use double-quoted keys — backtick keys are invalid JS object syntax
    const escapedText = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    mapEntries.push(`  "${escapedText}": '${publicPath}',`);
  }

  // Write audioMap.js
  const mapContent = `/**
 * audioMap.js — AUTO-GENERATED by scripts/generate_audio.js
 * DO NOT EDIT MANUALLY.
 * Re-run \`node scripts/generate_audio.js\` to regenerate.
 */

export const audioMap = {
${mapEntries.join('\n')}
};
`;

  fs.writeFileSync(MAP_FILE, mapContent, 'utf8');

  console.log(`\n✅  Done! Generated: ${generated}, Skipped (cached): ${skipped}`);
  console.log(`📝  audioMap.js updated at ${MAP_FILE}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
