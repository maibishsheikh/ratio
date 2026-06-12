// contextTemplates.js
// Wraps raw math questions in story-appropriate context templates.
// Each concept tag maps to a pool of context stories.

const CONTEXT_POOLS = {
  RATIO_DEFINITION: [
    {
      setup: (data) => `In the Spice Bazaar, Emma sees a jar labelled: "${data.a} cups of cinnamon for every ${data.b} cups of cardamom."`,
      question: 'What is the ratio of cinnamon to cardamom?',
    },
    {
      setup: (data) => `Alex counts ${data.a} red spice bags and ${data.b} yellow spice bags in a market stall.`,
      question: 'What is the ratio of red bags to yellow bags?',
    },
  ],
  RATIO_SIMPLIFY: [
    {
      setup: (data) => `A recipe in the Bazaar calls for ${data.a} grams of pepper and ${data.b} grams of salt.`,
      question: 'What is this ratio in its simplest form?',
    },
    {
      setup: (data) => `Emma mixes ${data.a} ml of rose water with ${data.b} ml of sandalwood oil.`,
      question: 'Simplify the ratio of rose water to sandalwood oil.',
    },
  ],
  EQUIVALENT_RATIO: [
    {
      setup: (data) => `The secret spice blend uses ${data.a}:${data.b} ratio of pepper to salt. Alex wants to make a bigger batch.`,
      question: `If Alex uses ${data.valA2} parts of pepper, how many parts of salt does he need?`,
    },
    {
      setup: (data) => `A Bazaar recipe says mix ${data.a} cups flour for every ${data.b} cups sugar.`,
      question: `To make a larger batch with ${data.valA2} cups of flour, how many cups of sugar are needed?`,
    },
  ],
  UNIT_RATE: [
    {
      setup: (data) => `On the Speed Speedway, a kart travels ${data.numerator} metres in ${data.denominator} seconds.`,
      question: 'How many metres does it travel per second (unit rate)?',
    },
    {
      setup: (data) => `Zara buys ${data.denominator} energy drinks for ${data.numerator} coins at the pit stop.`,
      question: 'How much does each energy drink cost (price per unit)?',
    },
    {
      setup: (data) => `A racing engine burns ${data.numerator} ml of fuel in ${data.denominator} laps.`,
      question: 'How much fuel is burned per lap?',
    },
  ],
  RATE_COMPARISON: [
    {
      setup: (data) => `On the Speedway, Racer A covers ${data.numA} metres in ${data.denomA} seconds. Racer B covers ${data.numB} metres in ${data.denomB} seconds.`,
      question: 'Which racer has the higher unit rate speed?',
    },
  ],
  PROPORTION_CHECK: [
    {
      setup: (data) => `At the Market checkpoint, two traders claim their prices are proportional: ${data.a}/${data.b} and ${data.c}/${data.d}.`,
      question: 'Are these ratios in proportion? (Hint: Check if a×d = b×c)',
    },
    {
      setup: (data) => `The Bazaar scale shows ${data.a} grams balancing ${data.b} grams. A second scale shows ${data.c} grams balancing ${data.d} grams.`,
      question: 'Are these two scales in proportion?',
    },
  ],
  PERCENT_OF: [
    {
      setup: (data) => `Leo has ${data.total} gold coins in his vault at the Gold Exchange.`,
      question: `He wants to invest ${data.pct}% of his coins. How many coins is that?`,
    },
    {
      setup: (data) => `A market stall has ${data.total} items on display.`,
      question: `The stall owner gives a ${data.pct}% commission to Leo. How many items' worth is the commission?`,
    },
  ],
  PERCENT_CHANGE: [
    {
      setup: (data) => `The price of saffron in the Gold Exchange rose from ${data.base} coins to ${data.endVal} coins.`,
      question: 'What is the percentage increase in price?',
    },
    {
      setup: (data) => `Leo bought spice stock for ${data.base} coins. After a market dip, it is now worth ${data.endVal} coins.`,
      question: 'By what percentage has the value changed?',
    },
  ],
  PROFIT_LOSS_DISCOUNT: [
    {
      setup: (data) => `Leo buys a rare spice for ${data.costPrice} coins and sells it for ${data.sellingPrice} coins.`,
      question: `What is his ${data.sellingPrice > data.costPrice ? 'profit' : 'loss'} percentage?`,
    },
    {
      setup: (data) => `A market vendor offers a ${data.discountPct}% discount on a ${data.price}-coin item.`,
      question: 'What is the final selling price after the discount?',
    },
  ],
  SIMPLE_INTEREST: [
    {
      setup: (data) => `Leo deposits ${data.P} coins in the World Market Bank at a ${data.R}% simple interest rate per year.`,
      question: `How much simple interest does he earn after ${data.T} year(s)?`,
    },
    {
      setup: (data) => `The Gold Exchange offers ${data.R}% simple interest per year. Leo wants to earn ${data.I} coins in interest.`,
      question: `How much should Leo invest as the principal?`,
    },
  ],
};

// Randomly pick one context from the pool for a given concept tag
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Wraps a raw question in a story context.
 * Returns the question object with `questionText` enriched with world context.
 */
export function wrapInContext(question) {
  const pool = CONTEXT_POOLS[question.tag];
  if (!pool || !pool.length) return question;
  
  const ctx = pick(pool);
  
  // Build context text using the question's data fields
  try {
    const setup = ctx.setup(question.data);
    // Preserve the generator's question text if context question is too generic
    const finalQuestion = ctx.question || question.questionText;
    question.contextSetup = setup;
    question.questionText = `${setup} ${finalQuestion}`;
  } catch (e) {
    // If data doesn't match the template, just return as-is
  }
  
  return question;
}
