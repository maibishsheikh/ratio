// distractorEngine.js
// Generates plausible wrong answer options (distractors) based on common student errors.

export const distractorEngine = {
  generate: (question) => {
    const { tag, correctAnswer, data } = question;
    const distractors = new Set();
    
    const ansNum = parseFloat(correctAnswer);
    const hasNumericAns = !isNaN(ansNum);

    // Apply specific error patterns based on concept tag
    if (tag === 'RATIO_DEFINITION' || tag === 'RATIO_SIMPLIFY') {
      const format = data.format || 'colon';
      if (format === 'colon' && correctAnswer.includes(':')) {
        const [a, b] = correctAnswer.split(':').map(Number);
        
        // Error 1: Reversed ratio
        distractors.add(`${b}:${a}`);
        
        // Error 2: Addition instead of comparison (ratio of a to total or total to b)
        distractors.add(`${a}:${a + b}`);
        distractors.add(`${b}:${a + b}`);
        
        // Error 3: Simple off-by-one errors on terms
        distractors.add(`${Math.max(1, a - 1)}:${b}`);
        distractors.add(`${a}:${Math.max(1, b - 1)}`);
        distractors.add(`${a + 1}:${b}`);
        distractors.add(`${a}:${b + 1}`);
      }
    } 
    else if (tag === 'EQUIVALENT_RATIO') {
      if (hasNumericAns) {
        // Find missing value: valA1:valB1 = valA2:? -> ans is valB2
        const ans = ansNum;
        
        // Error 1: Add difference instead of scale factor
        // e.g. 3:5 = 6:? -> Student says 8 (adds 3) instead of 10
        if (data.valA1 && data.valA2 && data.valB1) {
          const diff = data.valA2 - data.valA1;
          distractors.add((data.valB1 + diff).toString());
        }

        // Error 2: Off-by-one
        distractors.add((ans + 1).toString());
        distractors.add(Math.max(1, ans - 1).toString());

        // Error 3: Simple math multiplication slip
        distractors.add((ans + 2).toString());
        distractors.add(Math.max(1, ans - 2).toString());
      }
    }
    else if (tag === 'UNIT_RATE') {
      if (hasNumericAns) {
        const ans = ansNum;
        
        // Error 1: Undivided value (just the numerator)
        if (data.numerator) {
          distractors.add(data.numerator.toString());
        }
        
        // Error 2: Inverse rate (denominator / numerator)
        if (data.numerator && data.denominator) {
          const inv = data.denominator / data.numerator;
          if (inv !== ans) {
            distractors.add(inv.toFixed(2));
          }
        }
        
        // Error 3: Basic calculation drift (+/- 1, +/- 5)
        distractors.add((ans + 1).toString());
        distractors.add(Math.max(1, ans - 1).toString());
        distractors.add((ans + 2).toString());
      }
    }
    else if (tag === 'RATE_COMPARISON') {
      // Multiple choices: Options are usually "Vendor A", "Vendor B", etc.
      // Choices are generated in the generator itself, no distractor mapping needed.
    }
    else if (tag === 'PROPORTION_CHECK') {
      if (data.format === 'yes_no') {
        // Already yes/no options, no other distractors needed
      } else if (hasNumericAns) {
        // e.g., solve for x
        const ans = ansNum;
        
        // Error 1: Add instead of multiply/divide
        // e.g., 3/4 = 15/x -> Student adds 12 to 4 to get 16
        if (data.baseA && data.baseB && data.valA) {
          const diff = data.valA - data.baseA;
          distractors.add((data.baseB + diff).toString());
        }
        
        // Error 2: Multiply numerator by denominator
        distractors.add((data.baseA * data.baseB).toString());

        // Error 3: Off-by-one or off-by-two
        distractors.add((ans + 1).toString());
        distractors.add(Math.max(1, ans - 1).toString());
      }
    }
    else if (tag === 'PERCENT_OF') {
      if (hasNumericAns) {
        const ans = ansNum;
        
        // Error 1: Undivided (pct * total)
        if (data.pct && data.total) {
          distractors.add((data.pct * data.total).toString());
        }
        
        // Error 2: Just the percentage value itself
        if (data.pct) {
          distractors.add(data.pct.toString());
        }

        // Error 3: Off-by-ten or arithmetic slips
        distractors.add((ans + 10).toString());
        distractors.add(Math.max(1, ans - 5).toString());
        distractors.add((ans + 5).toString());
      }
    }
    else if (tag === 'PERCENT_CHANGE') {
      if (hasNumericAns) {
        const ans = ansNum;
        
        // Error 1: Subtract values but forget to divide by base
        if (data.base && data.endVal) {
          distractors.add(Math.abs(data.endVal - data.base).toString());
        }
        
        // Error 2: Divide by the ending value instead of base
        if (data.base && data.endVal) {
          const wrongPct = Math.round((Math.abs(data.endVal - data.base) / data.endVal) * 100);
          distractors.add(wrongPct.toString());
        }
        
        // Error 3: Off-by-ten or half values
        distractors.add((ans + 10).toString());
        distractors.add(Math.max(5, ans - 10).toString());
      }
    }
    else if (tag === 'PROFIT_LOSS_DISCOUNT') {
      if (hasNumericAns) {
        const ans = ansNum;
        
        // Error 1: The discount amount itself (forgetting to subtract from price)
        if (data.discountVal) {
          distractors.add(data.discountVal.toString());
        }
        
        // Error 2: Adding the discount instead of subtracting
        if (data.price && data.discountVal) {
          distractors.add((data.price + data.discountVal).toString());
        }
        
        // Error 3: Off-by-ten
        distractors.add((ans + 10).toString());
        distractors.add(Math.max(1, ans - 10).toString());
      }
    }
    else if (tag === 'SIMPLE_INTEREST') {
      if (hasNumericAns) {
        const ans = ansNum;
        
        // Error 1: Interest calculation missing T (PR/100)
        if (data.qType === 'FIND_I') {
          const pr = (data.P * data.R) / 100;
          distractors.add(pr.toString());
          
          // Error 2: Accumulate principal + interest (total sum instead of interest)
          distractors.add(data.totalAmount.toString());
          
          // Error 3: Missing division by 100 (PRT)
          distractors.add((data.P * data.R * data.T).toString());
        } else if (data.qType === 'FIND_P') {
          // Principal was P. Wrong: Interest * Time, or Interest * Rate
          distractors.add((data.I * data.T).toString());
          distractors.add((data.I * data.R).toString());
        } else if (data.qType === 'FIND_T') {
          // Time was T. Wrong: T + 1, T + 2, or P / I
          distractors.add((ans + 1).toString());
          distractors.add(Math.max(1, ans - 1).toString());
          distractors.add((ans * 2).toString());
        }
      }
    }

    // Fill up to 3 distractors with random arithmetic shifts if needed
    if (hasNumericAns) {
      let shift = 1;
      while (distractors.size < 3) {
        const distVal = ansNum + shift;
        if (distVal > 0) {
          distractors.add(distVal.toString());
        }
        shift = shift > 0 ? -shift : -shift + 1; // alternating sequence: 1, -1, 2, -2, 3, -3...
      }
    } else {
      // Text fallback options
      while (distractors.size < 3) {
        distractors.add(`Alternative ${distractors.size + 1}`);
      }
    }

    // Convert to array and take top 3
    const finalDistractors = Array.from(distractors)
      .filter(d => d !== correctAnswer)
      .slice(0, 3);
      
    return finalDistractors;
  }
};
