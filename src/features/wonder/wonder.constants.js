// wonder.constants.js
// Static configuration for the Wonder phase across all three worlds.

export const WORLD_META = {
  1: {
    bg: 'from-orange-900 via-red-800 to-amber-800',
    accent: '#F97316',
    accentLight: '#FFF7ED',
    accentBorder: '#FDBA74',
    icon: '🗺️',
    emojis: ['🌶️', '🧄', '🪔', '⚗️'],
    worldLabel: 'World 1 — Spice Bazaar',
    subtitleColor: 'text-orange-700',
  },
  2: {
    bg: 'from-indigo-900 via-purple-900 to-violet-800',
    accent: '#7C3AED',
    accentLight: '#F5F3FF',
    accentBorder: '#C4B5FD',
    icon: '🏎️',
    emojis: ['⚡', '🏁', '💨', '🔥'],
    worldLabel: 'World 2 — Speed Speedway',
    subtitleColor: 'text-violet-700',
  },
  3: {
    bg: 'from-yellow-900 via-amber-800 to-orange-800',
    accent: '#D97706',
    accentLight: '#FFFBEB',
    accentBorder: '#FCD34D',
    icon: '🏦',
    emojis: ['💰', '🪙', '💎', '📈'],
    worldLabel: 'World 3 — Gold Exchange',
    subtitleColor: 'text-amber-700',
  },
};

export const HOOK_DETAILS = {
  1: {
    title: 'The Treasure Map Mystery',
    text: "Alex and Emma discover a dusty old scroll hidden behind a spice rack. 'It's a secret recipe map — but it's written in ratios! 3 parts pepper for every 2 parts salt. How do we make this?'",
    audio: "Alex and Emma discover a dusty old scroll. It's a secret recipe map written in ratios! Three parts pepper for every two parts salt. How do we make this?",
    question: 'If we want a batch with 6 bags of salt, how many bags of pepper do we need?',
    options: [
      { text: '6 bags of pepper', correct: false, explanation: "That would be a 1:1 ratio. We need 3 parts pepper for every 2 parts salt." },
      { text: '9 bags of pepper', correct: true, explanation: "Correct! 6 bags of salt is 3× the 2-part ratio, so we need 3× the pepper = 9 bags!" },
      { text: '5 bags of pepper', correct: false, explanation: "That just adds 3 and 2! Ratios work by multiplication, not simple addition." },
      { text: '4 bags of pepper', correct: false, explanation: "Too little. The 3:2 ratio means more pepper than salt." },
    ],
  },
  2: {
    title: 'The Speed Challenge',
    text: "Zara is at the Speed Speedway. A rival racer boasts: 'I can do 120 metres in 6 seconds!' Zara turns to Alex. 'I can do 90 metres in 3 seconds! But who is actually faster?'",
    audio: "Zara stands at the Speedway. A rival brags, I can do 120 metres in 6 seconds! Zara says, I can do 90 metres in 3 seconds! But who is actually faster?",
    question: "Calculate the speed per second (unit rate). Who is faster?",
    options: [
      { text: 'The Rival (120 m in 6 s)', correct: false, explanation: "The rival's speed is 120 ÷ 6 = 20 metres per second." },
      { text: 'Zara (90 m in 3 s)', correct: true, explanation: "Correct! Zara's speed is 90 ÷ 3 = 30 m/s — faster than the rival's 20 m/s!" },
      { text: 'They are the same speed', correct: false, explanation: "Rival = 20 m/s, Zara = 30 m/s. They are not equal!" },
      { text: 'Not enough information', correct: false, explanation: "We can divide distance by time to find each unit rate." },
    ],
  },
  3: {
    title: 'The Gold Exchange Opportunity',
    text: "Leo stands before the vault. A banker offers: 'Deposit your 500 gold coins at 10% simple interest per year!' Leo wonders: 'How much interest will I earn in 2 years?'",
    audio: "Leo stands before the Gold Exchange vault. The banker offers: Deposit 500 coins at 10% simple interest per year. Leo wonders: How much interest in 2 years?",
    question: "Calculate the simple interest earned (I = P × R × T ÷ 100).",
    options: [
      { text: '50 coins', correct: false, explanation: "That's just 1 year of interest (10% of 500 = 50). Multiply by time!" },
      { text: '100 coins', correct: true, explanation: "Correct! 10% of 500 = 50 coins/year. Over 2 years: 50 × 2 = 100 coins!" },
      { text: '150 coins', correct: false, explanation: "That would be 3 years, not 2." },
      { text: '550 coins', correct: false, explanation: "That's the total amount (deposit + interest), not just the interest earned." },
    ],
  },
};
