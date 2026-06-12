// QuestionCard.jsx
// Reusable question display component used across all practice modes.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

/**
 * QuestionCard
 * A polished, reusable multiple-choice question card.
 *
 * Props:
 *   question        {Object}  - question object from questionFactory
 *   answered        {boolean} - whether question has been answered
 *   selected        {string}  - currently selected option value
 *   onAnswer        {fn}      - (option: string) => void
 *   accentColor     {string}  - hex colour for themed accents (optional)
 *   showHint        {boolean} - whether hint is visible
 *   hintText        {string}  - hint to show
 *   questionNumber  {number}  - current question number (for header)
 *   total           {number}  - total questions
 */
export default function QuestionCard({
  question,
  answered = false,
  selected = null,
  onAnswer,
  accentColor = '#0F766E',
  showHint = false,
  hintText = '',
  questionNumber = 1,
  total = 10,
}) {
  if (!question) return null;

  const isCorrect = selected === question.correctAnswer;

  const getOptionClass = (option) => {
    if (!answered) {
      return 'border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary-50/30 cursor-pointer';
    }
    if (option === question.correctAnswer) return 'border-green-400 bg-green-900/30';
    if (option === selected) return 'border-red-400 bg-red-900/30';
    return 'border-white/10 bg-white/5 opacity-40';
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Progress */}
      <div className="flex justify-between items-center text-xs text-muted font-semibold">
        <span className="font-bold uppercase tracking-wider" style={{ color: accentColor }}>
          {question.tag?.replace(/_/g, ' ')}
        </span>
        <span className="bg-white/10 px-2 py-0.5 rounded-full">
          {questionNumber} / {total}
        </span>
      </div>

      {/* Question text */}
      <div
        className="rounded-2xl p-5 border"
        style={{ background: `${accentColor}0D`, borderColor: `${accentColor}22` }}
      >
        <p className="text-white text-base md:text-lg font-semibold leading-relaxed">
          {question.questionText}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options?.map((option, idx) => (
          <motion.button
            key={idx}
            whileHover={!answered ? { scale: 1.02 } : {}}
            whileTap={!answered ? { scale: 0.98 } : {}}
            onClick={() => !answered && onAnswer(option)}
            disabled={answered}
            className={`p-4 text-left border-2 rounded-xl font-medium text-secondary transition-all flex items-center gap-3 ${getOptionClass(option)}`}
          >
            <span
              className="font-extrabold w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm"
              style={{ background: `${accentColor}15`, color: accentColor }}
            >
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="flex-1">{option}</span>
            {answered && option === question.correctAnswer && (
              <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
            )}
            {answered && option === selected && option !== question.correctAnswer && (
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Hint */}
      <AnimatePresence>
        {showHint && hintText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-900/30 p-4 rounded-xl border border-amber-500/40 flex items-start gap-2 overflow-hidden"
          >
            <Lightbulb className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
            <p className="text-amber-200 text-sm font-medium">{hintText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer feedback */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              isCorrect ? 'bg-green-900/30 border-green-500/40' : 'bg-red-900/30 border-red-500/40'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <span className={`font-bold text-sm ${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
              {isCorrect
                ? '✓ Excellent work!'
                : `Correct answer: ${question.correctAnswer}`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
