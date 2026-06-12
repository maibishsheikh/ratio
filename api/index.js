/**
 * api/index.js — Express backend
 * Responsibilities: ElevenLabs TTS proxy, analytics ingestion
 */
import express   from 'express';
import cors      from 'cors';
import rateLimit from 'express-rate-limit';
import audioRoute from './routes/audio.js';
import analyticsRoute from './routes/analytics.js';

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '50kb' }));

// Rate limiting on audio proxy
app.use('/api/audio', rateLimit({ windowMs: 60_000, max: 60, message: 'Too many requests' }));

app.use('/api/audio',     audioRoute);
app.use('/api/analytics', analyticsRoute);

app.get('/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }));

app.listen(PORT, () => console.log(`✅  RatioCraft API on :${PORT}`));
