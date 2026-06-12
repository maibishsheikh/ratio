// worlds.config.js
// World metadata for the Great World Market story

export const WORLDS = [
  {
    id: 1,
    name: 'Spice Bazaar',
    emoji: '🌶️',
    description: 'Alex and Emma discover a dusty scroll written in ratios. Help decode the secret spice recipe!',
    color: '#E8420C',
    colorLight: '#FFF5F0',
    colorBorder: '#FED7CC',
    bgGradient: 'from-orange-100 to-red-100',
    concepts: ['RATIO_DEFINITION', 'RATIO_SIMPLIFY', 'EQUIVALENT_RATIO'],
    characters: ['Alex', 'Emma'],
    bossName: 'Merchant Mrak',
    bossEmoji: '👹',
    unlockXP: 0,
  },
  {
    id: 2,
    name: 'Speed Speedway',
    emoji: '🏎️',
    description: 'Zara challenges a rival racer. Calculate unit rates to determine who is truly the fastest!',
    color: '#6D28D9',
    colorLight: '#F5F3FF',
    colorBorder: '#DDD6FE',
    bgGradient: 'from-violet-100 to-purple-100',
    concepts: ['UNIT_RATE', 'RATE_COMPARISON', 'PROPORTION_CHECK'],
    characters: ['Zara', 'Alex'],
    bossName: 'Speed Baron',
    bossEmoji: '🏁',
    unlockXP: 200,
  },
  {
    id: 3,
    name: 'Gold Exchange',
    emoji: '💰',
    description: 'Leo needs to invest wisely. Master percentages and simple interest to maximize returns!',
    color: '#B45309',
    colorLight: '#FFFBEB',
    colorBorder: '#FDE68A',
    bgGradient: 'from-yellow-100 to-amber-100',
    concepts: ['PERCENT_OF', 'PERCENT_CHANGE', 'PROFIT_LOSS_DISCOUNT', 'SIMPLE_INTEREST'],
    characters: ['Leo', 'Zara'],
    bossName: 'Gold Tyrant',
    bossEmoji: '💀',
    unlockXP: 500,
  },
];

export const getWorld = (id) => WORLDS.find(w => w.id === id) || WORLDS[0];
