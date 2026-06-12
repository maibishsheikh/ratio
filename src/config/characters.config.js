// characters.config.js
// Character data for the four heroes of the Great World Market

export const CHARACTERS = {
  Alex: {
    name: 'Alex',
    origin: 'Singapore',
    personality: 'Curious, analytical',
    role: 'The Strategist',
    description: 'Explains ratio tables and proportions',
    color: '#0F766E', // teal
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
    emoji: '🧮',
    avatar: '👦🏻',
    voiceId: 'Charlie', // ElevenLabs voice
    worlds: [1, 2],
  },
  Emma: {
    name: 'Emma',
    origin: 'USA',
    personality: 'Creative, visual thinker',
    role: 'The Artist',
    description: 'Introduces visual ratio bars and scaling',
    color: '#DB2777', // pink
    bgColor: '#FDF2F8',
    borderColor: '#F9A8D4',
    emoji: '🎨',
    avatar: '👧🏼',
    voiceId: 'Aria',
    worlds: [1],
  },
  Zara: {
    name: 'Zara',
    origin: 'UK',
    personality: 'Confident, competitive',
    role: 'The Trader',
    description: 'Handles unit rates and comparison problems',
    color: '#7C3AED', // violet
    bgColor: '#F5F3FF',
    borderColor: '#C4B5FD',
    emoji: '⚡',
    avatar: '👧🏽',
    voiceId: 'Laura',
    worlds: [2, 3],
  },
  Leo: {
    name: 'Leo',
    origin: 'India',
    personality: 'Warm, maths-enthusiast',
    role: 'The Banker',
    description: 'Teaches percentages and simple interest',
    color: '#B45309', // amber
    bgColor: '#FFFBEB',
    borderColor: '#FCD34D',
    emoji: '💰',
    avatar: '👦🏾',
    voiceId: 'George',
    worlds: [3],
  },
  Narrator: {
    name: 'Narrator',
    origin: '',
    personality: '',
    role: 'Scene Guide',
    description: 'Sets scenes and gives instructions',
    color: '#374151',
    bgColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    emoji: '📖',
    avatar: '🎙️',
    voiceId: 'Alice',
    worlds: [1, 2, 3],
  },
};

export const getCharacter = (name) => CHARACTERS[name] || CHARACTERS.Narrator;
