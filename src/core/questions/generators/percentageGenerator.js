// percentageGenerator.js
// Generates percentage calculations, percentage change, and profit/loss/discount questions.

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const percentageGenerator = {
  generate: (level, conceptTag) => {
    const tags = ['PERCENT_OF', 'PERCENT_CHANGE', 'PROFIT_LOSS_DISCOUNT'];
    const tag = conceptTag || tags[randInt(0, 2)];
    let questionText = "";
    let correctAnswer = "";
    let data = {};

    if (tag === 'PERCENT_OF') {
      // e.g., "What is 25% of 80?"
      const percents = [10, 20, 25, 30, 40, 50, 60, 75, 80, 90];
      const pct = percents[randInt(0, percents.length - 1)];
      
      // Make total a multiple of 10 or 100
      const total = level === 1 ? randInt(1, 10) * 10 : level === 2 ? randInt(2, 20) * 10 : randInt(5, 50) * 10;
      const val = (pct * total) / 100;

      questionText = `What is ${pct}% of ${total} coins?`;
      correctAnswer = val.toString();
      data = { pct, total, val, format: 'number' };

    } else if (tag === 'PERCENT_CHANGE') {
      // e.g., "A stock price goes from 50 coins to 60 coins. What is the percentage increase?"
      const base = [10, 20, 40, 50, 80, 100, 150, 200][randInt(0, 7)];
      const isIncrease = Math.random() > 0.5;
      
      const changePct = [10, 20, 25, 30, 50, 75, 100].find(p => (base * p) % 100 === 0) || 50;
      const changeVal = (base * changePct) / 100;
      const endVal = isIncrease ? base + changeVal : base - changeVal;

      questionText = `A bag of spices was priced at ${base} coins, and its price is now ${endVal} coins. What is the percentage ${isIncrease ? 'increase' : 'decrease'}?`;
      correctAnswer = changePct.toString();
      data = { base, endVal, isIncrease, changePct, format: 'number' };

    } else { // PROFIT_LOSS_DISCOUNT
      // e.g., "A shield is priced at 120 coins. The store offers a 25% discount. What is the new price?"
      const price = [20, 40, 50, 60, 80, 100, 120, 150, 200, 300][randInt(0, 9)];
      const discountPct = [10, 15, 20, 25, 30, 50][randInt(0, 5)];
      
      const discountVal = (price * discountPct) / 100;
      const sellingPrice = price - discountVal;

      questionText = `A bag of gold dust costs ${price} coins, but the merchant offers a ${discountPct}% discount. What is the final price after the discount?`;
      correctAnswer = sellingPrice.toString();
      data = { price, discountPct, discountVal, sellingPrice, format: 'number' };
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
