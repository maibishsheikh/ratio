// audio.config.js
// ElevenLabs voice configuration and audio settings

export const VOICE_CONFIG = {
  Narrator: {
    voiceId: '21m00Tcm4TlvDq8ikWAM', // Alice
    model: 'eleven_multilingual_v2',
    stability: 0.6,
    similarityBoost: 0.8,
  },
  Alex: {
    voiceId: 'IKne3meq5aSn9XLyUdCD', // Charlie
    model: 'eleven_multilingual_v2',
    stability: 0.7,
    similarityBoost: 0.75,
  },
  Emma: {
    voiceId: '9BWtsMINqrJLrRacOk9x', // Aria
    model: 'eleven_multilingual_v2',
    stability: 0.65,
    similarityBoost: 0.8,
  },
  Zara: {
    voiceId: 'FGY2WhTYpPnrIDTdsKH5', // Laura
    model: 'eleven_multilingual_v2',
    stability: 0.6,
    similarityBoost: 0.8,
  },
  Leo: {
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', // George
    model: 'eleven_multilingual_v2',
    stability: 0.72,
    similarityBoost: 0.78,
  },
  Feedback: {
    voiceId: '21m00Tcm4TlvDq8ikWAM', // Alice — short feedback phrases
    model: 'eleven_multilingual_v2',
    stability: 0.8,
    similarityBoost: 0.9,
  },
};

// Audio generation endpoint (proxied through Express backend)
export const AUDIO_PROXY_URL = '/api/audio/generate';

// Audio states
export const AUDIO_STATE = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  COMPLETE: 'COMPLETE',
  SKIPPED: 'SKIPPED',
  FAILED: 'FAILED',
};
