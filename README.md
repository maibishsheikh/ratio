# RatioCraft — Ratios, Rates & Proportions
**Grade 6 Interactive Learning Module · Intellia SG**

A fully gamified, story-driven, simulation-first educational web app.
Follows the **Equal learning methodology** — Wonder → Story → Simulate → Play → Reflect.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your ElevenLabs API key to .env.local
# VITE_ELEVENLABS_API_KEY=your_key_here

# 3. Pre-generate audio (optional but recommended for zero-latency playback)
node scripts/generate_audio.js

# 4. Start dev server
npm run dev
# → http://localhost:5173/courses/grade-6-math/ratios-rates-proportions/
```

---

## Audio Pipeline

1. **Pre-generation** — `node scripts/generate_audio.js`  
   Reads all phrases from the script → hits ElevenLabs API → saves `.mp3` files to `public/assets/audio/` → writes `src/utils/audioMap.js`

2. **Dynamic generation** — Falls back to ElevenLabs API at runtime for any text not in `audioMap.js`

3. **No browser TTS fallback** — If audio is unavailable, narration is skipped silently. No robotic voices.

4. **Cleanup** — `node scripts/clean_audio.js` removes orphaned `.mp3` files no longer in `audioMap.js`

---

## 100-Question Bank

`src/core/questions/questionBank.js` contains **100 static questions** across all topics:

| World | Topic | Questions |
|-------|-------|-----------|
| 1 — Spice Bazaar | Ratio Definition | 10 |
| 1 — Spice Bazaar | Simplifying Ratios | 10 |
| 1 — Spice Bazaar | Equivalent Ratios | 10 |
| 2 — Speed Speedway | Unit Rates | 10 |
| 2 — Speed Speedway | Rate Comparison | 10 |
| 2 — Speed Speedway | Proportions | 10 |
| 3 — Gold Exchange | Percentage Of | 10 |
| 3 — Gold Exchange | Percentage Change | 10 |
| 3 — Gold Exchange | Profit, Loss & Discount | 10 |
| 3 — Gold Exchange | Simple Interest | 15 |

Plus dynamic generation via `questionFactory.js` for unlimited replayability.

---

## Five-Phase Structure

| Phase | Activity |
|-------|----------|
| **Wonder** | Hook scene + curiosity question to spark engagement |
| **Story** | Character-driven narrated adventure (7 frames per world) |
| **Simulate** | 5 interactive simulations with manipulatives + discovery |
| **Play** | Guided · Independent · Timed · Mini-Games · Boss Battle |
| **Reflect** | Mastery bars · Badges · XP · Worksheet download |

---

## Tech Stack

- **React 18** + Vite 5
- **Tailwind CSS** + design tokens
- **Framer Motion** — all animations
- **Zustand** — global state (progress + UI)
- **ElevenLabs** — Voice Alice, eleven_multilingual_v2
- **html2pdf.js** — client-side worksheet PDF
- **Express** — backend audio proxy + analytics

---

## Deployment

```bash
npm run build
# Deploy dist/ to Vercel / Netlify / any static host
```

Backend (audio proxy):
```bash
node api/index.js
# Set ELEVENLABS_API_KEY in Railway / Render / Fly.io env vars
```
