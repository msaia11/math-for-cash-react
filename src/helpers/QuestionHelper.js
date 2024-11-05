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
  var scrambledWord = "";
  do {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    scrambledWord = letters.join('')
  } while (scrambledWord == word);

  return scrambledWord;
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

export const translateNumToStr = (num) => {
  var str = '';
  switch (num) {
    case 0:
      str = "zero"
      break;
    case 1:
      str = "one"
      break;
    case 2:
      str = "two"
      break;
    case 3:
      str = "three"
      break;
    case 4:
      str = "four"
      break;
    case 5:
      str = "five"
      break;
    case 6:
      str = "six"
      break;
    case 7:
      str = "seven"
      break;
    case 8:
      str = "eight"
      break;
    case 9:
      str = "nine"
      break;
    case 10:
      str = "ten"
      break;
    default:
      break;
  }

  return str;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const wordUnscrambleArray =
[
  //start
  'aback', 'abate', 'abbey', 'abhor', 'abode', 'abort',
  'about', 'above', 'abuse', 'abyss', 'ached', 'acorn',
  'acrid', 'actor', 'acute', 'adapt', 'admit', 'adobe',
  'adore', 'adult', 'afire', 'after', 'again', 'agent',
  'agile', 'aging', 'agree', 'aider', 'aimed', 'aisle',
  'alarm', 'alert', 'algae', 'alias', 'alien', 'align',
  'alive', 'allow', 'alone', 'aloof', 'aloud', 'altar',
  'amber', 'amuse', 'angle', 'angst', 'annoy', 'aorta',
  'apple', 'apply', 'apron', 'argue', 'armor', 'aroma',
  'array', 'arrow', 'aside', 'asked', 'askew', 'asset',
  'aster', 'atone', 'audio', 'axial', 'bacon', 'badge',
  'baker', 'balmy', 'banjo', 'barge', 'based', 'basil',
  'beach', 'beast', 'beaux', 'beeps', 'begin', 'being',
  'belch', 'belly', 'beret', 'binge', 'bingo', 'bison',
  'black', 'blame', 'bland', 'blank', 'blast', 'blaze',
  'bleak', 'bleat', 'blend', 'bless', 'blimp', 'blind',
  'bliss', 'blitz', 'bloat', 'block',

  //100
  'bloom', 'blues', 'bluff', 'blunt', 'blush', 'boast',
  'bogus', 'bongo', 'booth', 'booze', 'bored', 'botox',
  'bound', 'brace', 'brain', 'brake', 'brass', 'brave',
  'brawl', 'brawn', 'break', 'briar', 'bribe', 'brick',
  'brief', 'brine', 'bring', 'brink', 'brisk', 'broil',
  'brood', 'brook', 'broom', 'broth', 'brown', 'bruin',
  'brunt', 'brush', 'brute', 'budge', 'bulge', 'bulky',
  'bumpy', 'bunch', 'bunny', 'buyer', 'cabin', 'cable',
  'caddy', 'cadet', 'cagey', 'camel', 'canal', 'candy',
  'cargo', 'carve', 'caste', 'catch', 'cedar', 'chair',
  'champ', 'chant', 'chase', 'cheek', 'cheer', 'chess',
  'chest', 'chill', 'chime', 'choke', 'chore', 'chuck',
  'churn', 'cider', 'clamp', 'clash', 'clasp', 'class',
  'clean', 'clear', 'clerk', 'click', 'cliff', 'climb',
  'cling', 'clock', 'cloud', 'clout', 'clove', 'clown',
  'cluck', 'clump', 'coast', 'cobra', 'cocoa', 'comet',
  'comic', 'coral', 'cover', 'cower',

  //200
  'crack', 'crane', 'crank', 'crash', 'crawl', 'crazy',
  'creak', 'creek', 'creep', 'crisp', 'crook', 'cross',
  'crown', 'crude', 'cruel', 'crumb', 'crush', 'curly',
  'curvy', 'cycle', 'daisy', 'dally', 'dance', 'dandy',
  'darts', 'daunt', 'death', 'debit', 'debut', 'defer',
  'delta', 'demon', 'dense', 'depth', 'devil', 'diary',
  'diner', 'dirty', 'disco', 'ditch', 'dizzy', 'dodge',
  'doing', 'doubt', 'dough', 'douse', 'draft', 'drain',
  'drama', 'drape', 'drawl', 'dread', 'dream', 'dress',
  'drift', 'drill', 'drink', 'droid', 'drone', 'druid',
  'ducky', 'dumpy', 'duvet', 'dwell', 'eager', 'eagle',
  'early', 'earth', 'eerie', 'eight', 'elbow', 'elder',
  'elect', 'elope', 'elude', 'embed', 'empty', 'enact',
  'enjoy', 'enter', 'entry', 'envoy', 'equal', 'equip',
  'error', 'essay', 'ether', 'event', 'every', 'evoke',
  'exile', 'exist', 'extra', 'fable', 'facet', 'faint',
  'fairy', 'fancy', 'farce', 'feast',

  //300
  'fence', 'fetch', 'fetus', 'fever', 'fiber', 'field',
  'fiend', 'fifth', 'fifty', 'fight', 'final', 'first',
  'flake', 'flame', 'flank', 'flare', 'flash', 'flask',
  'flesh', 'flick', 'flint', 'flirt', 'float', 'flock',
  'flood', 'floor', 'flora', 'flour', 'fluff', 'flush',
  'flute', 'focal', 'focus', 'folds', 'forge', 'forty',
  'found', 'frame', 'frank', 'fraud', 'freak', 'freed',
  'fresh', 'frill', 'front', 'frost', 'froth', 'frown',
  'froze', 'fruit', 'fudge', 'funny', 'fussy', 'fuzzy',
  'gamer', 'gland', 'glass', 'glaze', 'gleam', 'glide',
  'gloat', 'globe', 'gloom', 'glory', 'gloss', 'glove',
  'gnarl', 'going', 'goose', 'grace', 'grain', 'grant',
  'grape', 'grasp', 'grate', 'grave', 'great', 'green',
  'greet', 'grief', 'grill', 'grind', 'gripe', 'groin',
  'groom', 'grope', 'gross', 'grove', 'grump', 'grunt',
  'guess', 'guest', 'guide', 'guile', 'gully', 'habit',
  'haiku', 'handy', 'happy', 'harsh',

  //400
  'haste', 'hasty', 'hatch', 'haunt', 'haven', 'heart',
  'hefty', 'herbs', 'heron', 'hiked', 'hiker', 'hinge',
  'hitch', 'hoard', 'hobby', 'hoist', 'holly', 'homer',
  'honey', 'honor', 'horny', 'horse', 'hound', 'house',
  'hover', 'human', 'humor', 'hunky', 'hutch', 'icier',
  'ideal', 'idled', 'image', 'imbed', 'imply', 'inbox',
  'index', 'inert', 'infer', 'inlet', 'inner', 'input',
  'irony', 'irrit', 'islet', 'ivory', 'jaded', 'jeans',
  'jewel', 'joint', 'jolly', 'judge', 'juice', 'jumps',
  'jumpy', 'karma', 'kayak', 'kinky', 'kiosk', 'kites',
  'knack', 'knead', 'kneel', 'knelt', 'knife', 'knock',
  'knoll', 'knots', 'koala', 'kudos', 'large', 'laser',
  'latch', 'later', 'laugh', 'leafy', 'learn', 'leash',
  'leave', 'lemon', 'level', 'libel', 'light', 'liver',
  'livid', 'local', 'lofty', 'loony', 'loose', 'loyal',
  'lucid', 'lucky', 'lumpy', 'lunar', 'lunch', 'lurch',
  'lurid', 'madly', 'magic', 'maize',

  //500
  'mango', 'manor', 'maple', 'marsh', 'maybe', 'meant',
  'meaty', 'medal', 'media', 'medic', 'meets', 'melee',
  'melon', 'mercy', 'merit', 'merry', 'mimic', 'mince',
  'minus', 'miser', 'mocha', 'model', 'moist', 'molar',
  'moldy', 'money', 'month', 'moose', 'moral', 'motif',
  'motor', 'mount', 'mourn', 'mouse', 'movie', 'mucky',
  'muggy', 'music', 'naive', 'nasty', 'naval', 'needy',
  'nerdy', 'nerve', 'never', 'newly', 'niche', 'niece',
  'nifty', 'night', 'noble', 'noise', 'novel', 'nudge',
  'nurse', 'oasis', 'obese', 'occur', 'ocean', 'octal',
  'octet', 'odder', 'oddly', 'offal', 'olive', 'onion',
  'opine', 'opium', 'orbit', 'organ', 'other', 'outgo',
  'overt', 'palsy', 'panic', 'pansy', 'parka', 'party',
  'pasta', 'pasty', 'paved', 'peace', 'pecan', 'penal',
  'perch', 'peril', 'pesky', 'pesto', 'petty', 'phase',
  'phone', 'piano', 'piece', 'pinky', 'place', 'plaid',
  'plane', 'plant', 'plate', 'plaza',

  //600
  'pluck', 'plush', 'point', 'poise', 'polar', 'poppy',
  'pouch', 'pound', 'prick', 'pride', 'probe', 'prong',
  'proud', 'proxy', 'puffy', 'pulse', 'punch', 'pupil',
  'purse', 'quack', 'quail', 'quark', 'quart', 'quash',
  'queen', 'query', 'quest', 'quiet', 'quill', 'quilt',
  'quirk', 'quota', 'quote', 'rabid', 'racer', 'radar',
  'radio', 'rainy', 'rally', 'ranch', 'range', 'ratio',
  'ratty', 'raven', 'razor', 'reach', 'ready', 'realm',
  'rebel', 'reign', 'reset', 'resin', 'revel', 'ridge',
  'right', 'rigor', 'risky', 'river', 'roast', 'robin',
  'robot', 'rogue', 'roost', 'round', 'rowdy', 'rugby',
  'ruler', 'rumor', 'rusty', 'saber', 'salad', 'salty',
  'sandy', 'sauce', 'savor', 'scale', 'scamp', 'scene',
  'scent', 'scoff', 'scold', 'scone', 'scope', 'score',
  'scorn', 'scout', 'scrub', 'scrum', 'scuff', 'seize',
  'sense', 'seven', 'sever', 'shade', 'shame', 'shank',
  'shard', 'shark', 'shave', 'shear',

  //700
  'sheep', 'sheer', 'sheet', 'shift', 'shine', 'shiny',
  'shire', 'shirt', 'shock', 'shone', 'shore', 'short',
  'shout', 'shrub', 'shrug', 'sight', 'silky', 'silly',
  'since', 'sinus', 'siren', 'skate', 'skimp', 'skirt',
  'skull', 'skunk', 'slang', 'slant', 'sleek', 'sleep',
  'sleet', 'slice', 'slick', 'slosh', 'sloth', 'slump',
  'smack', 'small', 'smart', 'smash', 'smell', 'smile',
  'smirk', 'smoke', 'snail', 'snare', 'snarl', 'sneak',
  'snide', 'sniff', 'snoop', 'snore', 'snout', 'snowy',
  'soapy', 'sober', 'solar', 'sonar', 'sooth', 'sorry',
  'sound', 'space', 'spade', 'spasm', 'speak', 'spear',
  'spend', 'spice', 'spike', 'spine', 'spiny', 'spite',
  'spoke', 'spool', 'spoon', 'spout', 'spree', 'spurn',
  'squat', 'squid', 'stain', 'stake', 'stand', 'stark',
  'start', 'steak', 'steed', 'steep', 'sting', 'stink',
  'stoic', 'stomp', 'stone', 'store', 'stork', 'storm',
  'stout', 'strip', 'study', 'stuff',

  //800
  'stung',  'style', 'sugar', 'sunny', 'swamp', 'swell',
  'swept',  'swing', 'swipe', 'swirl', 'swoon', 'swoop',
  'tabby',  'table', 'tacit', 'tacky', 'tally', 'tango',
  'taper',  'tardy', 'taste', 'tasty', 'taunt', 'teach',
  'tease',  'teeth', 'tempo', 'tenor', 'tenth', 'thank',
  'their',  'theme', 'there', 'thing', 'think', 'those',
  'though', 'three', 'throb', 'thump', 'tidal', 'tiger',
  'timer',  'title', 'today', 'tooth', 'topic', 'torch',
  'total',  'tough', 'tower', 'track', 'trail', 'train',
  'tramp',  'trash', 'tread', 'trend', 'trial', 'trick',
  'troop',  'trout', 'trove', 'truce', 'truly', 'trump',
  'trunk',  'trust', 'truth', 'tulip', 'tunic',
  'tweak',  'tweed', 'twice', 'twine', 'twirl', 'twist',
  'udder',  'ulcer', 'ultra', 'umbra', 'uncle', 'union',
  'unite',  'unity', 'until', 'unzip', 'upend', 'upper',
  'upset',  'urban', 'usher', 'using', 'usual', 'vague',
  'value',  'vapid', 'vapor', 'vault',

  //900
  'venom', 'venue', 'verge', 'verse', 'verve',
  'video', 'vigor', 'vinyl', 'vivid', 'vocal',
  'voice', 'vomit', 'voted', 'voter', 'vouch',
  'vowel', 'wacky', 'wafer', 'wager', 'waist',
  'waive', 'waltz', 'waste', 'watch', 'water',
  'waver', 'weary', 'weave', 'wedge', 'weigh',
  'whack', 'whale', 'wheat', 'wheel', 'where',
  'whiff', 'while', 'whine', 'whirl', 'whisk',
  'white', 'whole', 'wider', 'wield', 'wince',
  'wiser', 'witty', 'woody', 'world', 'would',
  'wound', 'wrath', 'wring', 'wrist', 'write',
  'wrote', 'xenon', 'xeric', 'xylem', 'yacht',
  'yearn', 'yeast', 'yield', 'yodel', 'young',
  'youth', 'yummy', 'zebra', 'zesty', 'zippy',
  'zonal',

  //New words
  'group'
];
