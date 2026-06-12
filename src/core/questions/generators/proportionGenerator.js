// proportionGenerator.js
// Generates proportion checks (Yes/No) and missing terms in proportions.

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(x, y) {
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export const proportionGenerator = {
  generate: (level, conceptTag) => {
    const tag = 'PROPORTION_CHECK';
    let questionText = "";
    let correctAnswer = "";
    let data = {};

    // 50% chance to do a Yes/No check or a solve for x check
    const isCheck = Math.random() > 0.5;

    if (isCheck) {
      // Yes/No check: e.g., "Do the ratios 3:5 and 12:20 form a proportion?"
      const baseA = randInt(2, 8);
      let baseB = randInt(2, 8);
      while (gcd(baseA, baseB) !== 1) {
        baseB = randInt(2, 8);
      }

      const mult1 = randInt(2, level === 1 ? 3 : 5);
      const mult2 = mult1 + randInt(1, 3);

      const ratio1A = baseA * mult1;
      const ratio1B = baseB * mult1;

      // 50% chance to be proportional
      const isProportional = Math.random() > 0.5;

      let ratio2A = baseA * mult2;
      let ratio2B = baseB * mult2;

      if (!isProportional) {
        // Break proportion slightly
        if (Math.random() > 0.5) {
          ratio2B += Math.random() > 0.5 ? 1 : -1;
        } else {
          ratio2A += Math.random() > 0.5 ? 1 : -1;
        }
      }

      questionText = `Do the ratios ${ratio1A}:${ratio1B} and ${ratio2A}:${ratio2B} form a proportion? Answer "Yes" or "No".`;
      correctAnswer = isProportional ? "Yes" : "No";
      data = { 
        ratio1A, ratio1B, ratio2A, ratio2B, 
        isProportional, format: 'yes_no' 
      };
    } else {
      // Solve for X: e.g., "Solve the proportion: 3/4 = 15/x"
      const baseA = randInt(2, 6);
      let baseB = randInt(3, 9);
      while (gcd(baseA, baseB) !== 1 || baseA === baseB) {
        baseB = randInt(3, 9);
      }

      const factor = level === 1 ? 3 : level === 2 ? randInt(3, 6) : randInt(6, 12);
      
      const valA = baseA * factor;
      const valB = baseB * factor;

      // Hide valB (which is X)
      // Standard format: a/b = c/x
      questionText = `Solve the proportional relationship: ${baseA}/${baseB} = ${valA}/x. What is the value of x?`;
      correctAnswer = valB.toString();
      data = { baseA, baseB, valA, valB, format: 'number' };
    }

    return {
      tag,
      level,
      questionText,
      correctAnswer,
      data
    };
  }
};
