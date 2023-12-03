import { getReaderInterface } from '../file';

const run = () => {
  var lineReader = getReaderInterface('./2023-1/input.txt');

  puzzle(lineReader);
};

const possibleNumbersSpelledOut = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];
const numberMap: { [key: string]: number } = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

let indexOfFirst = -1;
let indexOfLast = -1;
let firstDigit = -1;
let lastDigit = -1;

const extractNumbersFromLine = (line: string) => {
  possibleNumbersSpelledOut.forEach((val, index) => {
    let indexOfVal = line.indexOf(val);
    let lastIndexOfVal = line.lastIndexOf(val);
    if (indexOfVal !== -1) {
      if (indexOfFirst === -1) {
        firstDigit = index + 1;
        indexOfFirst = indexOfVal;
        lastDigit = index + 1;
        indexOfLast = lastIndexOfVal;
      } else {
        if (indexOfVal < indexOfFirst) {
          firstDigit = index + 1;
          indexOfFirst = indexOfVal;
        }

        if (lastIndexOfVal > indexOfLast) {
          lastDigit = index + 1;
          indexOfLast = lastIndexOfVal;
        }
      }
    }
  });

  let found = firstDigit !== -1 ? true : false;

  return { found, firstDigit, lastDigit };
};

const puzzle = async (lineReader: any) => {
  let sum = 0;
  lineReader.on('line', (line: string) => {
    extractNumbersFromLine(line);

    for (let i = 0; i < line.length; i++) {
      let num = Number(line[i]);
      if (num) {
        if (firstDigit === -1) {
          firstDigit = num;
          indexOfFirst = i;
          lastDigit = num;
          indexOfLast = i;
        } else {
          if (i < indexOfFirst) {
            firstDigit = num;
            indexOfFirst = i;
          }
          if (i > indexOfLast) {
            lastDigit = num;
            indexOfLast = i;
          }
        }
      }
    }

    sum += Number(String(firstDigit)?.concat(String(lastDigit)));
    firstDigit = -1;
    lastDigit = -1;
    indexOfFirst = -1;
    indexOfLast = -1;

    console.log(sum);
  });
};

// 53221
run();
