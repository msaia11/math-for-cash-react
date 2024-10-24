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



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const wordUnscrambleArray =
[
  //Start - 0
  'audio', 'brick', 'plant', 'plumb', 'vouch', 'knelt',
  'banjo', 'crumb', 'blaze', 'grape', 'joint', 'charm',
  'pride', 'truce', 'flint', 'crisp', 'swoop', 'fable',
  'gloat', 'mirth', 'trend', 'whale', 'glint',
  'swirl', 'champ', 'frown', 'daisy', 'grief',
  'sheep', 'pluck', 'quilt', 'brisk', 'grind', 'smirk',
  'scorn', 'spine', 'clash', 'globe', 'haste',
  'blunt', 'sting', 'trail', 'swamp', 'plush',
  'drill', 'fraud', 'creep', 'scope', 'flock', 'glide',
  'shrug', 'crown', 'grant', 'crank', 'steep', 'flare',
  'thump', 'brave', 'glove', 'crush', 'wince', 'grove',
  'bloom', 'flute', 'plume', 'stark', 'stomp',
  'grasp', 'quill', 'snarl', 'tread', 'gleam', 'feast',
  'throb', 'drift', 'brink', 'clown', 'smash', 'pouch',
  'chess', 'flake', 'bliss', 'grill', 'clasp', 'prong',
  'twist', 'whiff', 'flick', 'churn', 'sloth',
  'brawl', 'creek', 'blast', 'scout',

  //100
  'brood', 'scamp', 'prick', 'blush',
  'grope', 'bloat', 'freak', 'shank', 'spree',
  'flask', 'broil', 'shave', 'fluff', 'spear', 'crawl',
  'scrub', 'thrum', 'gloom', 'spike', 'swill', 'shrub',
  'shone', 'scuff', 'shade', 'scold',
  'swell', 'spoke', 'flirt', 'brass', 'flank', 'scrum',
  'click', 'crook', 'creak', 'choke', 'groin', 'flash',
  'gripe', 'shard', 'slice', 'blitz', 'snout', 'trunk',
  'slick', 'abhor', 'acrid', 'algae', 'amuse', 'angst',
  'apron', 'basil', 'belch', 'beret', 'bleak', 'board',
  'bogus', 'booth', 'bribe', 'brush', 'budge', 'bulky',
  'bumpy', 'cabin', 'cargo', 'carve', 'chant', 'cloud',
  'cluck', 'clump', 'coast', 'cobra', 'comet', 'crone',
  'crude', 'curly', 'curvy', 'cycle', 'debit', 'demon',
  'dizzy', 'drone', 'dumpy', 'duvet', 'eager', 'elbow',
  'elope', 'elude', 'envoy', 'facet', 'fetch', 'fetus',
  'fiend', 'flora', 'forge', 'freed',

  //200
  'fudge', 'fussy', 'gland', 'gnarl', 'groom', 'haiku',
  'haven', 'hinge', 'hoist', 'hound', 'hunky', 'hutch',
  'ivory', 'jaded', 'jeans', 'jolly', 'jumpy', 'karma',
  'kayak', 'knead', 'lathe', 'latch',
  'livid', 'lumpy', 'lurch', 'lurid', 'madly', 'maize',
  'manor', 'marsh', 'medic', 'melee', 'merit', 'mince',
  'mocha', 'moist', 'molar', 'mourn', 'mucky', 'nerve',
  'nifty', 'nudge', 'odder', 'oddly', 'orbit', 'paddy',
  'palsy', 'panic', 'pansy', 'parka', 'pecan',
  'penal', 'perch', 'peril', 'pesky', 
  'poise', 'probe', 'proxy', 'puffy', 'pupil', 'quack',
  'quail', 'quart', 'quest', 'quota', 'rabid', 'ranch',
  'raven', 'risky', 'roast', 'rogue', 'rowdy', 'ruddy',
  'ruler', 'runic', 'rusty', 'sable', 'scent', 'sever',
  'shear', 'shire', 'silky', 'sinus', 'skimp', 'slump',
  'smack', 'soapy', 'spade', 'spasm', 'spite', 'spool',
  'spurn', 'squat', 'stork',

  //300
  'stout', 'strip', 'stung', 'tacit', 'tacky',
  'tally', 'taper', 'tardy', 'tasty', 'taunt', 'tenth',
  'thorn', 'tidal', 'torch', 'trove', 'tulip', 'tunic',
  'ulcer', 'unzip', 'vague', 'vapid', 'vault', 'vivid',
  'vocal', 'vomit', 'wafer', 'wager', 'waive', 'waltz',
  'weave', 'whack', 'whirl', 'woody', 'wring', 'wrist',
  'wrote', 'yacht', 'yearn', 'yeast', 'zonal', 'adapt',
  'afire', 'agree', 'amber', 'apple', 'badge',
  'baker', 'beach', 'beard', 'beast', 'boast', 'bored',
  'brace', 'bread', 'brunt', 'cable', 'candy',
  'dread', 'dress', 'druid', 'eagle', 'equal', 'fresh',
  'grave', 'greet', 'habit', 'hatch', 'hiker', 'honor',
  'lemon', 'loose', 'mango', 'march', 'mould', 'naive',
  'naval', 'nerdy', 'newly', 'ocean', 'opine', 'other',
  'piano', 'realm', 'salty', 'sheer', 'sight', 'sneak',
  'snowy', 'speak', 'spice', 'stain', 'steed', 'stone',
  'study', 'style', 'table', 'tiger',

  //400
  'tired',  'tooth', 'truly', 'upset',  'venue', 'vigor',
  'waste',  'weary', 'wheel', 'widen',  'wiser', 'worth',
  'zesty',  'abbey', 'abode', 'actor',  'admit', 'aider',
  'altar',  'aroma', 'asset', 'bingo', 'bongo',
  'cider',  'cliff', 'cocoa', 'coral',  'dairy', 'dally',
  'eerie', 'elder', 'empty',  'enjoy', 'exile',
  'fairy',  'fancy', 'fifty', 'flour',  'folds', 'guile',
  'happy',  'heron', 'hover', 'imply',  'index', 'inert',
  'input',  'islet', 'judge', 'kneel',  'knock', 'laser',
  'leash',  'melon', 'miser',  'motor', 'needy',
  'opium',  'polar', 'punch', 'ratty',  'reset', 'rifle',
  'robin',  'rumor', 'salad', 'score',  'seize', 'shine',
  'shout',  'skirt', 'skull', 'smart',  'sober', 'sonar',
  'swoon',  'ultra', 'voter', 'xenon',  'yummy', 'zebra',
  'climb',  'doubt', 'frost', 'knife',  'lunch', 'magic',
  'queen',  'umbra', 'bacon', 'early',  'ideal', 'jewel',
  'night',  'quark', 'rebel', 'uncle',

  //500
  'yield', 'crane',  'dodge', 'haunt', 'koala', 'merry',
  'noble', 'river',  'timer', 'usher', 'vowel', 'watch',
  'young', 'dance',  'harsh', 'knack', 'novel', 'plaza',
  'resin', 'tough',  'zippy', 'abyss', 'brawn', 'flame',
  'inbox',  'midge', 'octal', 'pinky', 'rally',
  'witty', 'brine', 'cower', 'douse', 'ether',
  'hasty', 'kinky',  'lunar', 'media', 'rugby', 'tweed',
  'unite', 'wrath',  'xeric', 'alert', 'binge', 'ducky',
  'fifth', 'horny',  'light', 'niche', 'raise', 'tramp',
  'usual', 'whine',  'axial', 'event', 'fuzzy', 'infer',
  'paved', 'quash',  'reach', 'tenor', 'wedge', 'xylem',
  'yodel', 'drama',  'fence', 'humor', 'mouse', 'onion',
  'plaid', 'quirk',  'trout', 'clamp', 'drain', 'flush',
  'heart', 'inlet',  'union', 'wider', 'blend', 'frank',
  'moose', 'olive',  'sugar', 'wheat', 'arise', 'clean',
  'email', 'knoll',  'local', 'money', 'ridge', 'swing',
  'tweak', 'upper',  'askew', 'bluff',

  //600
  'crash', 'defer', 'frill', 'glaze', 'herbs', 'savor',
  'tease', 'upend', 'voice', 'above', 'brief', 'chill',
  'entry', 'human', 'slant', 'dream', 'inner',
  'racer', 'honey', 'radar', 'trump', 'aback', 'abate',
  'abort', 'ached', 'acorn', 'adore', 'aegis', 'aging',
  'aimed', 'alien', 'alive', 'anger', 'aorta', 'ashen',
  'asked', 'atone', 'beeps', 'bison', 'blame',
  'block', 'booze', 'bound', 'broom', 'buyer', 'cadet',
  'camel', 'canal', 'cheer', 'chore', 'cling', 'clove',
  'debut', 'devil', 'ditch', 'dwell', 'embed', 'equip',
  'error', 'essay', 'exist', 'fiber', 'flood', 'focal',
  'froze', 'gloss', 'grump', 'handy', 'hiked', 'hoard',
  'house', 'imbed', 'image', 'irony', 'kiosk', 'knots',
  'later', 'level', 'loyal', 'lucky', 'nasty',
  'noise', 'nurse', 'occur', 'offal', 'outgo', 'pasta',
  'poppy', 'ratio', 'robot', 'scone', 'shiny', 'skate',
  'snide', 'spiny', 'swept', 'tamer',

  //700
  'taste', 'teeth', 'tempo', 'topic', 'trust',  'udder',
  'urban', 'vapor', 'wacky', 'whisk', 'youth',  'aloof',
  'aside', 'caddy', 'clerk', 'clout', 'dandy',  'dough',
  'faint', 'hitch', 'homer', 'idled', 'irrit',  'lofty',
  'octet', 'reign', 'sandy', 'slang', 'smile',  'snoop',
  'tried', 'tubed', 'waist', 'water', 'weigh',  'brown',
  'enact', 'jumps', 'medal', 'revel',
  'trial', 'blimp', 'gamer', 'grace', 'kites',  'leafy',
  'louse', 'meaty', 'meets', 'movie', 'pasty',  'query',
  'shirt', 'storm', 'train', 'wield', 'world',  'abuse',
  'adult', 'agent', 'alone', 'angle', 'armor',  'belly',
  'blank', 'brain', 'broad', 'catch', 'chair',  'chest',
  'clear', 'crack', 'diner', 'disco', 'enter',  'evoke',
  'found', 'frame', 'glory', 'grain', 'meant',
  'quote', 'saber', 'shale', 'sleek',  'slosh',
  'sniff', 'space', 'verse', 'wound', 'bland',  'brute',
  'caste', 'clock', 'darts', 'dense',

  //800
  'diary',  'drape',  'farce', 'fever', 'laugh',  'mercy',
  'peace',  'sheen',  'shore', 'sooth', 'stoic',  'track',
  'twine',  'venom',  'drawl', 'first', 'forty',  'goose',
  'guide',  'juice', 'mimic', 'model',  'plane',
  'proud',  'scene', 'scoff', 'tango',  'unity',
  'waver',  'adobe', 'after', 'agile',  'alarm',
  'apply',  'array',  'arrow', 'aster', 'augur',  'beaux',
  'briar',  'broth',  'bunch', 'caper', 'cedar',
  'comic',  'depth', 'draft',  'flesh',
  'float',  'focus',  'gully', 'hefty', 'hobby',  'horse',
  'liver',  'moral',  'obese', 'pacer', 'quiet',  'radio',
  'rigor',  'silly', 'siren', 'snare',  'spout',
  'squid',  'tabby',  'total', 'white', 'write',  'blues',
  'bunny',  'chase',  'cross', 'daunt', 'delta',  'droid',
  'earth',  'froth',  'maple', 'music', 'sound',  'store',
  'sunny',  'bleat', 'fruit',
  'guest',  'kudos',  'motif', 'roost',

  //900
  'scale',  'solar', 'tempy',
  'twirl',  'verge', 'aloud',
  'balmy',  'break',
  'bring',  'cagey', 
  'elect',  'henry', 'holly',
  'icier',  'loony', 'moldy',
  'muggy',  'nappe', 'overt',
  'rainy',  'razor', 'skunk',
  'tower', 'twice',
  'verve'
];
