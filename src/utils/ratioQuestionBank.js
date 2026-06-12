// ════════════════════════════════════════════════════════════════
// RatioCraft — Question Bank
// 10 generator types × 10 difficulty-tagged variants = 100 questions
// Each call to generateSessionQuestions() produces a FRESH random
// 100-question set, shuffled and split into 10 worlds of 10.
// ════════════════════════════════════════════════════════════════

export const SG_NAMES = ['Mia','Raju','Wei Ming','Priya','Ahmad','Siti','Jun','Kavya','Ryan','Lin','Xiao Ling','Hassan'];

// ── Core helpers ───────────────────────────────────────────────
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Distinct positive-integer distractors near `correct`
export function numDistractors(correct, count = 3, spread = 4) {
  const set = new Set();
  let tries = 0;
  while (set.size < count && tries < 100) {
    const offset = randInt(-spread, spread);
    if (offset !== 0) {
      const val = correct + offset;
      if (val > 0 && val !== correct) set.add(val);
    }
    tries++;
  }
  let f = 1;
  while (set.size < count) {
    const val = correct + count + f;
    if (val !== correct) set.add(val);
    f++;
  }
  return Array.from(set).slice(0, count);
}

// Distinct positive decimal distractors near `correct`
export function decimalDistractors(correct, count = 3, step = 0.5, spread = 3) {
  const set = new Set();
  let tries = 0;
  while (set.size < count && tries < 100) {
    const mult = randInt(-spread, spread);
    if (mult !== 0) {
      const val = +(correct + mult * step).toFixed(2);
      if (val > 0 && val !== correct) set.add(val);
    }
    tries++;
  }
  let f = 1;
  while (set.size < count) {
    set.add(+(correct + (count + f) * step).toFixed(2));
    f++;
  }
  return Array.from(set).slice(0, count);
}

// Build a shuffled 4-option array containing `correct` + distractors
export function buildOptions(correct, distractors) {
  const opts = [String(correct)];
  for (const d of distractors) {
    const s = String(d);
    if (!opts.includes(s)) opts.push(s);
  }
  let filler = 1;
  while (opts.length < 4) {
    opts.push(`${correct}_${filler}`);
    filler++;
  }
  return shuffleArray(opts.slice(0, 4));
}

// ════════════════════════════════════════════════════════════════
// 10 QUESTION TYPE GENERATORS
// ════════════════════════════════════════════════════════════════

// Q1 — Simplify a ratio
function genQ1(id, diff) {
  const factors  = diff === 1 ? [2,3,4] : diff === 2 ? [2,3,4,5,6] : [3,4,5,6,7,8];
  const g = pick(factors);
  const maxBase  = diff === 1 ? 6 : diff === 2 ? 9 : 12;
  let sa = randInt(1, maxBase);
  let sb = randInt(1, maxBase);
  while (sb === sa) sb = randInt(1, maxBase);
  const a = sa * g, b = sb * g;
  const correct = `${sa}:${sb}`;
  const candidates = [`${a}:${b}`, `${sb}:${sa}`, `${sa + 1}:${sb}`, `${sa}:${sb + 1}`]
    .filter(c => c !== correct);
  return {
    id, type: 'simplify_ratio', topic: 'Ratios', world: 0, difficulty: diff,
    questionText: `Simplify the ratio ${a} : ${b} to its simplest form.`,
    visual: 'ratio_bar', barA: a, barB: b, barLabelA: `${a}`, barLabelB: `${b}`, barMissing: 'none',
    hint1: `Find the largest number that divides evenly into both ${a} and ${b}.`,
    hint2: `${a} ÷ ${g} = ${sa}, and ${b} ÷ ${g} = ${sb}.`,
    explanation: `${g} divides evenly into both numbers. ${a}:${b} = ${sa}:${sb}.`,
    options: buildOptions(correct, candidates),
    correctAnswer: correct,
  };
}

// Q2 — Equivalent ratio: find the missing term
function genQ2(id, diff) {
  const maxBase = diff === 1 ? 6 : diff === 2 ? 9 : 12;
  let a = randInt(2, maxBase), b = randInt(2, maxBase);
  while (b === a) b = randInt(2, maxBase);
  const k = diff === 1 ? randInt(2,3) : diff === 2 ? randInt(2,5) : randInt(2,8);
  const c = a * k;
  const correct = b * k;
  return {
    id, type: 'equivalent_ratio', topic: 'Ratios', world: 0, difficulty: diff,
    questionText: `${a} : ${b}  =  ${c} : ?\n\nWhat number completes this equivalent ratio?`,
    visual: 'proportion', propA: a, propB: b, propC: c, propD: '?',
    hint1: `What number was ${a} multiplied by to get ${c}?`,
    hint2: `${a} × ${k} = ${c}. Multiply ${b} by ${k} too.`,
    explanation: `${a}:${b} = ${c}:${correct}, because both sides are multiplied by ${k}.`,
    options: buildOptions(correct, numDistractors(correct, 3, 5)),
    correctAnswer: correct,
  };
}

// Q3 — Ratio sharing word problem
function genQ3(id, diff) {
  const maxRatio = diff === 1 ? 5 : diff === 2 ? 8 : 12;
  let ra = randInt(1, maxRatio), rb = randInt(1, maxRatio);
  while (rb === ra) rb = randInt(1, maxRatio);
  const k = diff === 1 ? randInt(2,4) : diff === 2 ? randInt(3,6) : randInt(4,9);
  const partA = ra * k, partB = rb * k, total = partA + partB;
  const name1 = pick(SG_NAMES);
  let name2 = pick(SG_NAMES);
  while (name2 === name1) name2 = pick(SG_NAMES);
  const obj = pick(['marbles', 'stickers', 'sweets 🍬', 'pencils', 'beads', 'baseball cards']);
  return {
    id, type: 'ratio_sharing', topic: 'Ratios', world: 0, difficulty: diff,
    questionText: `${name1} and ${name2} share ${total} ${obj} in the ratio ${ra} : ${rb}.\nHow many ${obj} does ${name1} get?`,
    visual: 'ratio_bar', barA: partA, barB: partB, barLabelA: name1, barLabelB: name2, barMissing: 'A', barTotal: total,
    hint1: `Total parts = ${ra} + ${rb} = ${ra + rb}.`,
    hint2: `One part = ${total} ÷ ${ra + rb} = ${k}. ${name1} gets ${ra} parts.`,
    explanation: `${total} ÷ ${ra + rb} = ${k} per part. ${name1} gets ${ra} × ${k} = ${partA}.`,
    options: buildOptions(partA, numDistractors(partA, 3, Math.max(3, k))),
    correctAnswer: partA,
  };
}

// Q4 — Rate: speed
function genQ4(id, diff) {
  const VEHICLES = ['car 🚗', 'train 🚆', 'cyclist 🚴', 'bus 🚌', 'motorbike 🏍️', 'runner 🏃'];
  const speedOptions = diff === 1 ? [10,20,30,40,50] : diff === 2 ? [15,25,35,45,55,65] : [12,18,24,36,48,72,90,108];
  const speed = pick(speedOptions);
  const time  = diff === 1 ? randInt(1,4) : diff === 2 ? randInt(2,6) : pick([1.5,2,2.5,3,3.5]);
  const distance = +(speed * time).toFixed(1);
  const vehicle = pick(VEHICLES);
  const correct = `${speed} km/h`;
  return {
    id, type: 'rate_speed', topic: 'Rates', world: 0, difficulty: diff,
    questionText: `A ${vehicle} travels ${distance} km in ${time} hour${time === 1 ? '' : 's'}.\nWhat is its speed?`,
    visual: 'sentence',
    hint1: `Speed = Distance ÷ Time.`,
    hint2: `${distance} ÷ ${time} = ?`,
    explanation: `Speed = ${distance} km ÷ ${time} h = ${speed} km/h.`,
    options: buildOptions(correct, numDistractors(speed, 3, 15).map(v => `${v} km/h`)),
    correctAnswer: correct,
  };
}

// Q5 — Rate: unit cost
function genQ5(id, diff) {
  const ITEMS = ['pens', 'apples 🍎', 'oranges 🍊', 'notebooks', 'erasers', 'candies 🍬', 'stickers', 'mangoes 🥭'];
  const unitPrices = diff === 1 ? [1,2,3] : diff === 2 ? [1.5,2,2.5,3,4] : [0.5,1.5,2.5,3.5,4.5];
  const unit = pick(unitPrices);
  const n = diff === 1 ? randInt(2,5) : diff === 2 ? randInt(3,8) : randInt(4,12);
  const m = diff === 1 ? randInt(2,5) : diff === 2 ? randInt(3,10) : randInt(5,15);
  const price = +(unit * n).toFixed(2);
  const correctVal = +(unit * m).toFixed(2);
  const item = pick(ITEMS);
  const correct = `$${correctVal.toFixed(2)}`;
  return {
    id, type: 'rate_unit_cost', topic: 'Rates', world: 0, difficulty: diff,
    questionText: `${n} ${item} cost $${price.toFixed(2)}.\nHow much do ${m} ${item} cost?`,
    visual: 'sentence',
    hint1: `First find the cost of ONE item: $${price.toFixed(2)} ÷ ${n}.`,
    hint2: `One item costs $${unit.toFixed(2)}. Now multiply by ${m}.`,
    explanation: `$${price.toFixed(2)} ÷ ${n} = $${unit.toFixed(2)} per item. $${unit.toFixed(2)} × ${m} = $${correctVal.toFixed(2)}.`,
    options: buildOptions(correct, decimalDistractors(correctVal, 3, unit, 3).map(v => `$${(+v).toFixed(2)}`)),
    correctAnswer: correct,
  };
}

// Q6 — Proportion check (True / False)
function genQ6(id, diff) {
  const maxBase = diff === 1 ? 6 : diff === 2 ? 10 : 14;
  let a = randInt(1, maxBase), b = randInt(1, maxBase);
  while (b === a) b = randInt(1, maxBase);
  const k = diff === 1 ? randInt(2,3) : diff === 2 ? randInt(2,5) : randInt(2,7);
  let c = a * k, d = b * k;
  const isTrue = Math.random() > 0.5;
  if (!isTrue) {
    d = d + (Math.random() > 0.5 ? 1 : -1);
    if (d <= 0) d = b * k + 1;
  }
  const equal = a * d === b * c;
  return {
    id, type: 'proportion_check', topic: 'Proportions', world: 0, difficulty: diff,
    questionText: `Is this a true proportion?\n\n${a} : ${b}   =   ${c} : ${d}`,
    visual: 'proportion', propA: a, propB: b, propC: c, propD: d,
    hint1: `Cross-multiply: compare ${a} × ${d} with ${b} × ${c}.`,
    hint2: `${a} × ${d} = ${a * d}.   ${b} × ${c} = ${b * c}.`,
    explanation: `${a}×${d} = ${a * d} and ${b}×${c} = ${b * c}. ${equal ? 'They are equal — it IS a proportion! ✅' : 'They are different — it is NOT a proportion. ❌'}`,
    options: ['True', 'False'],
    correctAnswer: equal ? 'True' : 'False',
  };
}

// Q7 — Picture ratio
const PICTURE_PAIRS = [
  ['🍎','🍊','apples','oranges'],
  ['🔴','🔵','red counters','blue counters'],
  ['⭐','🌙','stars','moons'],
  ['🐱','🐶','cats','dogs'],
  ['📘','📕','blue books','red books'],
  ['🟢','🟡','green balls','yellow balls'],
];
function genQ7(id, diff) {
  const maxN = diff === 1 ? 6 : diff === 2 ? 9 : 12;
  let x = randInt(2, maxN), y = randInt(2, maxN);
  while (y === x) y = randInt(2, maxN);
  const [e1, e2, l1, l2] = pick(PICTURE_PAIRS);
  const correct = `${x}:${y}`;
  const candidates = [`${y}:${x}`, `${x + 1}:${y}`, `${x}:${y + 1}`].filter(c => c !== correct);
  return {
    id, type: 'picture_ratio', topic: 'Ratios', world: 0, difficulty: diff,
    questionText: `What is the ratio of ${l1} to ${l2}?`,
    visual: 'picture', pictureA: x, pictureB: y, emojiA: e1, emojiB: e2,
    hint1: `Count the ${e1} first, then count the ${e2}.`,
    hint2: `There are ${x} ${l1} and ${y} ${l2}.`,
    explanation: `${l1} : ${l2} = ${x} : ${y}.`,
    options: buildOptions(correct, candidates),
    correctAnswer: correct,
  };
}

// Q8 — Cross-multiplication: find x
function genQ8(id, diff) {
  const maxBase = diff === 1 ? 5 : diff === 2 ? 8 : 12;
  let a = randInt(2, maxBase), b = randInt(2, maxBase);
  while (b === a) b = randInt(2, maxBase);
  const m = diff === 1 ? randInt(2,4) : diff === 2 ? randInt(2,6) : randInt(2,9);
  const d = b * m;
  const correct = a * m;
  return {
    id, type: 'cross_multiply', topic: 'Proportions', world: 0, difficulty: diff,
    questionText: `If  ${a} : ${b}  =  x : ${d},\nwhat is the value of x?`,
    visual: 'proportion', propA: a, propB: b, propC: 'x', propD: d,
    hint1: `Cross-multiply: ${b} × x = ${a} × ${d}.`,
    hint2: `${a} × ${d} = ${a * d}. Now divide by ${b}.`,
    explanation: `${b} × x = ${a} × ${d} = ${a * d}. So x = ${a * d} ÷ ${b} = ${correct}.`,
    options: buildOptions(correct, numDistractors(correct, 3, 5)),
    correctAnswer: correct,
  };
}

// Q9 — Percentage of a total
const PCT_ACTIVITIES = ['play chess ♟️','like maths ➗','wear glasses 👓','walk to school 🚶','have a pet 🐾','play music 🎵','ride a bicycle 🚲','enjoy reading 📚'];
function genQ9(id, diff) {
  const totalsBy = {
    1: [20,40,60,80,100],
    2: [20,40,60,80,100,120,200],
    3: [20,25,40,50,80,100,200,400],
  };
  const pctsBy = {
    1: [10,20,25,50],
    2: [10,15,20,25,30,40,60,75],
    3: [15,35,45,65,85,12,8],
  };
  let pct = pick(pctsBy[diff]);
  let total = pick(totalsBy[diff]);
  let tries = 0;
  while ((total * pct) % 100 !== 0 && tries < 12) {
    pct = pick(pctsBy[diff]);
    total = pick(totalsBy[diff]);
    tries++;
  }
  if ((total * pct) % 100 !== 0) { pct = pick(pctsBy[diff]); total = 100; }
  const correct = (total * pct) / 100;
  const activity = pick(PCT_ACTIVITIES);
  return {
    id, type: 'percentage_of', topic: 'Percentages', world: 0, difficulty: diff,
    questionText: `${pct}% of ${total} students ${activity}.\nHow many students is that?`,
    visual: 'sentence',
    hint1: `${pct}% means ${pct} out of every 100.`,
    hint2: `${pct} ÷ 100 × ${total} = ?`,
    explanation: `${pct}% of ${total} = (${pct} ÷ 100) × ${total} = ${correct}.`,
    options: buildOptions(correct, numDistractors(correct, 3, Math.max(3, Math.round(correct * 0.3)))),
    correctAnswer: correct,
  };
}

// Q10 — Map scale
function genQ10(id, diff) {
  const scaleOptions = diff === 1 ? [100, 1000] : diff === 2 ? [1000, 5000, 10000] : [10000, 50000, 100000];
  const scale = pick(scaleOptions);
  const mapDist = diff === 1 ? randInt(2,8) : diff === 2 ? randInt(2,10) : randInt(2,12);
  const actualCm = mapDist * scale;
  let value, unit;
  if (actualCm >= 100000) { value = actualCm / 100000; unit = 'km'; }
  else if (actualCm >= 100) { value = actualCm / 100; unit = 'm'; }
  else { value = actualCm; unit = 'cm'; }
  value = +value.toFixed(2);
  const correct = `${value} ${unit}`;
  const distractorVals = Number.isInteger(value)
    ? numDistractors(value, 3, Math.max(2, Math.round(value * 0.5)))
    : decimalDistractors(value, 3, 0.5, 3);
  return {
    id, type: 'map_scale', topic: 'Proportions', world: 0, difficulty: diff,
    questionText: `A map has a scale of 1 : ${scale}.\nTwo schools are ${mapDist} cm apart on the map.\nWhat is the actual distance between them?`,
    visual: 'sentence',
    hint1: `Real distance = map distance × scale.`,
    hint2: `${mapDist} × ${scale} = ${actualCm} cm. Now convert to ${unit}.`,
    explanation: `${mapDist} cm × ${scale} = ${actualCm} cm = ${correct}.`,
    options: buildOptions(correct, distractorVals.map(v => `${v} ${unit}`)),
    correctAnswer: correct,
  };
}

// ════════════════════════════════════════════════════════════════
// SESSION GENERATION — 100 questions, 10 worlds × 10 questions
// ════════════════════════════════════════════════════════════════
const generators = [genQ1, genQ2, genQ3, genQ4, genQ5, genQ6, genQ7, genQ8, genQ9, genQ10];

// 10 difficulty entries per type → 100 total
const diffDist = [
  [1,1,1,2,2,2,2,3,3,3], // Q1  simplify_ratio
  [1,1,1,1,2,2,2,3,3,3], // Q2  equivalent_ratio
  [1,1,2,2,2,2,3,3,3,3], // Q3  ratio_sharing
  [1,1,1,2,2,2,3,3,3,3], // Q4  rate_speed
  [1,1,1,1,2,2,2,2,3,3], // Q5  rate_unit_cost
  [1,1,1,2,2,2,2,3,3,3], // Q6  proportion_check
  [1,1,1,1,1,2,2,2,3,3], // Q7  picture_ratio
  [1,1,2,2,2,3,3,3,3,3], // Q8  cross_multiply
  [1,1,1,2,2,2,2,3,3,3], // Q9  percentage_of
  [1,1,1,2,2,2,3,3,3,3], // Q10 map_scale
];

export function generateSessionQuestions() {
  const bank = [];
  let qid = 1;
  generators.forEach((gen, gi) => {
    diffDist[gi].forEach(diff => {
      bank.push(gen(`Q${gi + 1}_${String(qid).padStart(3, '0')}`, diff));
      qid++;
    });
  });
  const selected = shuffleArray(bank);
  selected.forEach((q, i) => { q.world = Math.floor(i / 10); });
  return selected;
}

// ── 10 worlds for the Play map ──────────────────────────────────
export const WORLDS = [
  { id: 0, name: 'Spice Bazaar',     icon: '🌶️', color: '#ff6b35', desc: 'Questions 1–10'   },
  { id: 1, name: 'Rate Speedway',    icon: '🚗', color: '#3b82f6', desc: 'Questions 11–20'  },
  { id: 2, name: 'Proportion Palace',icon: '⚖️', color: '#8b5cf6', desc: 'Questions 21–30'  },
  { id: 3, name: 'Percent Peaks',    icon: '⛰️', color: '#f59e0b', desc: 'Questions 31–40'  },
  { id: 4, name: 'Map Quest Isles',  icon: '🗺️', color: '#14b8a6', desc: 'Questions 41–50'  },
  { id: 5, name: 'Recipe Kitchen',   icon: '🍳', color: '#ec4899', desc: 'Questions 51–60'  },
  { id: 6, name: 'Sports Arena',     icon: '🏟️', color: '#ef4444', desc: 'Questions 61–70'  },
  { id: 7, name: 'Money Market',     icon: '💰', color: '#eab308', desc: 'Questions 71–80'  },
  { id: 8, name: 'Ratio Galaxy',     icon: '🌌', color: '#6366f1', desc: 'Questions 81–90'  },
  { id: 9, name: "Champion's Cup",   icon: '🏆', color: '#22c55e', desc: 'Questions 91–100' },
];
