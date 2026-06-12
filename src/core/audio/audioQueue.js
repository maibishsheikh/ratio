// audioQueue.js
// Manages sequential audio playing to prevent overlap.
// Can sync with visual animations and trigger callbacks.

export class AudioQueue {
  constructor(playFunction, speakFunction) {
    this.queue = [];
    this.playing = false;
    this.play = playFunction;   // Howler-based playback
    this.speak = speakFunction; // SpeechSynthesis-based fallback
    this.activeItem = null;
    this.speechUtterance = null;
  }

  enqueue(audioItem) {
    // audioItem format: { text, src, onStart, onEnd, syncedAnimations: [{ delay, action }] }
    this.queue.push(audioItem);
    if (!this.playing) {
      this._playNext();
    }
  }

  clear() {
    this.queue = [];
    this.playing = false;
    this.activeItem = null;
    if (this.speechUtterance) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  _playNext() {
    if (!this.queue.length) {
      this.playing = false;
      this.activeItem = null;
      return;
    }

    this.playing = true;
    const item = this.queue.shift();
    this.activeItem = item;

    // Trigger onStart callback
    if (item.onStart) {
      item.onStart();
    }

    // Trigger animations in lockstep
    if (item.syncedAnimations && item.syncedAnimations.length > 0) {
      item.syncedAnimations.forEach((a) => {
        setTimeout(() => {
          if (this.activeItem === item && a.action) {
            a.action();
          }
        }, a.delay);
      });
    }

    const onPlaybackEnd = () => {
      if (item.onEnd) {
        item.onEnd();
      }
      this._playNext();
    };

    // Attempt Howler audio if src available, else fall back to Speech Synthesis
    if (item.src) {
      this.play(item.src, onPlaybackEnd, (err) => {
        console.warn("Audio file playback failed. Falling back to TTS:", err);
        // Fall back to speaking the text
        this._speakFallback(item.text, onPlaybackEnd);
      });
    } else if (item.text) {
      this._speakFallback(item.text, onPlaybackEnd);
    } else {
      // Empty step, just end immediately
      onPlaybackEnd();
    }
  }

  _speakFallback(text, onEnd) {
    if (!text) {
      onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      this.speechUtterance = new SpeechSynthesisUtterance(text);
      this.speechUtterance.onend = onEnd;
      this.speechUtterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        onEnd(); // proceed even if TTS completely fails
      };
      
      // Attempt to find an English voice
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (engVoice) {
        this.speechUtterance.voice = engVoice;
      }
      
      window.speechSynthesis.speak(this.speechUtterance);
    } catch (e) {
      console.error("Critical fallback TTS failed:", e);
      onEnd();
    }
  }
}
