// antiRepeat.js
// Tracks recently-used questions to prevent immediate repetition.
// Stores a rolling window of the last N question texts.

const MAX_HISTORY = 20; // Keep track of the last 20 questions

class AntiRepeat {
  constructor() {
    this.history = [];
  }

  /**
   * Checks if a question was recently used.
   * @param {Object} question Question object with `questionText`
   * @param {Array} externalHistory Optional additional history to check
   * @returns {boolean} True if question is a duplicate
   */
  isDuplicate(question, externalHistory = []) {
    const allHistory = [...this.history, ...externalHistory];
    return allHistory.some(
      (q) => q.questionText === question.questionText
    );
  }

  /**
   * Registers a question as used.
   * @param {Object} question Question object
   */
  register(question) {
    this.history.push(question);
    if (this.history.length > MAX_HISTORY) {
      this.history.shift(); // Remove oldest entry
    }
  }

  /**
   * Clears history (useful when starting a new session or world).
   */
  clear() {
    this.history = [];
  }
}

// Export a singleton instance
export const antiRepeat = new AntiRepeat();
