/**
 * questionFactory.js
 * Entry point for dynamic question generation.
 * Falls back to bank-based generation when no generator matches.
 */
import { questionBank, getRandomQuestions, parseOptions } from './questionBank';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function simplify(a, b) { const g = gcd(a, b); return [a/g, b/g]; }

// ── Anti-repetition registry ────────────────────────────────────────
const recentIds = [];
const MAX_RECENT = 8;

function registerQuestion(id) {
  recentIds.push(id);
  if (recentIds.length > MAX_RECENT) recentIds.shift();
}

function isDuplicate(id) { return recentIds.includes(id); }

// ── Generators ──────────────────────────────────────────────────────

const generators = {
  RATIO_DEFINITION(level) {
    const items = ['apples','oranges','books','pens','stars','coins','gems','keys'];
    const a = randInt(1, level <= 2 ? 9 : 15);
    const b = randInt(1, level <= 2 ? 9 : 15);
    const item1 = items[randInt(0, items.length-1)];
    const item2 = items.filter(i => i !== item1)[randInt(0, items.length-2)];
    const distractors = [
      `${b}:${a}`,
      `${a+b}:${b}`,
      `${a}:${a+b}`,
    ];
    const opts = [`${a}:${b}`, ...distractors].sort(() => Math.random()-0.5);
    return {
      id: `DYN_RD_${a}_${b}`,
      tag: 'RATIO_DEFINITION', level, world: 1,
      questionText: `There are ${a} ${item1} and ${b} ${item2}. What is the ratio of ${item1} to ${item2}?`,
      correctAnswer: `${a}:${b}`,
      options: opts.join(','),
      explanation: `Ratio of ${item1} to ${item2} = ${a}:${b}. Read in the order asked.`,
    };
  },

  RATIO_SIMPLIFY(level) {
    const common = level <= 2 ? [2,3,4,5] : [6,7,8,9,10,12];
    const g = common[randInt(0, common.length-1)];
    const a = randInt(2, level <= 2 ? 6 : 10);
    const b = randInt(2, level <= 2 ? 6 : 10);
    if (a === b) return generators.RATIO_SIMPLIFY(level);
    const sa = a * g, sb = b * g;
    const distractors = [`${sa}:${sb}`, `${a+1}:${b}`, `${a}:${b+1}`];
    const opts = [`${a}:${b}`, ...distractors].sort(() => Math.random()-0.5);
    return {
      id: `DYN_RS_${sa}_${sb}`,
      tag: 'RATIO_SIMPLIFY', level, world: 1,
      questionText: `Simplify the ratio ${sa}:${sb} to its lowest terms.`,
      correctAnswer: `${a}:${b}`,
      options: opts.join(','),
      explanation: `GCF of ${sa} and ${sb} is ${g}. ${sa}÷${g}=${a}, ${sb}÷${g}=${b}. Answer: ${a}:${b}.`,
    };
  },

  EQUIVALENT_RATIO(level) {
    const a = randInt(1, 7), b = randInt(1, 7);
    if (a === b) return generators.EQUIVALENT_RATIO(level);
    const mult = randInt(2, level <= 2 ? 5 : 9);
    const targetB = b * mult;
    const correctA = a * mult;
    const opts = [correctA, correctA+1, correctA-1, correctA+mult].filter(v => v > 0 && v !== correctA || v === correctA);
    const unique = [...new Set(opts)].slice(0, 4);
    return {
      id: `DYN_ER_${a}_${b}_${mult}`,
      tag: 'EQUIVALENT_RATIO', level, world: 1,
      questionText: `Complete the equivalent ratio: ${a}:${b} = ?:${targetB}`,
      correctAnswer: String(correctA),
      options: unique.map(String).join(','),
      explanation: `Scale factor = ${targetB}÷${b} = ${mult}. So ${a}×${mult} = ${correctA}.`,
    };
  },

  UNIT_RATE(level) {
    const contexts = [
      { noun: 'km', verb: 'travels', per: 'hour',   distRange: [2,8], valRange: [60,300] },
      { noun: 'items', verb: 'produces', per: 'hour', distRange: [2,8], valRange: [40,200] },
      { noun: 'pages', verb: 'reads', per: 'hour',   distRange: [2,8], valRange: [50,400] },
      { noun: 'litres', verb: 'pumps', per: 'minute', distRange: [2,10], valRange: [20,100] },
    ];
    const ctx = contexts[randInt(0, contexts.length-1)];
    const t = randInt(...ctx.distRange);
    const unitRate = randInt(10, level <= 2 ? 50 : 100);
    const total = unitRate * t;
    const wrong = [unitRate+randInt(2,8), unitRate-randInt(1,5), total, Math.round(total/2)].filter(v=>v>0&&v!==unitRate);
    const opts = [unitRate, ...wrong.slice(0,3)].sort(()=>Math.random()-0.5);
    return {
      id: `DYN_UR_${total}_${t}`,
      tag: 'UNIT_RATE', level, world: 2,
      questionText: `A vehicle ${ctx.verb} ${total} ${ctx.noun} in ${t} ${ctx.per}s. What is the unit rate per ${ctx.per}?`,
      correctAnswer: String(unitRate),
      options: opts.map(String).join(','),
      explanation: `Unit rate = ${total} ÷ ${t} = ${unitRate} ${ctx.noun} per ${ctx.per}.`,
    };
  },

  PROPORTION_CHECK(level) {
    const a = randInt(1,9), b = randInt(1,9);
    const mult = randInt(2, level<=2?5:8);
    const c = a*mult, d = b*mult;
    const questionType = Math.random() > 0.4 ? 'SOLVE' : 'CHECK';
    if (questionType === 'CHECK') {
      return {
        id: `DYN_PC_${a}_${b}_${c}_${d}`,
        tag: 'PROPORTION_CHECK', level, world: 2,
        questionText: `Do the ratios ${a}:${b} and ${c}:${d} form a proportion?`,
        correctAnswer: 'Yes',
        options: 'Yes,No',
        explanation: `Cross-multiply: ${a}×${d}=${a*d}, ${b}×${c}=${b*c}. Since ${a*d}=${b*c}, they ARE proportional.`,
      };
    }
    const missing = d;
    const wrong = [missing+2, missing-2, a*c, b+mult].filter(v=>v>0&&v!==missing);
    const opts = [missing, ...wrong.slice(0,3)].sort(()=>Math.random()-0.5);
    return {
      id: `DYN_SOLVE_${a}_${b}_${c}`,
      tag: 'PROPORTION_CHECK', level, world: 2,
      questionText: `Solve for x: ${a}/${b} = ${c}/x`,
      correctAnswer: String(missing),
      options: opts.map(String).join(','),
      explanation: `Cross-multiply: ${a}×x = ${b}×${c} → x = ${b*c}÷${a} = ${missing}.`,
    };
  },

  PERCENT_OF(level) {
    const pcts = level<=2 ? [10,20,25,50,75] : [15,30,35,40,60,70,80,90];
    const pct = pcts[randInt(0,pcts.length-1)];
    const base = randInt(1, level<=2?20:50) * (level<=2?10:5);
    const ans = (pct/100) * base;
    if (!Number.isInteger(ans)) return generators.PERCENT_OF(level);
    const wrong = [ans+pct, ans-5, ans*2, Math.round(base*pct/50)].filter(v=>v>0&&v!==ans);
    const opts = [ans, ...wrong.slice(0,3)].sort(()=>Math.random()-0.5);
    return {
      id: `DYN_PO_${pct}_${base}`,
      tag: 'PERCENT_OF', level, world: 3,
      questionText: `What is ${pct}% of ${base}?`,
      correctAnswer: String(ans),
      options: opts.map(String).join(','),
      explanation: `${pct}% of ${base} = (${pct}÷100) × ${base} = ${ans}.`,
    };
  },

  PERCENT_CHANGE(level) {
    const base = randInt(4, level<=2?20:50) * 10;
    const pct  = [5,10,15,20,25,30][randInt(0,5)];
    const increase = Math.random() > 0.4;
    const change  = (pct/100)*base;
    const newVal  = increase ? base + change : base - change;
    const wrong   = [newVal+pct, newVal-10, base, newVal+change];
    const opts    = [newVal, ...wrong.filter(v=>v>0&&v!==newVal).slice(0,3)].sort(()=>Math.random()-0.5);
    return {
      id: `DYN_PCH_${base}_${pct}_${increase}`,
      tag: 'PERCENT_CHANGE', level, world: 3,
      questionText: `A price of ${base} coins ${increase?'increases':'decreases'} by ${pct}%. What is the new price?`,
      correctAnswer: String(newVal),
      options: opts.map(String).join(','),
      explanation: `${pct}% of ${base} = ${change}. New price = ${base} ${increase?'+':'-'} ${change} = ${newVal} coins.`,
    };
  },

  SIMPLE_INTEREST(level) {
    const P = randInt(2, level<=2?20:50) * 100;
    const R = [5,8,10,12,15,20][randInt(0, level<=2?2:5)];
    const T = randInt(1, level<=2?4:8);
    const I = (P*R*T)/100;
    const wrong = [I+R*T, I*2, P*R/100, I+50];
    const opts  = [I, ...wrong.filter(v=>v>0&&v!==I).slice(0,3)].sort(()=>Math.random()-0.5);
    return {
      id: `DYN_SI_${P}_${R}_${T}`,
      tag: 'SIMPLE_INTEREST', level, world: 3,
      questionText: `Calculate simple interest: P = ${P} coins, R = ${R}%, T = ${T} year${T>1?'s':''}.`,
      correctAnswer: String(I),
      options: opts.map(String).join(','),
      explanation: `I = P×R×T÷100 = ${P}×${R}×${T}÷100 = ${I} coins.`,
    };
  },
};

// ── Public API ──────────────────────────────────────────────────────

/**
 * Generate one question for a concept tag at given difficulty level.
 * Falls back to questionBank if no generator available.
 */
export function generateQuestion(tag, level = 1) {
  const gen = generators[tag];
  if (gen) {
    let q, attempts = 0;
    do { q = gen(level); attempts++; } while (isDuplicate(q.id) && attempts < 5);
    registerQuestion(q.id);
    return q;
  }
  // Fallback: pull from bank
  const pool = questionBank.filter(q => q.tag === tag && q.level <= level+1);
  if (!pool.length) return questionBank[randInt(0, questionBank.length-1)];
  return pool[randInt(0, pool.length-1)];
}

/**
 * Generate N unique questions covering all tags for a world.
 */
export function generateWorldQuestions(worldId, n = 10) {
  const tagsByWorld = {
    1: ['RATIO_DEFINITION','RATIO_SIMPLIFY','EQUIVALENT_RATIO'],
    2: ['UNIT_RATE','RATE_COMPARISON','PROPORTION_CHECK'],
    3: ['PERCENT_OF','PERCENT_CHANGE','SIMPLE_INTEREST'],
  };
  const tags = tagsByWorld[worldId] || tagsByWorld[1];
  const questions = [];
  for (let i = 0; i < n; i++) {
    const tag = tags[i % tags.length];
    const level = Math.min(4, Math.floor(i / tags.length) + 1);
    questions.push(generateQuestion(tag, level));
  }
  return questions;
}
