import { getReaderInterface } from '../file';

const run = () => {
  var lineReader = getReaderInterface('./2023-2/input.txt');
  puzzle(lineReader);
};

function puzzle(lineReader: any): void {
  let gameIdsSum: number = 0;
  let minPowerSum: number = 0;
  lineReader.on('line', (line: string) => {
    let game: Game = tokenizeLine(line);
    if (game.isValid) {
      gameIdsSum = gameIdsSum + Number(game.game);
    }
    minPowerSum = minPowerSum + game.redMin * game.blueMin * game.greenMin;

    console.log('GAME: ', game);
  });

  lineReader.on('close', () => {
    console.log('Answer: ', gameIdsSum, minPowerSum);
  });
}

interface Game {
  game: string;
  sets: Set[];
  total: Set;
  redMin: number;
  blueMin: number;
  greenMin: number;
  isValid: boolean;
}

interface Set {
  red: number;
  blue: number;
  green: number;
}

const isValidLimits = {
  red: 12,
  green: 13,
  blue: 14,
};

type Keys = 'red' | 'blue' | 'green';

let newSetToken = ';';
let newColorToken = ',';
let gameStartToken = ':';

function tokenizeLine(line: string): Game {
  let game: Game = {
    game: '',
    sets: [],
    total: { red: 0, blue: 0, green: 0 },
    redMin: 0,
    blueMin: 0,
    greenMin: 0,
    isValid: true,
  };

  let currentKey: string = '';
  let currentDigit: string = '';
  let currentSet: Set = { red: 0, blue: 0, green: 0 };

  const commitSet = () => {
    game.sets.push(currentSet);
    game.total.blue += currentSet.blue;
    game.total.green += currentSet.green;
    game.total.red += currentSet.red;

    if (currentSet.red > game.redMin) {
      game.redMin = currentSet.red;
    }
    if (currentSet.blue > game.blueMin) {
      game.blueMin = currentSet.blue;
    }
    if (currentSet.green > game.greenMin) {
      game.greenMin = currentSet.green;
    }
  };

  const addColor = () => {
    let key: Keys = currentKey as Keys;

    let newVal = Number(currentSet[key]) + Number(currentDigit);

    currentSet = { ...currentSet, [key]: newVal };

    if (currentSet[key] > isValidLimits[key]) {
      game.isValid = false;
    }
    resetColor();
  };

  const resetColor = () => {
    currentKey = '';
    currentDigit = '';
  };

  const resetAll = () => {
    currentKey = '';
    currentDigit = '';
    currentSet = { red: 0, blue: 0, green: 0 };
  };

  for (let char of line) {
    if (char === ' ') {
      continue;
    }

    if (!game.game && char === gameStartToken) {
      game.game = currentDigit;
      resetColor();
      continue;
    }

    switch (char) {
      case newColorToken:
        addColor();
        break;

      case newSetToken:
        addColor();
        commitSet();
        resetAll();
        break;

      default:
        if (isNaN(Number(char))) {
          currentKey = currentKey.concat(char);
        } else {
          currentDigit = currentDigit.concat(char);
        }
        break;
    }
  }

  addColor();
  commitSet();

  return game;
}

run();
