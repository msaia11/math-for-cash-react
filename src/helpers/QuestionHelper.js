import { evaluate } from "mathjs";

export const generateMathQuestion = () => {
  var retVal = ''; 
  var opChars = '+*-';
  var threeOrFourDigits = getRandomInt(2); // 0 = three digits, 1 = four digits

  do {
    var num1 = Math.ceil(Math.random() * 9);
    var num2 = Math.ceil(Math.random() * 9);
    var num3 = Math.ceil(Math.random() * 9); 
    var num4 = Math.ceil(Math.random() * 9);
    var op1 = opChars.charAt(Math.floor(Math.random() * opChars.length));
    var op2 = opChars.charAt(Math.floor(Math.random() * opChars.length));
    var op3 = opChars.charAt(Math.floor(Math.random() * opChars.length));
    var parenthesisPosition = (threeOrFourDigits == 1) ? getRandomInt(11) : getRandomInt(3);

    if (threeOrFourDigits == 1) {
      switch (parenthesisPosition) {
        case 0:
          retVal = num1 + op1 + num2 + op2 + num3 + op3 + num4;
          break;
        case 1:
          retVal = "(" + num1 + op1 + num2 + ")" + op2 + num3 + op3 + num4;
          break;
        case 2:
          retVal = num1 + op1 + "(" + num2 + op2 + num3 + ")" + op3 + num4;
          break;
        case 3:
          retVal = num1 + op1 + num2 + op2 + "(" + num3 + op3 + num4 + ")";
          break;
        case 4:
          retVal = "(" + num1 + op1 + num2 + op2 + num3 + ")" + op3 + num4;
          break;
        case 5:
          retVal = num1 + op1 + "(" + num2 + op2 + num3 + op3 + num4 + ")";
          break;
        case 6:
          retVal = "(" + num1 + op1 + num2 + ")" + op2 + "(" + num3 + op3 + num4 + ")";
          break;
        case 7:
          retVal = "((" + num1 + op1 + num2 + ")" + op2 + num3 + ")" + op3 + num4;
          break;
        case 8:
          retVal = "(" + num1 + op1 + "(" + num2 + op2 + num3 + "))" + op3 + num4;
          break;
        case 9:
          retVal = num1 + op1 + "((" + num2 + op2 + num3 + ")" + op3 + num4 + ")";
          break;
        case 10:
          retVal = num1 + op1 + "(" + num2 + op2 + "(" + num3 + op3 + num4 + "))";
          break;
        default:
          break;
      }
    }
    else if (threeOrFourDigits == 0) {
      switch (parenthesisPosition) {
        case 0:
          retVal = num1 + op1 + num2 + op2 + num3;
          break;
        case 1:
          retVal = "(" + num1 + op1 + num2 + ")" + op2 + num3;
          break;
        case 2:
          retVal = num1 + op1 + "(" + num2 + op2 + num3 + ")";
          break;
        default:
          break;
      }
    }
  } while (evaluate(retVal) < 0);
  
  return retVal; 
}


export const getWordToUnscramble = () => {
  var word = wordUnscrambleArray[Math.floor(Math.random() * wordUnscrambleArray.length)];
  return word;
}

export const generateWordUnscrambleQuestion = (word) => {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  return letters.join('');
}


export const generateMathSequenceQuestion = () => {
  const patternType = Math.floor(Math.random() * 4); // 4 different patterns
  let sequence = [];
  let fifthNumber;

  const ensurePositive = (num) => Math.max(1, num); // Ensure number >= 1

  switch (patternType) {
    case 0: // Alternating Increment-Decrement (same as before)
      const startAlt = Math.floor(Math.random() * 20) + 1; // 1-20
      const stepAlt = Math.floor(Math.random() * 5) + 1;   // 1-5
      for (let i = 0; i < 4; i++) {
        const change = i % 2 === 0 ? stepAlt : -stepAlt;
        sequence.push(startAlt + change * Math.floor(i / 2));
      }
      fifthNumber = startAlt + (4 % 2 === 0 ? stepAlt : -stepAlt) * 2;
      break;

    case 1: // Two-Step Increment Pattern
      const startTwoStep = Math.floor(Math.random() * 20) + 1; // 1-20
      const stepSmall = Math.floor(Math.random() * 3) + 1;     // 1-3
      const stepLarge = Math.floor(Math.random() * 7) + 4;     // 4-10
      for (let i = 0; i < 4; i++) {
        const step = i % 2 === 0 ? stepSmall : stepLarge;
        sequence.push(startTwoStep + (i === 0 ? 0 : step));
        startTwoStep += step;
      }
      fifthNumber = startTwoStep + (4 % 2 === 0 ? stepSmall : stepLarge);
      break;

    case 2: // Alternating Multiplication and Division
      const startAltMul = Math.floor(Math.random() * 10) + 2;  // 2-10
      const factorMul = Math.floor(Math.random() * 3) + 2;     // 2-4
      for (let i = 0; i < 4; i++) {
        const change = i % 2 === 0 ? factorMul : 1 / factorMul;
        sequence.push(Math.round(ensurePositive(startAltMul * Math.pow(change, i))));
      }
      fifthNumber = Math.round(ensurePositive(startAltMul * Math.pow(4 % 2 === 0 ? factorMul : 1 / factorMul, 4)));
      break;

    case 3: // Additive Pattern with Alternating Big and Small Steps
      const startAdd = Math.floor(Math.random() * 20) + 1; // 1-20
      const bigStep = Math.floor(Math.random() * 10) + 5;  // 5-15
      const smallStep = Math.floor(Math.random() * 3) + 1; // 1-3
      for (let i = 0; i < 4; i++) {
        const step = i % 2 === 0 ? bigStep : smallStep;
        sequence.push(startAdd + step * i);
      }
      fifthNumber = startAdd + (bigStep * 2 + smallStep * 2);
      break;

    default:
      break;
  }

  return { sequence, answer: fifthNumber };
};



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const wordUnscrambleArray =
["audio", "brick", "plant", "plumb", "vouch", "knelt", "banjo", "crumb"];