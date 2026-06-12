// irtEngine.js
// Item Response Theory (IRT) engine for adaptive math questions.

/**
 * Updates student's ability estimate (theta) using a simplified 1PL (Rasch) IRT model.
 * 
 * @param {number} theta Current ability estimate (typically between -3.0 and +3.0)
 * @param {boolean} isCorrect Whether the response was correct
 * @param {number} difficulty Difficulty parameter of the question answered (typically -2.0 to +2.0)
 * @returns {number} Updated ability estimate (bounded between -3.0 and +3.0)
 */
export function updateAbility(theta, isCorrect, difficulty) {
  const D = 1.702; // Scaling constant to match normal ogive model
  
  // Probability of correct answer based on student's ability (theta) and question difficulty
  const P = 1 / (1 + Math.exp(-D * (theta - difficulty)));
  
  // Update theta: if correct, increase theta; if incorrect, decrease theta.
  // The magnitude of the change depends on how "surprising" the result was (1 - P or -P).
  const learningRate = 0.5;
  const delta = isCorrect ? (1 - P) * learningRate : (-P) * learningRate;
  
  const newTheta = theta + delta;
  
  // Bound theta between -3 and +3
  return Math.max(-3, Math.min(3, newTheta));
}

/**
 * Maps theta value to a discrete question difficulty level (1 to 4).
 * 
 * @param {number} theta Ability estimate
 * @returns {number} Difficulty level (1 = Easy, 2 = Medium, 3 = Hard, 4 = Boss)
 */
export function getDifficultyLevel(theta) {
  if (theta < -1.0) {
    return 1; // Easy
  } else if (theta >= -1.0 && theta < 0.0) {
    return 2; // Medium
  } else if (theta >= 0.0 && theta < 1.0) {
    return 3; // Hard
  } else {
    return 4; // Boss / Expert
  }
}

/**
 * Maps a discrete difficulty level to a numerical IRT difficulty parameter.
 * 
 * @param {number} level Difficulty level (1-4)
 * @returns {number} Numerical difficulty parameter for IRT updates
 */
export function getDifficultyParameter(level) {
  switch (level) {
    case 1: return -1.5; // Easy question difficulty
    case 2: return -0.5; // Medium
    case 3: return 0.5;  // Hard
    case 4: return 1.5;  // Boss
    default: return 0.0;
  }
}
