/**
 * narration.js
 * Maps application phases to their narration scripts.
 * Uses semantic helpers (say, ask, cheer, emphasize, think, celebrate) to wrap
 * text into styled narration segments matched to ElevenLabs voice settings.
 *
 * CRITICAL: Text here must match 1:1 with audioMap.js keys AND with on-screen
 * UI text to maintain synchronization for young learners.
 */

// ─── Semantic helpers ──────────────────────────────────────────────────────
export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'encouragement' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });

// ─── ElevenLabs voice settings per style ──────────────────────────────────
export const VOICE_SETTINGS = {
  statement:    { stability: 0.65, similarity_boost: 0.80, style: 0.3 },
  question:     { stability: 0.55, similarity_boost: 0.75, style: 0.5 },
  encouragement:{ stability: 0.50, similarity_boost: 0.85, style: 0.6 },
  emphasis:     { stability: 0.75, similarity_boost: 0.90, style: 0.2 },
  thinking:     { stability: 0.70, similarity_boost: 0.78, style: 0.4 },
  celebration:  { stability: 0.45, similarity_boost: 0.85, style: 0.8 },
};

export const VOICE_ID   = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
export const VOICE_MODEL = 'eleven_multilingual_v2';

// ─── WONDER PHASE narrations (per world) ───────────────────────────────────
export function wonderHookNarration(worldId) {
  return {
    1: [
      cheer("Welcome to the Great World Market! Alex and Emma have discovered a secret recipe map — but it's written entirely in ratios. Three parts pepper for every two parts salt. Can you help them decode it?"),
    ],
    2: [
      cheer("At the Speed Speedway, Zara faces a challenger! The rival boasts: I do one hundred twenty metres in six seconds! Zara replies: I do ninety metres in three seconds. But who is actually faster?"),
    ],
    3: [
      cheer("Leo stands at the Gold Exchange vault! A banker offers: Deposit five hundred gold coins at ten percent simple interest per year. Leo asks: how much interest will I earn in two years?"),
    ],
  }[worldId] || [];
}

export function wonderQuestionNarration(worldId) {
  return {
    1: [ask("If we want six bags of salt, how many bags of pepper do we need?")],
    2: [ask("Calculate the unit rate — speed per second. Who is faster?")],
    3: [ask("Calculate the simple interest using I equals P times R times T divided by one hundred.")],
  }[worldId] || [];
}

export function wonderCorrectNarration(worldId) {
  return {
    1: [celebrate("Excellent! Six bags of salt is three times the two-part ratio, so we need three times the three parts of pepper — that's nine bags! You already understand ratios!")],
    2: [celebrate("That's right! Zara's speed is ninety divided by three — thirty metres per second. The rival's speed is one hundred twenty divided by six — only twenty metres per second. Zara wins!")],
    3: [celebrate("Perfect! Ten percent of five hundred is fifty coins per year. Over two years, that's one hundred coins total interest!")],
  }[worldId] || [];
}

export function wonderWrongNarration(worldId) {
  return {
    1: [cheer("Good try! Remember — ratios scale by multiplication. Six divided by two gives us the scale factor of three. Three times three pepper parts gives nine bags!")],
    2: [cheer("Almost! Divide the total distance by the total time. Ninety divided by three is thirty. One hundred twenty divided by six is twenty. Compare those unit rates!")],
    3: [cheer("Close! Use I equals P times R times T divided by one hundred. That is five hundred times ten times two divided by one hundred — one hundred coins!")],
  }[worldId] || [];
}

// ─── STORY PHASE narrations (per world, per frame index) ──────────────────
export const storyNarrations = {
  1: [
    say("Deep within the Great World Market, a legendary challenge has begun! Only those who master the language of ratios may claim the Golden Scale Trophy."),
    say("Alex unrolled the ancient scroll. It was filled with strange symbols — pairs of numbers separated by colons. This must be the ratio code!"),
    say("Emma leaned over. A ratio is just a way of comparing two quantities. Three colon two means for every three of one thing, there are two of another."),
    ask("But Emma — how do we know if two ratios are describing the same relationship? asked Alex, scratching his head."),
    say("Good question! If you multiply or divide both parts by the same number, you get an equivalent ratio. Three colon two is the same as six colon four, or nine colon six!"),
    emphasize("Alex's eyes lit up. So ratios can be simplified — just like fractions! We find the greatest common factor and divide!"),
    celebrate("The spice merchant smiled. You've cracked the first code! Now you may enter the Bazaar. But beware — the next challenge requires comparing rates!"),
  ],
  2: [
    say("The Speed Speedway roared with engines! Zara stepped up to the starting line, eyes fierce. I calculate speed before I race. Knowledge is my real engine."),
    emphasize("A unit rate tells you how much of one thing happens per single unit of another. Like kilometres per hour — distance per one hour."),
    say("Zara challenged her rival. You say one hundred twenty kilometres in six hours. I say ninety kilometres in three hours. Shall we find our unit rates?"),
    say("The rival gulped. One hundred twenty divided by six is twenty kilometres per hour. Zara smiled — ninety divided by three is thirty! I'm fifty percent faster!"),
    emphasize("Two ratios form a proportion when they're equal. Cross-multiply to check — if a times d equals b times c, the ratios are proportional!"),
    celebrate("And that is how Zara won the Speedway — not just with speed, but with mathematics!"),
  ],
  3: [
    say("Leo polished his golden abacus. The Gold Exchange was the most complex district of all — percentages, profit, loss, and the mysterious art of simple interest."),
    emphasize("Percent means per hundred. So forty percent simply means forty out of every hundred. It's a special ratio where the second term is always one hundred!"),
    say("Leo explained profit and loss with a smile. If you buy at a low price and sell higher — that difference over the cost price, expressed as a percentage, is your profit percent."),
    emphasize("And simple interest? Leo tapped the formula on the wall. Interest equals Principal times Rate times Time, all divided by one hundred. Linear. Predictable. Powerful."),
    celebrate("With this knowledge, Leo turned five hundred coins into six hundred in just two years. The merchants of the Gold Exchange bowed in respect."),
  ],
};

// ─── SIMULATE PHASE narrations ────────────────────────────────────────────
export const simulationNarrations = {
  RatioBarBuilder: {
    intro:     say("Welcome to the Ratio Bar Builder! Drag the sliders to adjust the quantities and watch how the ratio changes. Try to find two ratios that look the same!"),
    discovery: celebrate("Amazing! You discovered that three colon two and six colon four look identical when the bars are the same length. They are equivalent ratios — related by a scale factor!"),
  },
  ProportionScale: {
    intro:     say("Now meet the Proportion Scale! Place your ratio tokens on each side and try to balance it. When both sides are equal — you've found a proportion!"),
    discovery: celebrate("Yes! When the scale balances, a times d always equals b times c. That's the cross-multiplication rule for proportions!"),
  },
  RateSpeedway: {
    intro:     say("Welcome to the Rate Speedway! Each car has a distance and a time. Divide to find its unit rate. Then see who wins the race!"),
    discovery: celebrate("Unit rate confirmed! Distance divided by time gives you the rate per single unit. That's how we compare speeds fairly."),
  },
  PercentageCoinVault: {
    intro:     say("This is Leo's Coin Vault! Turn the dial to choose a percentage and watch exactly that many coins flow out of a hundred. Percent means per hundred!"),
    discovery: celebrate("That's it! You can see that forty percent of one hundred is exactly forty coins. The percentage bar makes it visual!"),
  },
  SimpleInterestTimeMachine: {
    intro:     say("Step into the Simple Interest Time Machine! Set the principal, rate, and time — then watch Leo's coins grow year by year. The formula I equals P times R times T over one hundred powers the machine!"),
    discovery: celebrate("Perfect! The coins grow linearly — the same amount each year. That's what makes it simple interest. Now verify your formula result matches the animation!"),
  },
};

// ─── PLAY PHASE narrations ────────────────────────────────────────────────
export function playIntroNarration() {
  return [say("Great work! Now let's practise what you've discovered. Choose a mode to begin!")];
}

export const CORRECT_NARRATIONS = [
  cheer("Excellent answer! You've got it!"),
  cheer("Brilliant reasoning! Keep going!"),
  cheer("That's exactly right! Well done!"),
];

export const WRONG_NARRATIONS = [
  think("Not quite — but you're close! Think about the scale factor."),
  think("Almost! Remember to divide both terms by the same number."),
];

export function bossBattleNarration() {
  return [
    emphasize("The Boss Battle begins! Answer five questions correctly to defeat the Market Boss and claim your trophy!"),
  ];
}

export function bossWinNarration() {
  return [celebrate("You defeated the Boss! The Golden Scale Trophy is yours!")];
}

// ─── REFLECT PHASE narrations ─────────────────────────────────────────────
export function reflectIntroNarration() {
  return [say("Congratulations! You've completed this World! Let's see how well you mastered the concepts.")];
}

export function reflectCompleteNarration() {
  return [celebrate("Your mastery scores are outstanding! You've earned a badge and a printable worksheet. Well done, champion!")];
}
