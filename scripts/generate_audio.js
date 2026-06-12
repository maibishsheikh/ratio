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
  // WONDER
  { text: "Welcome to the Great World Market! Alex and Emma have discovered a secret recipe map — but it's written entirely in ratios. Three parts pepper for every two parts salt. Can you help them decode it?", style: 'encouragement' },
  { text: "If we want six bags of salt, how many bags of pepper do we need?", style: 'question' },
  { text: "Excellent! Six bags of salt is three times the two-part ratio, so we need three times the three parts of pepper — that's nine bags! You already understand ratios!", style: 'celebration' },
  { text: "Good try! Remember — ratios scale by multiplication. Six divided by two gives us the scale factor of three. Three times three pepper parts gives nine bags!", style: 'encouragement' },
  { text: "At the Speed Speedway, Zara faces a challenger! The rival boasts: I do one hundred twenty metres in six seconds! Zara replies: I do ninety metres in three seconds. But who is actually faster?", style: 'encouragement' },
  { text: "Calculate the unit rate — speed per second. Who is faster?", style: 'question' },
  { text: "That's right! Zara's speed is ninety divided by three — thirty metres per second. The rival's speed is one hundred twenty divided by six — only twenty metres per second. Zara wins!", style: 'celebration' },
  { text: "Leo stands at the Gold Exchange vault! A banker offers: Deposit five hundred gold coins at ten percent simple interest per year. Leo asks: how much interest will I earn in two years?", style: 'encouragement' },
  { text: "Calculate the simple interest using I equals P times R times T divided by one hundred.", style: 'question' },
  { text: "Perfect! Ten percent of five hundred is fifty coins per year. Over two years, that's one hundred coins total interest!", style: 'celebration' },
  // STORY
  { text: "Deep within the Great World Market, a legendary challenge has begun! Only those who master the language of ratios may claim the Golden Scale Trophy.", style: 'statement' },
  { text: "Alex unrolled the ancient scroll. It was filled with strange symbols — pairs of numbers separated by colons. This must be the ratio code!", style: 'statement' },
  { text: "Emma leaned over. A ratio is just a way of comparing two quantities. Three colon two means for every three of one thing, there are two of another.", style: 'statement' },
  { text: "But Emma — how do we know if two ratios are describing the same relationship? asked Alex, scratching his head.", style: 'question' },
  { text: "Good question! If you multiply or divide both parts by the same number, you get an equivalent ratio. Three colon two is the same as six colon four, or nine colon six!", style: 'statement' },
  { text: "Alex's eyes lit up. So ratios can be simplified — just like fractions! We find the greatest common factor and divide!", style: 'emphasis' },
  { text: "The spice merchant smiled. You've cracked the first code! Now you may enter the Bazaar. But beware — the next challenge requires comparing rates!", style: 'celebration' },
  { text: "The Speed Speedway roared with engines! Zara stepped up to the starting line, eyes fierce. I calculate speed before I race. Knowledge is my real engine.", style: 'statement' },
  { text: "A unit rate tells you how much of one thing happens per single unit of another. Like kilometres per hour — distance per one hour.", style: 'emphasis' },
  { text: "Zara challenged her rival. You say one hundred twenty kilometres in six hours. I say ninety kilometres in three hours. Shall we find our unit rates?", style: 'statement' },
  { text: "The rival gulped. One hundred twenty divided by six is twenty kilometres per hour. Zara smiled — ninety divided by three is thirty! I'm fifty percent faster!", style: 'statement' },
  { text: "Two ratios form a proportion when they're equal. Cross-multiply to check — if a times d equals b times c, the ratios are proportional!", style: 'emphasis' },
  { text: "And that is how Zara won the Speedway — not just with speed, but with mathematics!", style: 'celebration' },
  { text: "Leo polished his golden abacus. The Gold Exchange was the most complex district of all — percentages, profit, loss, and the mysterious art of simple interest.", style: 'statement' },
  { text: "Percent means per hundred. So forty percent simply means forty out of every hundred. It's a special ratio where the second term is always one hundred!", style: 'emphasis' },
  { text: "Leo explained profit and loss with a smile. If you buy at a low price and sell higher — that difference over the cost price, expressed as a percentage, is your profit percent.", style: 'statement' },
  { text: "And simple interest? Leo tapped the formula on the wall. Interest equals Principal times Rate times Time, all divided by one hundred. Linear. Predictable. Powerful.", style: 'emphasis' },
  { text: "With this knowledge, Leo turned five hundred coins into six hundred in just two years. The merchants of the Gold Exchange bowed in respect.", style: 'celebration' },
  // SIMULATE
  { text: "Welcome to the Ratio Bar Builder! Drag the sliders to adjust the quantities and watch how the ratio changes. Try to find two ratios that look the same!", style: 'statement' },
  { text: "Amazing! You discovered that three colon two and six colon four look identical when the bars are the same length. They are equivalent ratios — related by a scale factor!", style: 'celebration' },
  { text: "Now meet the Proportion Scale! Place your ratio tokens on each side and try to balance it. When both sides are equal — you've found a proportion!", style: 'statement' },
  { text: "Yes! When the scale balances, a times d always equals b times c. That's the cross-multiplication rule for proportions!", style: 'celebration' },
  { text: "Welcome to the Rate Speedway! Each car has a distance and a time. Divide to find its unit rate. Then see who wins the race!", style: 'statement' },
  { text: "Unit rate confirmed! Distance divided by time gives you the rate per single unit. That's how we compare speeds fairly.", style: 'celebration' },
  { text: "This is Leo's Coin Vault! Turn the dial to choose a percentage and watch exactly that many coins flow out of a hundred. Percent means per hundred!", style: 'statement' },
  { text: "That's it! You can see that forty percent of one hundred is exactly forty coins. The percentage bar makes it visual!", style: 'celebration' },
  { text: "Step into the Simple Interest Time Machine! Set the principal, rate, and time — then watch Leo's coins grow year by year. The formula I equals P times R times T over one hundred powers the machine!", style: 'statement' },
  { text: "Perfect! The coins grow linearly — the same amount each year. That's what makes it simple interest. Now verify your formula result matches the animation!", style: 'celebration' },
  // PLAY
  { text: "Great work! Now let's practise what you've discovered. Choose a mode to begin!", style: 'statement' },
  { text: "Excellent answer! You've got it!", style: 'celebration' },
  { text: "Brilliant reasoning! Keep going!", style: 'encouragement' },
  { text: "That's exactly right! Well done!", style: 'celebration' },
  { text: "Not quite — but you're close! Think about the scale factor.", style: 'thinking' },
  { text: "Almost! Remember to divide both terms by the same number.", style: 'thinking' },
  { text: "The Boss Battle begins! Answer five questions correctly to defeat the Market Boss and claim your trophy!", style: 'emphasis' },
  { text: "You defeated the Boss! The Golden Scale Trophy is yours!", style: 'celebration' },
  // REFLECT
  { text: "Congratulations! You've completed this World! Let's see how well you mastered the concepts.", style: 'statement' },
  { text: "Your mastery scores are outstanding! You've earned a badge and a printable worksheet. Well done, champion!", style: 'celebration' },
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

    // Escape backticks in key
    const escapedText = text.replace(/`/g, '\\`');
    mapEntries.push(`  \`${escapedText}\`: '${publicPath}',`);
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
