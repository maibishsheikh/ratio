/**
 * Vercel Serverless Function: /api/elevenlabs
 * Proxies ElevenLabs TTS requests — keeps the API key server-side.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'ElevenLabs API key not configured.' });
    return;
  }

  const { text, voice_id, model_id, voice_settings } = req.body ?? {};
  if (!text) {
    res.status(400).json({ error: 'Missing text field.' });
    return;
  }

  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id ?? 'Xb7hH8MSUJpSbSDYk0k2'}`;

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'xi-api-key':   apiKey,
        'Content-Type': 'application/json',
        'Accept':       'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id:       model_id ?? 'eleven_multilingual_v2',
        voice_settings: voice_settings ?? {
          stability:        0.20,
          similarity_boost: 0.55,
          style:            0.50,
          use_speaker_boost: true,
        },
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      res.status(upstream.status).json({ error: err });
      return;
    }

    const audioBuffer = await upstream.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
