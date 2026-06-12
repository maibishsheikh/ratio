import { Router } from 'express';
import https from 'https';

const router  = Router();
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability:0.65, similarity_boost:0.80, style:0.30 },
  question:      { stability:0.55, similarity_boost:0.75, style:0.50 },
  encouragement: { stability:0.50, similarity_boost:0.85, style:0.60 },
  emphasis:      { stability:0.75, similarity_boost:0.90, style:0.20 },
  thinking:      { stability:0.70, similarity_boost:0.78, style:0.40 },
  celebration:   { stability:0.45, similarity_boost:0.85, style:0.80 },
};

router.post('/generate', async (req, res) => {
  const { text, style = 'statement', voiceId, modelId } = req.body;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) return res.status(503).json({ error: 'TTS unavailable' });
  if (!text || text.length > 2000) return res.status(400).json({ error: 'Invalid text' });

  const vs   = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
  const vid  = voiceId || VOICE_ID;
  const mid  = modelId || MODEL_ID;
  const body = JSON.stringify({ text, model_id: mid, voice_settings: vs });

  const request = https.request({
    hostname: 'api.elevenlabs.io',
    path:     `/v1/text-to-speech/${vid}`,
    method:   'POST',
    headers: {
      'xi-api-key':   apiKey,
      'Content-Type': 'application/json',
      'Accept':       'audio/mpeg',
      'Content-Length': Buffer.byteLength(body),
    },
  }, (upstream) => {
    if (upstream.statusCode !== 200) {
      return res.status(upstream.statusCode).json({ error: 'TTS generation failed' });
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=604800');
    upstream.pipe(res);
  });

  request.on('error', () => res.status(500).json({ error: 'Upstream error' }));
  request.write(body);
  request.end();
});

export default router;
