// unitRateGenerator.js
// Generates unit rate and rate comparison questions.

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const CONTEXTS = {
  speed: {
    unit: "km/h",
    itemNoun: "hours",
    qtyNoun: "km",
    getValues: (level) => {
      const time = [2, 3, 4, 5, 8][randInt(0, 4)];
      const speed = level === 1 ? randInt(40, 60) : level === 2 ? randInt(60, 90) : randInt(80, 120);
      const distance = speed * time;
      return { numerator: distance, denominator: time, answer: speed, textContext: "speed" };
    }
  },
  price: {
    unit: "coins per item",
    itemNoun: "items",
    qtyNoun: "coins",
    getValues: (level) => {
      const quantity = randInt(2, level === 1 ? 5 : level === 2 ? 10 : 20);
      const unitPrice = level === 1 ? randInt(3, 8) : level === 2 ? randInt(6, 15) : randInt(12, 40);
      const totalPrice = unitPrice * quantity;
      return { numerator: totalPrice, denominator: quantity, answer: unitPrice, textContext: "price" };
    }
  },
  cooking: {
    unit: "cups flour per cake",
    itemNoun: "cakes",
    qtyNoun: "cups of flour",
    getValues: (level) => {
      const cakes = randInt(2, 6);
      const cupsPerCake = level === 1 ? 2 : level === 2 ? 3 : 4;
      const totalCups = cupsPerCake * cakes;
      return { numerator: totalCups, denominator: cakes, answer: cupsPerCake, textContext: "cooking" };
    }
  }
};

export const unitRateGenerator = {
  generate: (level, conceptTag) => {
    const tag = conceptTag || (Math.random() > 0.5 ? 'UNIT_RATE' : 'RATE_COMPARISON');
    let questionText = "";
    let correctAnswer = "";
    let data = {};

    const ctxType = Object.keys(CONTEXTS)[randInt(0, 2)];
    const ctx = CONTEXTS[ctxType];
    const { numerator, denominator, answer, textContext } = ctx.getValues(level);

    if (tag === 'UNIT_RATE') {
      if (textContext === 'speed') {
        questionText = `A racing kart travels ${numerator} km in ${denominator} hours. What is its speed (unit rate) in km/h?`;
      } else if (textContext === 'price') {
        questionText = `At the Spice Bazaar, Emma pays ${numerator} coins for ${denominator} bags of cinnamon. What is the unit rate in coins per bag?`;
      } else {
        questionText = `A recipe requires ${numerator} cups of flour to make ${denominator} cakes. What is the unit rate in cups of flour per cake?`;
      }
      correctAnswer = answer.toString();
      data = { numerator, denominator, answer, unit: ctx.unit, format: 'number' };
    } else { // RATE_COMPARISON
      // Compare two rates
      const multiplier = randInt(2, 4);
      const numerator2 = numerator * multiplier;
      const denominator2 = denominator * multiplier;
      
      // Make second item slightly faster or cheaper
      let answer2 = answer;
      let difference = 0;
      if (textContext === 'speed') {
        difference = randInt(5, 15);
        answer2 = answer + difference; // faster
      } else {
        difference = randInt(1, 3);
        answer2 = Math.max(1, answer - difference); // cheaper
      }

      const comparisonNum = answer2 * denominator2;

      let optionA = "";
      let optionB = "";

      if (textContext === 'speed') {
        optionA = `Kart A: ${numerator} km in ${denominator} hours (${answer} km/h)`;
        optionB = `Kart B: ${comparisonNum} km in ${denominator2} hours (${answer2} km/h)`;
        questionText = `Which kart is travelling faster? Kart A: ${numerator} km in ${denominator} hours, or Kart B: ${comparisonNum} km in ${denominator2} hours?`;
        correctAnswer = answer2 > answer ? "Kart B" : "Kart A";
      } else if (textContext === 'price') {
        optionA = `Vendor A: ${numerator} coins for ${denominator} items (${answer} coins/item)`;
        optionB = `Vendor B: ${comparisonNum} coins for ${denominator2} items (${answer2} coins/item)`;
        questionText = `Which vendor offers a cheaper rate per item? Vendor A: ${numerator} coins for ${denominator} items, or Vendor B: ${comparisonNum} coins for ${denominator2} items?`;
        correctAnswer = answer2 < answer ? "Vendor B" : "Vendor A";
      } else {
        optionA = `Recipe A: ${numerator} cups flour for ${denominator} cakes (${answer} cups/cake)`;
        optionB = `Recipe B: ${comparisonNum} cups flour for ${denominator2} cakes (${answer2} cups/cake)`;
        questionText = `Which recipe uses more cups of flour per cake? Recipe A: ${numerator} cups for ${denominator} cakes, or Recipe B: ${comparisonNum} cups for ${denominator2} cakes?`;
        correctAnswer = answer2 > answer ? "Recipe B" : "Recipe A";
      }

      data = { 
        numerator1: numerator, denominator1: denominator, rate1: answer,
        numerator2: comparisonNum, denominator2: denominator2, rate2: answer2,
        optionA, optionB, format: 'choice'
      };
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
