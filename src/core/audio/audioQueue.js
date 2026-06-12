// audioQueue.js
// Manages sequential audio playing to prevent overlap.
// NO browser Web Speech API fallback — ElevenLabs only, per spec.

export class AudioQueue {
  constructor(playFunction) {
    this.queue = [];
    this.playing = false;
    this.play = playFunction;
    this.activeItem = null;
  }

  enqueue(audioItem) {
    // audioItem format: { src, onStart, onEnd, syncedAnimations: [{ delay, action }] }
    this.queue.push(audioItem);
    if (!this.playing) {
      this._playNext();
    }
  }

  clear() {
    this.queue = [];
    this.playing = false;
    this.activeItem = null;
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

    if (item.onStart) {
      item.onStart();
    }

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
      if (item.onEnd) item.onEnd();
      this._playNext();
    };

    // Only play if a src is available — no text-to-speech fallback
    if (item.src) {
      this.play(item.src, onPlaybackEnd, () => {
        // On error, continue the queue silently
        onPlaybackEnd();
      });
    } else {
      // No src and no fallback — skip silently and continue
      onPlaybackEnd();
    }
  }
}
