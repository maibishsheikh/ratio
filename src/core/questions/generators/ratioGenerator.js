// ratioGenerator.js
// Generates ratio definition, simplification, and equivalent ratio questions.

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Greatest Common Divisor
function gcd(x, y) {
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export const ratioGenerator = {
  generate: (level, conceptTag) => {
    // Determine ranges based on level
    const maxVal = { 1: 12, 2: 30, 3: 99, 4: 300 }[level] || 12;
    
    // Choose concept tag if not specified
    const tags = ['RATIO_DEFINITION', 'RATIO_SIMPLIFY', 'EQUIVALENT_RATIO'];
    const tag = conceptTag || tags[Math.floor(Math.random() * tags.length)];

    let questionText = "";
    let correctAnswer = "";
    let data = {};

    if (tag === 'RATIO_DEFINITION') {
      // e.g. "In a fruit basket, there are 6 apples and 4 oranges. What is the ratio of apples to oranges?"
      const itemsA = ["apples", "blueberries", "strawberries", "pens", "marbles", "stamps"][randInt(0, 5)];
      const itemsB = ["oranges", "raspberries", "bananas", "pencils", "stickers", "coins"][randInt(0, 5)];
      
      const countA = randInt(2, maxVal);
      let countB = randInt(2, maxVal);
      while (countA === countB) {
        countB = randInt(2, maxVal);
      }

      questionText = `In a market crate, there are ${countA} ${itemsA} and ${countB} ${itemsB}. What is the ratio of ${itemsA} to ${itemsB} in the form a:b?`;
      correctAnswer = `${countA}:${countB}`;
      data = { countA, countB, itemsA, itemsB, answerA: countA, answerB: countB, format: 'colon' };

    } else if (tag === 'RATIO_SIMPLIFY') {
      // e.g. "Simplify the ratio 15:10 to lowest terms."
      const baseA = randInt(2, Math.ceil(maxVal / 3));
      let baseB = randInt(2, Math.ceil(maxVal / 3));
      while (gcd(baseA, baseB) !== 1) {
        baseB = randInt(2, Math.ceil(maxVal / 3));
      }
      
      // Make it unsimplified by multiplying by a factor
      const factor = level === 1 ? 2 : randInt(2, 6);
      const valA = baseA * factor;
      const valB = baseB * factor;

      questionText = `Simplify the ratio ${valA}:${valB} to its lowest terms.`;
      correctAnswer = `${baseA}:${baseB}`;
      data = { valA, valB, simplifiedA: baseA, simplifiedB: baseB, factor, format: 'colon' };

    } else { // EQUIVALENT_RATIO
      // e.g. "Find the missing number: 3:5 = 12:?"
      const baseA = randInt(1, 10);
      let baseB = randInt(2, 12);
      while (gcd(baseA, baseB) !== 1) {
        baseB = randInt(2, 12);
      }

      const factor1 = level <= 2 ? randInt(2, 5) : randInt(4, 10);
      const factor2 = factor1 + randInt(2, 5);

      const valA1 = baseA * factor1;
      const valB1 = baseB * factor1;
      const valA2 = baseA * factor2;
      const valB2 = baseB * factor2;

      // Hide one of the values (valB2)
      questionText = `Complete the equivalent ratio: ${valA1}:${valB1} = ${valA2}:?`;
      correctAnswer = valB2.toString();
      data = { valA1, valB1, valA2, valB2, baseA, baseB, missingVal: 'B2', format: 'number' };
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
