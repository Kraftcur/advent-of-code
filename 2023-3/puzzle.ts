import { getReaderInterface } from '../file';

const run = () => {
  var lineReader = getReaderInterface('./2023-3/input.txt');

  puzzle(lineReader);
};

interface NumberInfo {
  indexGroup: number[];
  number: number;
}

interface Line {
  lineNumber: number;
  symbolIndexes: number[];
  numbersInfo: NumberInfo[];
  partNumbers: Map<string, number>;
  sumOfPartNumbers: number;
}

function puzzle(lineReader: any): void {
  let lineNumber: number = 1;
  let previousLine: Line;
  let finalizedLines: Line[] = [];
  let sumOfAllPartNumbers: number = 0;

  lineReader.on('line', (line: string) => {
    let { currentLine, prevLine } = processLine(line, lineNumber, previousLine);
    if (prevLine) {
      finalizedLines.push(prevLine);
      sumOfAllPartNumbers = sumOfAllPartNumbers + prevLine.sumOfPartNumbers;
    }
    previousLine = currentLine;
    lineNumber += 1;
  });

  lineReader.on('close', () => {
    if (previousLine) {
      finalizedLines.push(previousLine);
      sumOfAllPartNumbers = sumOfAllPartNumbers + previousLine.sumOfPartNumbers;
    }
    console.log('Answer: ', sumOfAllPartNumbers);
  });
}

function getIndexGroup(
  numLength: number,
  currentIndex: number,
  totalLineLen: number
) {
  return [...Array(numLength + 2)].map((n, i) => {
    let newIndex = currentIndex - Number(i);
    if (newIndex >= 0 && newIndex <= totalLineLen - 1) {
      return newIndex;
    }
    return;
  }) as number[];
}

function addPartTotalToLine(partNumber: number, line: Line) {
  line.sumOfPartNumbers = line.sumOfPartNumbers + partNumber;
}

function addPartNumber(
  partNumber: number | string,
  indexOfNumber: number,
  line: Line
) {
  let part = Number(partNumber);
  let key = `${line.lineNumber}_${indexOfNumber}_${partNumber}`;

  line.partNumbers.set(key, part);
  addPartTotalToLine(part, line);
}

function addNumberInfoForLine(
  partNumber: string | number,
  indexGroup: number[],
  line: Line
) {
  let possiblePartNum = Number(partNumber);
  let possiblePartNumInfo = { indexGroup, number: possiblePartNum };
  line.numbersInfo.push(possiblePartNumInfo);
}

function processLine(
  line: string,
  lineNumber: number,
  prevLine?: Line
): { currentLine: Line; prevLine: Line | undefined } {
  let currentLine: Line = {
    lineNumber,
    symbolIndexes: [],
    numbersInfo: [],
    partNumbers: new Map(),
    sumOfPartNumbers: 0,
  };
  let totalLineLen = line.length;
  let leadingSymbol = false;

  let index: number = 0;
  let num: string = '';
  for (let char of line) {
    if (char === '.') {
      // if we have a part number, then save it
      if (num) {
        let indexGroup: number[] = getIndexGroup(
          num.length,
          index,
          totalLineLen
        ) as number[];

        addNumberInfoForLine(num, indexGroup, currentLine);

        if (leadingSymbol) {
          addPartNumber(num, indexGroup[indexGroup.length - 2], currentLine);
        }

        // if previous line, check if the number is next to a symbol in the previous line.
        if (prevLine) {
          prevLine.symbolIndexes.forEach((prevSymbolIndex) => {
            if (indexGroup.includes(prevSymbolIndex)) {
              addPartNumber(
                num,
                indexGroup[indexGroup.length - 2],
                currentLine
              );
            }
          });
        }
      }
      leadingSymbol = false;
      num = '';
      index++;
      continue;
    } else if (typeof Number(char) === 'number' && !isNaN(Number(char))) {
      num = num.concat(char);
    } else {
      currentLine.symbolIndexes.push(index);
      leadingSymbol = true;
      if (num) {
        addPartNumber(num, index - num.length, currentLine);
      }

      // we have a symbol, lets check if a number from prev line is near it and add it if found
      if (prevLine) {
        prevLine.numbersInfo.forEach((numInfo, idx) => {
          if (numInfo.indexGroup.includes(index)) {
            addPartNumber(
              numInfo.number,
              numInfo.indexGroup[numInfo.indexGroup.length - 2],
              prevLine
            );
          }
        });
      }
      num = '';
    }
    index++;
  }
  // we have a number at the end of the line
  if (num) {
    let indexGroup: number[] = getIndexGroup(
      num.length,
      index,
      totalLineLen
    ) as number[];

    addNumberInfoForLine(num, indexGroup, currentLine);

    if (leadingSymbol) {
      addPartNumber(num, indexGroup[indexGroup.length - 2], currentLine);
    }

    // check if we should add it due to symbol in prev line
    if (prevLine) {
      prevLine.symbolIndexes.forEach((prevSymbolIndex) => {
        if (indexGroup.includes(prevSymbolIndex)) {
          addPartNumber(num, indexGroup[indexGroup.length - 2], currentLine);
        }
      });
    }
  }
  return { currentLine, prevLine };
}

run();

// Answer:  507214
