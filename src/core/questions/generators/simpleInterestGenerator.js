// simpleInterestGenerator.js
// Generates simple interest word problems: finding Interest (I), Principal (P), or Time (T).

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const simpleInterestGenerator = {
  generate: (level, conceptTag) => {
    const tag = 'SIMPLE_INTEREST';
    
    // Principal (P), Rate (R), Time (T)
    // Keep numbers clean and calculations integer-based
    const P = level <= 2 ? randInt(1, 10) * 100 : randInt(5, 50) * 100;
    const R = [5, 6, 8, 10, 12, 15][randInt(0, 5)];
    const T = randInt(1, level <= 2 ? 3 : 5);
    
    const I = (P * R * T) / 100;
    const totalAmount = P + I;

    // Type of question: FIND_I (90% for levels 1-2, 60% for levels 3-4), or FIND_P, FIND_T
    let qType = 'FIND_I';
    if (level >= 3) {
      qType = ['FIND_I', 'FIND_P', 'FIND_T'][randInt(0, 2)];
    }

    let questionText = "";
    let correctAnswer = "";
    let data = { P, R, T, I, totalAmount, qType, format: 'number' };

    if (qType === 'FIND_I') {
      questionText = `Leo deposits ${P} coins in the Time Machine Bank at a simple interest rate of ${R}% per year. How many coins in simple interest does he earn after ${T} ${T === 1 ? 'year' : 'years'}?`;
      correctAnswer = I.toString();
    } else if (qType === 'FIND_P') {
      questionText = `Leo earns ${I} coins of simple interest over ${T} ${T === 1 ? 'year' : 'years'} at an interest rate of ${R}% per year. How many coins did he originally deposit (Principal)?`;
      correctAnswer = P.toString();
    } else { // FIND_T
      questionText = `Leo deposits ${P} coins at a simple interest rate of ${R}% per year. After how many years does he earn ${I} coins of simple interest?`;
      correctAnswer = T.toString();
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
