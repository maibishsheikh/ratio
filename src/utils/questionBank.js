/**
 * Question Bank — generates all 100 questions for IntelliPlay™
 * 10 types × 10 questions = 100 total, assigned to 10 worlds
 */

// ─── Data pools ───────────────────────────────────────────────────────────────
const englishNames = ['Emma','Oliver','Jack','Lily','Max','Sophie','Tom','Grace','Liam','Ella','Noah','Zoe'];
const femaleNames  = ['Emma','Lily','Sophie','Grace','Ella','Zoe'];
const objects      = ['pencil','ribbon','rope','stick','worm','string','crayon','straw'];
const shortObjects = ['pencil','eraser','crayon','worm','straw','finger','ruler'];
const longObjects  = ['corridor','swimming pool','garden','football field','classroom','fence'];

// ─── Utilities ────────────────────────────────────────────────────────────────
function pick(arr)   { return arr[Math.floor(Math.random() * arr.length)]; }
function pronoun(n)  { return femaleNames.includes(n) ? 'her' : 'his'; }

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateDistractors(correct, unit, count = 3) {
  const offsets = unit === 'm'
    ? [1, -1, 2, -2, 3, -3]
    : [3, -3, 5, -5, 2, -2, 7, -7, 4, -4];
  const distractors = new Set();
  for (let i = 0; i < offsets.length && distractors.size < count; i++) {
    const d = correct + offsets[i];
    if (d > 0 && d !== correct) distractors.add(d);
  }
  // Fallback
  for (const d of [correct + 1, correct - 1, correct + 2, correct + 10]) {
    if (d > 0 && d !== correct && distractors.size < count) distractors.add(d);
  }
  return shuffleArray([correct, ...[...distractors].slice(0, count)]);
}

function genCmLength(diff) {
  if (diff === 1) return Math.floor(Math.random() * 22) + 5;    // 5–26
  if (diff === 2) return Math.floor(Math.random() * 61) + 15;   // 15–75
  return   Math.floor(Math.random() * 51) + 30;                 // 30–80
}

function genMLength(diff) {
  if (diff === 1) return Math.floor(Math.random() * 4) + 1;     // 1–4
  if (diff === 2) return Math.floor(Math.random() * 5) + 3;     // 3–7
  return   Math.floor(Math.random() * 5) + 5;                   // 5–9
}

// ─── Q1: Ruler Reading ────────────────────────────────────────────────────────
function genQ1(id, diff) {
  const pools = {
    1: [5,8,10,12,14,15,18,20],
    2: [10,12,14,15,17,19,21,23,25,27],
    3: [16,18,20,22,24,26,28,30],
  };
  const lengthA  = pick(pools[diff] || pools[2]);
  const emojiSet = ['✏️','🖍️','🌿','🥢','🎀'];
  const emoji    = pick(emojiSet);
  return {
    id, type: 'ruler_reading', difficulty: diff,
    lengthA, unit: 'cm', answer: lengthA,
    questionText: `The ${emoji} starts at zero on the ruler. Where does it end?`,
    visual: 'ruler',
    options: generateDistractors(lengthA, 'cm'),
    hint1: 'Count each mark from zero. Each mark is 1 centimetre!',
    hint2: `The number the ${emoji} tip touches is the length.`,
    explanation: `The object ends at ${lengthA}. So the length is ${lengthA} cm.`,
    emojiChar: emoji,
  };
}

// ─── Q2: Fill Addition ────────────────────────────────────────────────────────
function genQ2(id, diff) {
  const a   = genCmLength(diff);
  const b   = Math.floor(Math.random() * (diff === 1 ? 8 : diff === 2 ? 18 : 28)) + 3;
  const sum = a + b;
  const missingSlot = Math.random() > 0.5 ? 'sum' : 'addend';
  const answer      = missingSlot === 'sum' ? sum : b;
  const questionText= missingSlot === 'sum'
    ? `${a} cm + ${b} cm = ___ cm`
    : `${a} cm + ___ cm = ${sum} cm`;
  return {
    id, type: 'fill_addition', difficulty: diff,
    lengthA: a, lengthB: b, unit: 'cm', answer,
    questionText, visual: 'sentence',
    options: generateDistractors(answer, 'cm'),
    hint1: `Add the two lengths: ${a} + ${b} = ?`,
    hint2: `Count on from ${a}: add ${b} more.`,
    explanation: `${a} cm + ${b} cm = ${sum} cm.`,
  };
}

// ─── Q3: Fill Subtraction ─────────────────────────────────────────────────────
function genQ3(id, diff) {
  const total = genCmLength(diff) + 5;
  const part  = Math.floor(Math.random() * (total - 4)) + 2;
  const diff_ = total - part;
  const missingSlot = Math.random() > 0.5 ? 'diff' : 'part';
  const answer      = missingSlot === 'diff' ? diff_ : part;
  const questionText= missingSlot === 'diff'
    ? `${total} cm – ${part} cm = ___ cm`
    : `${total} cm – ___ cm = ${diff_} cm`;
  return {
    id, type: 'fill_subtraction', difficulty: diff,
    lengthA: total, lengthB: part, unit: 'cm', answer,
    questionText, visual: 'sentence',
    options: generateDistractors(answer, 'cm'),
    hint1: `Take away the shorter length from the longer one!`,
    hint2: `Count back from ${total}: subtract ${part}.`,
    explanation: `${total} cm – ${part} cm = ${diff_} cm.`,
  };
}

// ─── Q4: Word Problem Addition ────────────────────────────────────────────────
function genQ4(id, diff) {
  const name1 = pick(englishNames);
  const name2 = pick(englishNames.filter(n => n !== name1));
  const obj   = pick(objects);
  const a     = genCmLength(diff);
  const b     = genCmLength(diff);
  const sum   = a + b;
  return {
    id, type: 'word_addition', difficulty: diff,
    lengthA: a, lengthB: b, unit: 'cm', answer: sum,
    questionText: `${name1}'s ${obj} is ${a} cm long. ${name2}'s ${obj} is ${b} cm long. How long are the two ${obj}s altogether?`,
    visual: 'bar_model',
    characterName: name1, objectName: obj,
    options: generateDistractors(sum, 'cm'),
    hint1: `Draw a bar model. Put ${a} in one part and ${b} in the other.`,
    hint2: `Add the two lengths: ${a} cm + ${b} cm = ?`,
    explanation: `${a} cm + ${b} cm = ${sum} cm. The two ${obj}s are ${sum} cm altogether.`,
  };
}

// ─── Q5: Word Problem Subtraction ─────────────────────────────────────────────
function genQ5(id, diff) {
  const name  = pick(englishNames);
  const obj   = pick(objects);
  const total = genCmLength(diff) + 8;
  const cut   = Math.floor(Math.random() * Math.max(4, Math.floor(total * 0.5))) + 2;
  const rem   = total - cut;
  return {
    id, type: 'word_subtraction', difficulty: diff,
    lengthA: total, lengthB: cut, unit: 'cm', answer: rem,
    questionText: `${name} has a ${obj} that is ${total} cm long. ${name} cuts off ${cut} cm. How long is the ${obj} now?`,
    visual: 'bar_model',
    characterName: name, objectName: obj,
    options: generateDistractors(rem, 'cm'),
    hint1: `Start with ${total} cm. Take away ${cut} cm.`,
    hint2: `${total} cm – ${cut} cm = ?`,
    explanation: `${total} cm – ${cut} cm = ${rem} cm. The ${obj} is now ${rem} cm long.`,
  };
}

// ─── Q6: Comparison ───────────────────────────────────────────────────────────
function genQ6(id, diff) {
  const name1 = pick(englishNames);
  const name2 = pick(englishNames.filter(n => n !== name1));
  const obj   = pick(objects);
  let a, b;
  do { a = genCmLength(diff); b = genCmLength(diff); } while (a === b);
  const askLonger = Math.random() > 0.5;
  const correct   = askLonger ? (a > b ? name1 : name2) : (a < b ? name1 : name2);
  return {
    id, type: 'comparison', difficulty: diff,
    lengthA: a, lengthB: b, unit: 'cm', answer: correct,
    questionText: `${name1}'s ${obj} is ${a} cm. ${name2}'s ${obj} is ${b} cm. Whose ${obj} is ${askLonger ? 'longer' : 'shorter'}?`,
    visual: 'length_bars',
    comparisonData: { name1, name2, lenA: a, lenB: b, askLonger },
    options: shuffleArray([name1, name2]),
    hint1: `Look at the numbers: ${a} cm and ${b} cm.`,
    hint2: `The ${askLonger ? 'longer' : 'shorter'} one has the ${askLonger ? 'bigger' : 'smaller'} number!`,
    explanation: `${correct}'s ${obj} is ${askLonger ? Math.max(a,b) : Math.min(a,b)} cm — that is ${askLonger ? 'longer' : 'shorter'}.`,
  };
}

// ─── Q7: Ordering ─────────────────────────────────────────────────────────────
function genQ7(id, diff) {
  const pool = [
    { name: 'pencil', emoji: '✏️' },
    { name: 'ribbon', emoji: '🎀' },
    { name: 'straw',  emoji: '🥤' },
    { name: 'stick',  emoji: '🪵' },
    { name: 'worm',   emoji: '🪱' },
    { name: 'crayon', emoji: '🖍️' },
  ];
  const selected = shuffleArray(pool).slice(0, 3);
  let lengths;
  do {
    lengths = selected.map(() => genCmLength(diff));
  } while (new Set(lengths).size < 3);
  selected.forEach((o, i) => { o.length = lengths[i]; });

  const sorted      = [...selected].sort((a, b) => a.length - b.length);
  const correctOrder= sorted.map(o => o.name).join(' → ');

  const wrongOrders = [
    [sorted[0], sorted[2], sorted[1]].map(o => o.name).join(' → '),
    [sorted[1], sorted[0], sorted[2]].map(o => o.name).join(' → '),
    [sorted[2], sorted[0], sorted[1]].map(o => o.name).join(' → '),
  ];

  return {
    id, type: 'ordering', difficulty: diff,
    unit: 'cm', answer: correctOrder,
    questionText: 'Order these objects from shortest to longest!',
    visual: 'length_bars',
    orderingData: selected,
    options: shuffleArray([correctOrder, ...wrongOrders]),
    hint1: 'Find the smallest number first — that is the shortest!',
    hint2: sorted.map(o => `${o.name}: ${o.length} cm`).join(' → '),
    explanation: `Shortest to longest: ${sorted.map(o => `${o.name} (${o.length} cm)`).join(' → ')}.`,
  };
}

// ─── Q8: Unit Selection ───────────────────────────────────────────────────────
const unitPool = {
  cm: [
    { obj: 'a pencil',  ref: 'about 15 cm' },
    { obj: 'an eraser', ref: 'about 4 cm' },
    { obj: 'a crayon',  ref: 'about 10 cm' },
    { obj: 'a worm',    ref: 'about 5 cm' },
    { obj: 'a finger',  ref: 'about 6 cm' },
  ],
  m: [
    { obj: 'a classroom door',  ref: 'about 2 m' },
    { obj: 'a swimming pool',   ref: 'about 25 m' },
    { obj: 'a car',             ref: 'about 4 m' },
    { obj: 'a football field',  ref: 'about 100 m' },
    { obj: 'a school corridor', ref: 'about 20 m' },
  ],
};

function genQ8(id, diff) {
  const pool = diff <= 2
    ? [...unitPool.cm, ...unitPool.m]
    : [...unitPool.m];
  const item   = pick(pool);
  const correct= unitPool.cm.find(i => i.obj === item.obj) ? 'cm' : 'm';
  const options = diff === 3
    ? shuffleArray(['cm', 'm', 'kg', 'l'])
    : ['cm', 'm'];
  return {
    id, type: 'unit_selection', difficulty: diff,
    unit: correct, answer: correct,
    questionText: `Which unit should we use to measure ${item.obj}?`,
    visual: 'unit_chart',
    options,
    hint1: `Is it shorter than 1 metre (100 cm) or much longer?`,
    hint2: `${item.obj} is ${item.ref}. Is that closer to cm or m?`,
    explanation: `We use ${correct} for ${item.obj} — it is ${item.ref}.`,
  };
}

// ─── Q9: Conversion ───────────────────────────────────────────────────────────
function genQ9(id, diff) {
  if (diff === 1) {
    const m  = Math.floor(Math.random() * 4) + 1;
    const cm = m * 100;
    return {
      id, type: 'conversion', difficulty: diff,
      lengthA: m, unit: 'm', answer: cm,
      questionText: `${m} m = ___ cm`,
      visual: 'unit_chart',
      options: generateDistractors(cm, 'cm'),
      hint1: `100 centimetres make 1 metre! Multiply ${m} × 100.`,
      hint2: `1 m = 100 cm. So ${m} m = ${m} × 100 = ?`,
      explanation: `${m} m = ${cm} cm, because 1 m = 100 cm and ${m} × 100 = ${cm}.`,
    };
  }
  if (diff === 2) {
    const m  = Math.floor(Math.random() * 5) + 2;
    const cm = m * 100;
    return {
      id, type: 'conversion', difficulty: diff,
      lengthA: cm, unit: 'cm', answer: m,
      questionText: `${cm} cm = ___ m`,
      visual: 'unit_chart',
      options: generateDistractors(m, 'm'),
      hint1: `100 centimetres make 1 metre. How many 100s are in ${cm}?`,
      hint2: `Count in 100s: 100, 200… How many groups of 100 in ${cm}?`,
      explanation: `${cm} cm = ${m} m, because ${cm} ÷ 100 = ${m}.`,
    };
  }
  // diff === 3: mixed
  const m    = Math.floor(Math.random() * 3) + 1;
  const extra= [10,20,25,30,40,50][Math.floor(Math.random() * 6)];
  const total= m * 100 + extra;
  const ans  = `${m} m ${extra} cm`;
  const wrong= [
    `${m+1} m ${extra} cm`,
    `${m} m ${extra + 10} cm`,
    `${m > 1 ? m-1 : m} m ${extra + 20} cm`,
  ].filter(o => o !== ans);
  return {
    id, type: 'conversion', difficulty: diff,
    lengthA: total, unit: 'cm', answer: ans,
    questionText: `${total} cm = ___ m and ___ cm`,
    visual: 'unit_chart',
    options: shuffleArray([ans, ...wrong.slice(0, 3)]),
    hint1: `How many groups of 100 are in ${total}? That gives the metres!`,
    hint2: `${m} × 100 = ${m * 100}. What is left? ${total} − ${m * 100} = ${extra} cm.`,
    explanation: `${total} cm = ${m} m and ${extra} cm (${m} × 100 = ${m * 100}, remainder = ${extra}).`,
  };
}

// ─── Q10: True/False ──────────────────────────────────────────────────────────
const tfData = [
  { stmt: 'A pencil is about 15 cm long.',            answer: 'True'  },
  { stmt: 'A classroom door is about 2 m tall.',      answer: 'True'  },
  { stmt: 'A worm is about 5 m long.',                answer: 'False' },
  { stmt: 'A swimming pool is about 25 m long.',      answer: 'True'  },
  { stmt: 'A school corridor is about 50 cm long.',   answer: 'False' },
  { stmt: 'An eraser is about 4 m long.',             answer: 'False' },
  { stmt: 'A car is about 4 m long.',                 answer: 'True'  },
  { stmt: '1 metre equals 100 centimetres.',          answer: 'True'  },
  { stmt: 'A crayon is about 10 m long.',             answer: 'False' },
  { stmt: 'A football field is about 100 m long.',    answer: 'True'  },
];

function genQ10(id, diff) {
  const item = pick(tfData);
  return {
    id, type: 'true_false', difficulty: diff,
    unit: 'cm', answer: item.answer,
    questionText: `True or False? "${item.stmt}"`,
    visual: 'true_false',
    options: ['True', 'False'],
    hint1: 'Think about this object in real life. How long is it really?',
    hint2: 'Use what you know: cm for short things, m for long things!',
    explanation: `${item.answer}! ${item.stmt}`,
  };
}

// ─── Difficulty distribution (10 per type) ────────────────────────────────────
const diffDist = {
  q1:  [1,1,1,1,1,2,2,2,3,3],
  q2:  [1,1,1,1,2,2,2,2,3,3],
  q3:  [1,1,1,1,2,2,2,2,3,3],
  q4:  [1,1,1,2,2,2,2,3,3,3],
  q5:  [1,1,1,2,2,2,2,3,3,3],
  q6:  [1,1,1,1,1,2,2,2,3,3],
  q7:  [1,1,1,1,2,2,2,2,3,3],
  q8:  [1,1,1,1,1,2,2,2,3,3],
  q9:  [1,1,1,2,2,2,2,3,3,3],
  q10: [1,1,1,1,2,2,2,2,3,3],
};

const generators = [genQ1, genQ2, genQ3, genQ4, genQ5, genQ6, genQ7, genQ8, genQ9, genQ10];
const keys       = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10'];

// ─── Public: generate 100 questions for a session ─────────────────────────────
export function generateSessionQuestions() {
  const bank = [];
  let qid = 1;

  generators.forEach((gen, gi) => {
    diffDist[keys[gi]].forEach(diff => {
      bank.push(gen(`Q${gi + 1}_${String(qid).padStart(3, '0')}`, diff));
      qid++;
    });
  });

  const shuffled = shuffleArray(bank);
  shuffled.forEach((q, index) => {
    q.world = Math.floor(index / 10);
  });

  return shuffled;
}
