#!/usr/bin/env node
/**
 * Audio Pre-generation Script
 * Usage: node scripts/generate_audio.js
 *
 * - Loads VITE_ELEVENLABS_API_KEY from .env.local using the dotenv package
 * - Calls ElevenLabs TTS API for each phrase using node:https (works on all Node versions)
 * - Saves .mp3 files to public/assets/audio/
 * - Writes src/utils/audioMap.js
 *
 * Requirements: Node >= 14  (uses node:https, no fetch needed)
 */

import fs    from 'fs';
import path  from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require    = createRequire(import.meta.url);
const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');

// ── Load .env.local via dotenv ────────────────────────────────────────────────
// dotenv is in devDependencies — use require() to load it
let dotenv;
try {
  dotenv = require('dotenv');
} catch {
  console.error('❌  dotenv not found. Run: npm install');
  process.exit(1);
}

const envPath = path.join(ROOT, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error(`❌  .env.local not found at: ${envPath}`);
  console.error('    Create it with:  VITE_ELEVENLABS_API_KEY=your_key_here');
  process.exit(1);
}

dotenv.config({ path: envPath });

const API_KEY  = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';   // Alice
const MODEL_ID = 'eleven_multilingual_v2';

if (!API_KEY) {
  console.error('❌  VITE_ELEVENLABS_API_KEY is empty in .env.local');
  process.exit(1);
}

console.log(`✅  API key loaded (${API_KEY.slice(0, 6)}...)`);
console.log(`🎙️  Voice: ${VOICE_ID} | Model: ${MODEL_ID}\n`);

// ── Voice settings per speech style ──────────────────────────────────────────
const SPEECH_STYLES = {
  statement:    { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  question:     { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  encouragement:{ stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  emphasis:     { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:     { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  celebration:  { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  instruction:  { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// ── Phrases to pre-generate ───────────────────────────────────────────────────
const phrases = [
  // Intro
  { text: "Welcome to Measurement: Length in Centimetres and Metres!", style: 'celebration'  },
  { text: "Today we'll learn how to measure, compare, and work with lengths.", style: 'statement' },
  { text: "Are you ready to become a Measuring Champion? Let's start!", style: 'encouragement' },

  // Story slide 0
  { text: "Emma found a ruler on her desk. What is this for? she asked Roo.", style: 'statement' },
  { text: "This ruler helps us measure length! Each small mark is 1 centimetre.", style: 'statement' },
  { text: "Each mark on a ruler equals 1 centimetre!", style: 'emphasis' },
  { text: "A ruler is our measuring superpower!", style: 'encouragement' },

  // Story slide 1
  { text: "Oliver placed his pencil on the ruler. It reaches all the way to 15!", style: 'statement' },
  { text: "That means your pencil is 15 centimetres long — or 15 cm! said Roo.", style: 'statement' },
  { text: "Always start from zero! Read the number at the end — that is the length!", style: 'emphasis' },

  // Story slide 2
  { text: "Roo, how long is the classroom door? asked Emma.", style: 'question'    },
  { text: "It is too long for centimetres! We use metres for long things.", style: 'statement' },
  { text: "100 centimetres make 1 metre — and we write it as 1 m!", style: 'emphasis' },
  { text: "Big things need big units!", style: 'encouragement' },

  // Story slide 3
  { text: "Now we can measure anything with centimetres and metres!", style: 'statement'    },
  { text: "You are now Measuring Champions! Let us practise!", style: 'celebration' },

  // Simulate
  { text: "This object starts at zero. Where does it end? Tap the number on the ruler!", style: 'instruction'   },
  { text: "Which is the shortest? Tap the bars from shortest to longest!", style: 'question'     },
  { text: "Fill in the blank! Use the number pad.", style: 'instruction'   },
  { text: "You ordered them from shortest to longest! Well done!", style: 'encouragement' },
  { text: "Correct! You completed the length sentence!", style: 'celebration'  },

  // Play
  { text: "Correct! Great work!", style: 'encouragement' },
  { text: "Not quite — let's look at the explanation.", style: 'statement'    },

  // Reflect
  { text: "What did you learn about measurement today?", style: 'question'    },
  { text: "How confident do you feel about measuring with centimetres and metres?", style: 'question'    },
  { text: "Amazing work! You are a Measuring Champion!", style: 'celebration'  },
  { text: "You have learned to measure with centimetres and metres.", style: 'statement'    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 55);
}

/**
 * Call ElevenLabs TTS via node:https — works on Node 14+ without fetch.
 * Returns a Buffer of the mp3 data, or throws on error.
 */
function callElevenLabs(text, style) {
  return new Promise((resolve, reject) => {
    const voiceSettings = SPEECH_STYLES[style] || SPEECH_STYLES.statement;
    const body = JSON.stringify({
      text,
      model_id:       MODEL_ID,
      voice_settings: voiceSettings,
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path:     `/v1/text-to-speech/${VOICE_ID}`,
      method:   'POST',
      headers:  {
        'xi-api-key':    API_KEY,
        'Content-Type':  'application/json',
        'Accept':        'audio/mpeg',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          const msg = Buffer.concat(chunks).toString('utf-8');
          reject(new Error(`ElevenLabs ${res.statusCode}: ${msg.slice(0, 200)}`));
        } else {
          resolve(Buffer.concat(chunks));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  const outDir  = path.join(ROOT, 'public', 'assets', 'audio');
  const mapPath = path.join(ROOT, 'src', 'utils', 'audioMap.js');

  fs.mkdirSync(outDir, { recursive: true });

  const map        = {};
  let   generated  = 0;
  let   skipped    = 0;
  let   failed     = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const slug     = slugify(text);
    const filename = `audio_${slug}_${i}.mp3`;
    const filepath = path.join(outDir, filename);
    const assetUrl = `/assets/audio/${filename}`;

    // Skip if already generated
    if (fs.existsSync(filepath)) {
      process.stdout.write(`⏩  [${String(i+1).padStart(2)}/${phrases.length}] Skip: ${filename}\n`);
      map[text] = assetUrl;
      skipped++;
      continue;
    }

    process.stdout.write(`🎙️  [${String(i+1).padStart(2)}/${phrases.length}] "${text.slice(0, 55)}..." `);

    try {
      const buffer = await callElevenLabs(text, style);
      fs.writeFileSync(filepath, buffer);
      map[text] = assetUrl;
      generated++;
      process.stdout.write('✅\n');
    } catch (err) {
      failed++;
      process.stdout.write(`❌  ${err.message}\n`);
      // Do NOT add to map — will retry on next run
    }

    // Respect ElevenLabs rate limit (~2 req/s on free tier)
    await sleep(600);
  }

  // ── Write audioMap.js ──────────────────────────────────────────
  const entries = Object.entries(map)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join('\n');

  const mapContent =
`/**
 * Auto-generated by scripts/generate_audio.js — DO NOT edit manually.
 * Run \`npm run generate-audio\` to regenerate.
 */
export const audioMap = {
${entries}
};
`;

  fs.writeFileSync(mapPath, mapContent, 'utf-8');

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✅  Generated : ${generated}`);
  console.log(`⏩  Skipped   : ${skipped}`);
  if (failed > 0)
    console.log(`❌  Failed    : ${failed}  (re-run to retry)`);
  console.log(`📄  audioMap.js written with ${Object.keys(map).length} entries`);
  console.log(`🎵  Audio files → public/assets/audio/`);
}

main().catch(e => { console.error('\n❌ Fatal:', e.message); process.exit(1); });
